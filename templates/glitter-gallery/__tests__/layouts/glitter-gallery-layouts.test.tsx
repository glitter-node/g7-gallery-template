/**
 * @vitest-environment jsdom
 */

import React from 'react';
import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createLayoutTest, screen, waitFor } from '@core/template-engine/__tests__/utils/layoutTestUtils';
import { ComponentRegistry } from '@core/template-engine/ComponentRegistry';

type JsonValue = Record<string, any>;

type TestLayout = {
  layout_name?: string;
  version?: string;
  meta?: Record<string, any>;
  components?: JsonValue[];
  data_sources?: JsonValue[];
};

type BasicProps = Record<string, any> & {
  children?: React.ReactNode;
  text?: string;
};

const templateRoot = path.resolve(__dirname, '../..');
const layoutsRoot = path.join(templateRoot, 'layouts');
const langRoot = path.join(templateRoot, 'lang');

function createBasic(tag: string) {
  return function BasicComponent({ children, text, ...props }: BasicProps) {
    return React.createElement(tag, props, children ?? text);
  };
}

const TestDiv = createBasic('div');
const TestSection = createBasic('section');
const TestArticle = createBasic('article');
const TestNav = createBasic('nav');
const TestA = createBasic('a');
const TestSpan = createBasic('span');
const TestP = createBasic('p');
const TestH1 = createBasic('h1');
const TestH2 = createBasic('h2');
const TestH3 = createBasic('h3');
const TestUl = createBasic('ul');
const TestLi = createBasic('li');
const TestForm = createBasic('form');
const TestLabel = createBasic('label');
const TestTextarea = createBasic('textarea');
const TestButton = createBasic('button');
const TestFragment = ({ children }: { children?: React.ReactNode }) => React.createElement(React.Fragment, null, children);

function TestInput(props: Record<string, any>) {
  return React.createElement('input', props);
}

function TestImg(props: Record<string, any>) {
  return React.createElement('img', props);
}

function setupRegistry(): ComponentRegistry {
  const registry = ComponentRegistry.getInstance();
  (registry as any).registry = {
    Div: { component: TestDiv, metadata: { name: 'Div', type: 'basic' } },
    Section: { component: TestSection, metadata: { name: 'Section', type: 'basic' } },
    Article: { component: TestArticle, metadata: { name: 'Article', type: 'basic' } },
    Nav: { component: TestNav, metadata: { name: 'Nav', type: 'basic' } },
    A: { component: TestA, metadata: { name: 'A', type: 'basic' } },
    Span: { component: TestSpan, metadata: { name: 'Span', type: 'basic' } },
    P: { component: TestP, metadata: { name: 'P', type: 'basic' } },
    H1: { component: TestH1, metadata: { name: 'H1', type: 'basic' } },
    H2: { component: TestH2, metadata: { name: 'H2', type: 'basic' } },
    H3: { component: TestH3, metadata: { name: 'H3', type: 'basic' } },
    Ul: { component: TestUl, metadata: { name: 'Ul', type: 'basic' } },
    Li: { component: TestLi, metadata: { name: 'Li', type: 'basic' } },
    Form: { component: TestForm, metadata: { name: 'Form', type: 'basic' } },
    Label: { component: TestLabel, metadata: { name: 'Label', type: 'basic' } },
    Input: { component: TestInput, metadata: { name: 'Input', type: 'basic' } },
    Textarea: { component: TestTextarea, metadata: { name: 'Textarea', type: 'basic' } },
    Button: { component: TestButton, metadata: { name: 'Button', type: 'basic' } },
    Img: { component: TestImg, metadata: { name: 'Img', type: 'basic' } },
    Fragment: { component: TestFragment, metadata: { name: 'Fragment', type: 'layout' } },
  };

  return registry;
}

function readJson(filePath: string): JsonValue {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadTranslations(locale: 'ko' | 'en'): JsonValue {
  function resolveFile(filePath: string): JsonValue {
    const json = readJson(filePath);
    const resolved: JsonValue = {};

    for (const [key, value] of Object.entries(json)) {
      if (value && typeof value === 'object' && '$partial' in value) {
        resolved[key] = resolveFile(path.join(langRoot, String(value.$partial)));
        continue;
      }
      resolved[key] = value;
    }

    return resolved;
  }

  return resolveFile(path.join(langRoot, `${locale}.json`));
}

function resolveComponentList(components: JsonValue[], currentDir: string): JsonValue[] {
  const resolved: JsonValue[] = [];

  for (const component of components) {
    if (component.partial) {
      const partialPath = path.resolve(currentDir, component.partial);
      const partialJson = readJson(partialPath);
      resolved.push(...resolveComponentList([partialJson], path.dirname(partialPath)));
      continue;
    }

    const cloned = JSON.parse(JSON.stringify(component));
    if (Array.isArray(cloned.children)) {
      cloned.children = resolveComponentList(cloned.children, currentDir);
    }
    resolved.push(cloned);
  }

  return resolved;
}

function injectSlotContent(components: JsonValue[], slots: Record<string, JsonValue[]>): JsonValue[] {
  const resolved: JsonValue[] = [];

  for (const component of components) {
    if (component.type === 'slot' && component.name && slots[component.name]) {
      resolved.push(...slots[component.name]);
      continue;
    }

    const cloned = JSON.parse(JSON.stringify(component));
    if (Array.isArray(cloned.children)) {
      cloned.children = injectSlotContent(cloned.children, slots);
    }
    resolved.push(cloned);
  }

  return resolved;
}

function loadLayout(layoutName: string): TestLayout {
  const filePath = path.join(layoutsRoot, `${layoutName}.json`);
  const layoutJson = readJson(filePath);
  const currentDir = path.dirname(filePath);
  const slots = Object.fromEntries(
    Object.entries(layoutJson.slots || {}).map(([slotName, components]) => [
      slotName,
      resolveComponentList((components as JsonValue[]) || [], currentDir),
    ])
  );
  const ownComponents = resolveComponentList(layoutJson.components || [], currentDir);

  if (layoutJson.extends) {
    const baseLayout = loadLayout(layoutJson.extends);
    const mergedComponents = injectSlotContent(baseLayout.components || [], slots);

    return {
      layout_name: layoutJson.layout_name,
      version: layoutJson.version,
      meta: { ...(baseLayout.meta || {}), ...(layoutJson.meta || {}) },
      data_sources: [...(baseLayout.data_sources || []), ...(layoutJson.data_sources || [])],
      components: ownComponents.length > 0 ? [...mergedComponents, ...ownComponents] : mergedComponents,
    };
  }

  return {
    layout_name: layoutJson.layout_name,
    version: layoutJson.version,
    meta: layoutJson.meta,
    data_sources: layoutJson.data_sources || [],
    components: ownComponents.length > 0 ? ownComponents : slots.content || [],
  };
}

function buildInitialData(layout: TestLayout): Record<string, any> {
  const initialData: Record<string, any> = {};

  for (const dataSource of layout.data_sources || []) {
    initialData[dataSource.id] = dataSource.fallback ?? null;
  }

  return initialData;
}

describe('glitter-gallery 레이아웃 렌더링 회귀 테스트', () => {
  let registry: ComponentRegistry;
  const translations = loadTranslations('ko');
  const activeTests: Array<ReturnType<typeof createLayoutTest>> = [];

  beforeEach(() => {
    registry = setupRegistry();
  });

  afterEach(() => {
    while (activeTests.length > 0) {
      activeTests.pop()?.cleanup();
    }
  });

  async function renderLayout(layoutName: string) {
    const layout = loadLayout(layoutName);
    const testUtils = createLayoutTest(layout as any, {
      componentRegistry: registry,
      templateId: 'glitter-gallery',
      locale: 'ko',
      translations,
      initialData: buildInitialData(layout),
    });

    activeTests.push(testUtils);
    await testUtils.render();
    testUtils.assertNoValidationErrors();

    return { layout, testUtils };
  }

  it('home 레이아웃이 주요 fallback 섹션을 렌더링한다', async () => {
    await renderLayout('home');

    await waitFor(() => {
      expect(screen.getAllByText('Glitter Gallery').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('빛의 수집가들').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2026.04.18 - 2026.07.21').length).toBeGreaterThan(0);
    expect(screen.getByText('공간의 결을 함께 만드는 작가들')).not.toBeNull();
    expect(screen.getByText('운영 공지와 프로그램 소식')).not.toBeNull();
    expect(screen.getByText(/홈 첫 화면을 대표 전시 중심으로 구성했습니다./)).not.toBeNull();
    expect(screen.getByText('작품 카드 그리드')).not.toBeNull();
    expect(document.querySelectorAll('.gallery-card-grid').length).toBeGreaterThanOrEqual(3);
  });

  it('exhibitions 레이아웃이 전시 카드 영역을 렌더링한다', async () => {
    await renderLayout('exhibitions');

    await waitFor(() => {
      expect(screen.getAllByText('전시').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('현재, 예정, 아카이브 전시를 한 흐름으로 살펴볼 수 있는 전시 목록입니다. 기간과 상태, 공간 정보를 함께 제시해 관람 동선을 빠르게 파악할 수 있도록 구성합니다.')).not.toBeNull();
    expect(screen.getByText('기간과 상태를 함께 읽는 카드 목록')).not.toBeNull();
    expect(screen.getByText('빛의 수집가들')).not.toBeNull();
    expect(screen.getByText('현재 진행 중')).not.toBeNull();
    expect(screen.getByText('관람 전 확인 사항')).not.toBeNull();
    expect(screen.getByText('전시를 골랐다면, 이제 방문안내와 문의 경로를 확인해 주세요')).not.toBeNull();
    expect(document.querySelector('.gallery-listing-grid')).not.toBeNull();
    expect(document.querySelectorAll('.gallery-card').length).toBeGreaterThanOrEqual(4);
  });

  it('artists 레이아웃이 작가 목록을 렌더링한다', async () => {
    await renderLayout('artists');

    await waitFor(() => {
      expect(screen.getAllByText('작가').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('공간의 분위기와 전시의 밀도를 함께 만들어 가는 작가들을 소개합니다. 짧은 소개와 작업 키워드, 관찰 포인트를 카드 단위로 정리했습니다.')).not.toBeNull();
    expect(screen.getByText('프로필 중심의 정제된 카드 레이아웃')).not.toBeNull();
    expect(screen.getByText('전시 페이지에서 만난 작품 흐름을 작가 단위로 다시 읽을 수 있도록, 참여 작가와 주요 관심 주제, 대표 작업 성격을 함께 배치했습니다.')).not.toBeNull();
    expect(screen.getByText('김서윤')).not.toBeNull();
    expect(screen.getByText('Curatorial Note')).not.toBeNull();
    expect(screen.getByText('작가를 살펴봤다면, 전시와 소장품 페이지로 흐름을 이어가 보세요')).not.toBeNull();
    expect(document.querySelector('.gallery-listing-grid')).not.toBeNull();
    expect(document.querySelectorAll('.gallery-card').length).toBeGreaterThanOrEqual(4);
  });

  it('collection 레이아웃이 소장품 목록을 렌더링한다', async () => {
    await renderLayout('collection');

    await waitFor(() => {
      expect(screen.getAllByText('소장품').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('소장품과 대표 작품을 이미지 중심 카드로 정리한 목록입니다. 작품명과 작가, 연도, 매체를 절제된 밀도로 배치해 첫 인상과 기본 정보를 함께 읽을 수 있도록 구성했습니다.')).not.toBeNull();
    expect(screen.getByText('이미지 비중이 높은 소장품 카드 아카이브')).not.toBeNull();
    expect(screen.getByText('작가 페이지에서 확인한 작업 세계를 실제 작품 단위로 이어 읽을 수 있도록, 주요 소장품과 연결 전시, 아카이브 문맥을 같은 흐름 안에 배치했습니다.')).not.toBeNull();
    expect(screen.getByText('정지된 파도')).not.toBeNull();
    expect(screen.getByText('작품 읽기와 전시 맥락을 함께 남기는 아카이브 관점')).not.toBeNull();
    expect(screen.getByText('작품을 살펴봤다면, 이제 작가와 전시 흐름으로 시선을 넓혀 보세요')).not.toBeNull();
    expect(document.querySelector('.gallery-listing-grid')).not.toBeNull();
    expect(document.querySelectorAll('.gallery-card').length).toBeGreaterThanOrEqual(5);
  });

  it('visit 레이아웃이 방문 안내 정보를 렌더링한다', async () => {
    await renderLayout('visit');

    await waitFor(() => {
      expect(screen.getAllByText('방문안내').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('운영 시간, 위치, 입장 안내를 한 페이지에서 확인할 수 있도록 정리한 방문 안내입니다. 처음 방문하는 관람객도 지금 방문 가능한지와 어디로 가야 하는지를 빠르게 파악할 수 있도록 구성했습니다.')).not.toBeNull();
    expect(screen.getByText('방문 전 가장 먼저 확인해야 할 운영 정보')).not.toBeNull();
    expect(screen.getByText('운영 시간과 휴관')).not.toBeNull();
    expect(screen.getByText('방문 전에 알아두면 좋은 안내')).not.toBeNull();
    expect(screen.getByText('단체 관람')).not.toBeNull();
    expect(screen.getByText('오시는 길과 문의 경로')).not.toBeNull();
    expect(screen.getByText('방문 계획을 세웠다면, 전시와 소식을 함께 확인해 주세요')).not.toBeNull();
    expect(document.querySelectorAll('.gallery-info-card').length).toBeGreaterThanOrEqual(7);
  });

  it('news 레이아웃이 공지형 랜딩 구조를 렌더링한다', async () => {
    await renderLayout('news');

    await waitFor(() => {
      expect(screen.getAllByText('소식').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('운영 공지, 전시 일정 변경, 프로그램 안내, 휴관 소식을 한 페이지에서 확인할 수 있도록 구성한 공지형 랜딩입니다. 홈에서 먼저 본 운영 공지와 프로그램 소식을 날짜와 분류 기준으로 다시 읽기 쉽게 정리했습니다.')).not.toBeNull();
    expect(screen.getByText('최신 공지와 소식을 날짜순으로 확인')).not.toBeNull();
    expect(screen.getByText('오프닝 리셉션 안내')).not.toBeNull();
    expect(screen.getByText('주말 도슨트 프로그램 신청 오픈')).not.toBeNull();
    expect(screen.getByText('방문 전에 먼저 확인이 필요한 운영 안내')).not.toBeNull();
    expect(screen.getByText('프로그램 신청과 정원 안내')).not.toBeNull();
    expect(screen.getByText('소식을 확인했다면 다음 정보로 이어가세요')).not.toBeNull();
    expect(screen.getAllByText('방문 안내 보기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('문의하기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('전시 보기').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.gallery-listing-grid .gallery-card').length).toBeGreaterThanOrEqual(5);
    expect(document.querySelectorAll('.gallery-info-card').length).toBeGreaterThanOrEqual(3);
  });

  it('press 레이아웃이 보도자료 랜딩 구조를 렌더링한다', async () => {
    await renderLayout('press');

    await waitFor(() => {
      expect(screen.getAllByText('보도자료').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('기관 소개, 전시 관련 보도자료, 언론용 기본 안내를 한 페이지에서 확인할 수 있도록 정리한 공식 자료 랜딩입니다. 보도 대응에 필요한 핵심 문구와 자료 요청 흐름을 과장 없이 정돈해 신뢰감 있게 읽히도록 구성했습니다.')).not.toBeNull();
    expect(screen.getByText('보도자료와 언론 안내를 날짜순으로 정리')).not.toBeNull();
    expect(screen.getByText('Glitter Gallery 시즌 전시 개막 보도자료')).not.toBeNull();
    expect(screen.getByText('기관 소개와 공간 성격 요약 안내')).not.toBeNull();
    expect(screen.getByText('언론 및 협업 문의 전에 확인할 안내')).not.toBeNull();
    expect(screen.getByText('촬영 및 취재 문의')).not.toBeNull();
    expect(screen.getByText('자료를 확인했다면 다음 경로로 이어가세요')).not.toBeNull();
    expect(screen.getAllByText('문의하기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('전시 보기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('소식 보기').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.gallery-listing-grid .gallery-card').length).toBeGreaterThanOrEqual(5);
    expect(document.querySelectorAll('.gallery-info-card').length).toBeGreaterThanOrEqual(3);
  });

  it('links 레이아웃이 외부 참조 허브 구조를 렌더링한다', async () => {
    await renderLayout('links');

    await waitFor(() => {
      expect(screen.getAllByText('외부 링크').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('예약, 소셜 채널, 보도자료 참조, 외부 아카이브, 파트너 연결처럼 외부 이동이 필요한 지점을 한 페이지에서 정리한 참조 허브입니다. news, press, contact 에서 분기되는 외부 연결 성격의 경로를 목적별로 다시 묶었습니다.')).not.toBeNull();
    expect(screen.getByText('목적별 외부 연결 경로를 한곳에 정리')).not.toBeNull();
    expect(screen.getByText('방문 및 예약')).not.toBeNull();
    expect(screen.getByText('소셜 채널')).not.toBeNull();
    expect(screen.getByText('보도 및 자료 참조')).not.toBeNull();
    expect(screen.getByText('파트너 및 프로젝트')).not.toBeNull();
    expect(screen.getByText('방문 예약 링크 예시')).not.toBeNull();
    expect(screen.getByText('보도자료 참조 링크 예시')).not.toBeNull();
    expect(screen.getByText('외부 링크 이용 전에 확인할 안내')).not.toBeNull();
    expect(screen.getByText('공식 확인은 contact 경로 우선')).not.toBeNull();
    expect(screen.getByText('링크를 확인했다면 다음 경로로 이어가세요')).not.toBeNull();
    expect(screen.getAllByText('문의하기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('방문 안내 보기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('소식 보기').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.gallery-link-item').length).toBeGreaterThanOrEqual(8);
    expect(document.querySelectorAll('.gallery-info-card').length).toBeGreaterThanOrEqual(7);
  });

  it('about 레이아웃이 기관 소개 랜딩 구조를 렌더링한다', async () => {
    await renderLayout('about');

    await waitFor(() => {
      expect(screen.getAllByText('소개').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('Glitter Gallery는 전시, 작가, 프로그램, 아카이브를 하나의 흐름으로 연결해 동시대 감각을 읽는 미술관형 공간을 지향합니다. 첫 방문자에게는 공간의 인상을, 반복 방문자에게는 축적되는 문맥을 전달하는 소개 랜딩으로 구성했습니다.')).not.toBeNull();
    expect(screen.getByText('작품과 장면, 대화가 함께 남는 기관 소개')).not.toBeNull();
    expect(screen.getByText('운영 철학')).not.toBeNull();
    expect(screen.getByText('다루는 전시와 작가')).not.toBeNull();
    expect(screen.getByText('공간과 프로그램이 함께 작동하는 방식')).not.toBeNull();
    expect(screen.getByText('전시 프로그램')).not.toBeNull();
    expect(screen.getByText('왜 이런 전시와 작가를 소개하는가')).not.toBeNull();
    expect(screen.getByText('동시대성')).not.toBeNull();
    expect(screen.getByText('기관 소개를 읽었다면 다음 흐름으로 이어가세요')).not.toBeNull();
    expect(screen.getAllByText('전시 보기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('방문 안내 보기').length).toBeGreaterThan(0);
    expect(screen.getAllByText('문의하기').length).toBeGreaterThan(0);
    expect(document.querySelectorAll('.gallery-info-card').length).toBeGreaterThanOrEqual(10);
    expect(document.querySelector('.gallery-quote-card')).not.toBeNull();
  });

  it('contact 레이아웃이 문의 허브 정보를 렌더링한다', async () => {
    await renderLayout('contact');

    await waitFor(() => {
      expect(screen.getAllByText('문의').length).toBeGreaterThan(0);
    });
    expect(screen.getByText('일반 문의부터 전시 협업, 단체 관람, 프로그램 및 아카이브 관련 연락까지 한 페이지에서 안내하는 문의 허브입니다. 실제 폼 연결 전에도 어떤 경로로 무엇을 문의해야 하는지 명확하게 파악할 수 있도록 구성했습니다.')).not.toBeNull();
    expect(screen.getByText('문의 목적에 따라 먼저 확인할 안내')).not.toBeNull();
    expect(screen.getByText('전시 및 협업 문의')).not.toBeNull();
    expect(screen.getByText('대표 연락처와 응답 기준')).not.toBeNull();
    expect(screen.getByText('대표 이메일')).not.toBeNull();
    expect(screen.getByText('문의 전에 함께 남기면 좋은 정보')).not.toBeNull();
    expect(screen.getByText('문의 전에는 방문 안내와 현재 전시 정보를 함께 확인해 주세요')).not.toBeNull();
    expect(document.querySelectorAll('.gallery-info-card').length).toBeGreaterThanOrEqual(7);
  });
});
