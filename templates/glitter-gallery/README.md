# Glitter Gallery

Glitter Gallery는 그누보드7용 사용자 템플릿으로, 일반 갤러리, 미술관, 전시 플랫폼, 아트 스페이스 성격의 공개 사이트를 위한 미니멀 에디토리얼 톤에 맞춰 설계되었습니다.

- 템플릿명: `Glitter Gallery`
- 식별자: `glitter-gallery`
- 버전: `0.1.0-beta.2`
- 상태: `beta`
- 라이선스: `MIT`
- 유형: 사용자 템플릿 (`type: user`)

## 템플릿 개요

이 템플릿은 전시, 작가, 소장품, 방문 안내, 연락처 같은 공개 페이지를 중심으로 구성된 사용자 템플릿입니다. 운영자나 개발자가 비교적 적은 설정으로도 갤러리형 사이트를 빠르게 반영할 수 있도록, 동적 의존보다 정적 구조와 fallback 콘텐츠 정합성을 우선해 구성했습니다.

현재 구현은 1차 공개 가능한 베타 설계안 수준이며, 공개 페이지의 시각 완성도와 토큰 기반 스타일 시스템, 정적 빌드 안정성에 초점을 두고 있습니다.

## 특징 요약

- 미니멀한 갤러리/미술관 톤의 공개 페이지 중심 사용자 템플릿
- fallback-only 중심으로 정리된 안정적 구조
- `gallery-*` 클래스 패밀리 기반의 스타일 시스템
- 카드, 서피스, 링크 리스트, 버튼, 정보 카드 계열 컴포넌트가 일관된 톤으로 정리됨
- hover / focus-visible 상태가 전체 템플릿 기준으로 정리되어 있음
- 헤더 우측에 글꼴 선택 드롭다운 제공
  - `기본`, `고딕`, `둥근`
- 헤더 우측에 템플릿 모드 선택 드롭다운 제공
  - `밝음 (light)`, `미명 (dim)`, `어둠 (dark)`
- 폰트 모드와 테마 모드는 모두 localStorage 기반으로 유지됨
- 정적 빌드 결과물(`dist/`) 기준으로 반영 및 검증 가능

## 제공 페이지 목록

현재 `routes.json`에 연결된 공개 페이지는 아래와 같습니다.

| 경로 | 레이아웃 | 설명 |
| --- | --- | --- |
| `/` | `home` | 대표 전시, 주요 소개, 다음 탐색 동선을 배치한 홈 화면 |
| `/about` | `about` | 기관 성격과 운영 철학, 큐레토리얼 관점을 소개하는 페이지 |
| `/exhibitions` | `exhibitions` | 현재/예정/아카이브 전시를 정리한 전시 목록 페이지 |
| `/artists` | `artists` | 참여 작가와 작업 키워드를 소개하는 작가 목록 페이지 |
| `/collection` | `collection` | 소장품 또는 주요 작품군을 정리해 보여주는 페이지 |
| `/visit` | `visit` | 운영 시간, 위치, 관람 흐름 등 방문 정보를 제공하는 페이지 |
| `/contact` | `contact` | 문의 수단과 기본 연락 정보를 제공하는 페이지 |
| `/news` | `news` | 공지, 소식, 업데이트 성격의 콘텐츠를 배치한 페이지 |

현재 템플릿 디렉토리에는 아래 레이아웃 파일도 존재하지만, `routes.json`에는 아직 연결되지 않았습니다.

| 경로 | 현재 상태 | 설명 |
| --- | --- | --- |
| `/press` | 레이아웃 파일 존재, 라우트 미연결 | 보도자료/언론용 페이지 확장 후보 |
| `/links` | 레이아웃 파일 존재, 라우트 미연결 | 외부 링크/참고 링크 모음 페이지 확장 후보 |

즉, 현재 배포 상태에서 기본 공개 라우트는 8개이며, `press`와 `links`는 향후 공개 경로로 연결 가능한 준비 상태로 보는 것이 맞습니다.

## 디자인 / 스타일 시스템 요약

이 템플릿은 `gallery-*` 클래스 패밀리를 중심으로 구성됩니다.

주요 계열은 다음과 같습니다.

- `gallery-surface`: 유리감 있는 상위 표면 카드/섹션
- `gallery-card`: 기본 카드 레이아웃
- `gallery-info-card`: 정보형 카드
- `gallery-link-item`: 링크 목록 카드
- `gallery-button`, `gallery-button-ghost`: 주요 액션 버튼
- `gallery-nav-link`: 공개 페이지 네비게이션 링크
- `gallery-font-select`, `gallery-mode-select`: 헤더 우측 compact select 컨트롤

테마 모드는 `html` 클래스 기준으로 토큰이 전환됩니다.

- `theme-light`: 현재 기본 밝은 톤
- `theme-dim`: 완전 다크가 아닌 중간 저조도 톤
- `theme-dark`: 어두운 배경과 높은 대비를 갖는 다크 톤

글꼴 선택은 아래 클래스 조합으로 동작합니다.

- `font-default`
- `font-gothic`
- `font-rounded`

두 모드는 서로 독립적으로 동작하므로, 예를 들어 `font-rounded + theme-dim` 조합처럼 함께 사용할 수 있습니다.

## 구현 원칙

이 템플릿은 아래 원칙에 맞춰 구현되었습니다.

- 가능한 범위에서 fallback-only 중심으로 구성
- 불확실한 API endpoint를 임의로 가정하지 않음
- 공개 페이지에서 인증이 필요한 data source 사용을 지양
- 구조 확대보다 정합성과 안정성을 우선
- 개별 컴포넌트마다 직접 색을 퍼뜨리기보다 토큰 중심으로 관리
- 레이아웃 구조보다 템플릿 반영 안정성과 정적 완성도를 우선

## 설치 및 반영 방법

### 위치

템플릿 소스 위치:

```text
/volume1/glitterbz/GalleryBz/templates/glitter-gallery
```

### 빌드

템플릿 정적 자산 빌드:

```bash
cd /volume1/glitterbz/GalleryBz/templates/glitter-gallery
npm run build
```

지속 감시 빌드가 필요할 때:

```bash
cd /volume1/glitterbz/GalleryBz/templates/glitter-gallery
npm run build:watch
```

### 활성 반영

빌드 후 활성 디렉토리에 반영:

```bash
cd /volume1/glitterbz/GalleryBz
/usr/local/bin/php83 artisan template:update glitter-gallery --force
```

확장 오토로드 갱신이 필요한 경우:

```bash
cd /volume1/glitterbz/GalleryBz
/usr/local/bin/php83 artisan extension:update-autoload
```

캐시 정리가 필요한 경우 예시:

```bash
cd /volume1/glitterbz/GalleryBz
/usr/local/bin/php83 artisan optimize:clear
```

### 기본 검증 명령 예시

```bash
cd /volume1/glitterbz/GalleryBz/templates/glitter-gallery
npm run build
```

```bash
cd /volume1/glitterbz/GalleryBz/templates/glitter-gallery
npm run test:run
```

```bash
cd /volume1/glitterbz/GalleryBz
/usr/local/bin/php83 artisan template:update glitter-gallery --force
```

## 개발 및 검증

현재 템플릿에는 레이아웃 회귀 성격의 테스트가 포함되어 있습니다.

- `__tests__/layouts/glitter-gallery-layouts.test.tsx`
  - 주요 공개 레이아웃이 렌더링 가능한지 확인하는 테스트
- `__tests__/layouts/endpoint-validation.test.ts`
  - 레이아웃/엔드포인트 참조가 무리 없이 유지되는지 점검하는 테스트

검증 기준은 dev server가 아니라 정적 빌드 결과물(`dist/css/components.css`, `dist/js/components.iife.js`)입니다. 실제 반영 전에는 `npm run build` 기준으로 결과를 확인하는 것을 전제로 합니다.

## 현재 상태 / 알려진 범위

현재 상태는 다음처럼 이해하는 것이 가장 정확합니다.

- 1차 공개 가능한 베타 템플릿 설계안 수준
- 공개 페이지 구조와 스타일 시스템, 정적 완성도에 집중한 상태
- fallback 콘텐츠 중심으로 페이지 구조가 안정화되어 있음
- 동적 데이터 연동은 향후 확장 가능하지만, 현재는 무리하게 연결하지 않음
- `press`, `links`는 레이아웃 파일은 준비되어 있으나 공개 라우트에는 아직 연결되지 않음
- 템플릿 모드 전환(light / dim / dark)과 글꼴 전환은 구현되어 있으나, `template.json`의 `features.dark_mode` 값은 아직 `false`로 남아 있음
  - 즉, 실제 스타일 동작은 존재하지만 메타데이터 표시는 아직 후속 정리가 필요할 수 있음

향후 동적 연동이 확장되기 쉬운 영역은 아래와 같습니다.

- 전시 목록 및 상세 연결
- 작가 데이터 연동
- 뉴스/공지 데이터 연동
- 방문 정보의 운영 데이터 연동
- press / links 공개 라우트 연결

## 파일 구조 요약

- `layouts/`
  - 공개 페이지 레이아웃과 공통 partial, 에러 레이아웃을 포함합니다.
- `lang/`
  - `ko`, `en` 언어 리소스와 partial용 언어 파일을 포함합니다.
- `src/`
  - 템플릿 스크립트와 스타일 소스가 위치합니다.
- `dist/`
  - 빌드된 CSS/JS 결과물이 생성되는 디렉토리입니다.
- `template.json`
  - 템플릿 메타데이터, 버전, 자산, 기능 정보를 정의합니다.
- `routes.json`
  - 공개 페이지 라우트와 레이아웃 매핑을 정의합니다.
- `seo-config.json`
  - SEO 렌더링과 기본 메타데이터 규칙을 정의합니다.
- `__tests__/`
  - 레이아웃 회귀 테스트와 검증 테스트를 포함합니다.
- `components.json`
  - 템플릿에서 사용하는 기본 컴포넌트 메타를 포함합니다.
- `preview/`
  - 썸네일 및 대표 스크린샷 자산을 포함합니다.

## 라이선스 / 참고

이 템플릿은 `LICENSE` 파일 기준으로 MIT 라이선스를 따릅니다.

- 라이선스: `MIT`
- 저작권 표기: `Copyright (c) 2026 Glitter`

구조적으로는 그누보드7 템플릿 체계와 기존 템플릿 관례를 따르지만, 문서와 구현 관점에서는 독립적인 갤러리/미술관 사용자 템플릿으로 정리되어 있습니다.
