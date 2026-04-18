import React, {
  createElement,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type FormHTMLAttributes,
  type ImgHTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type OptionHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import templateMetadata from "../template.json";
import "./styles.css";

type BaseProps<T> = T & {
  children?: React.ReactNode;
};

type FontMode = "default" | "gothic" | "rounded";
type ThemeMode = "light" | "dim" | "dark";

type FontSelectElement = HTMLSelectElement & {
  dataset: DOMStringMap & {
    galleryFontBound?: string;
  };
};

type ThemeSelectElement = HTMLSelectElement & {
  dataset: DOMStringMap & {
    galleryThemeBound?: string;
  };
};

type TemplateBundle = {
  Div: typeof Div;
  Article: typeof Article;
  Section: typeof Section;
  Nav: typeof Nav;
  A: typeof A;
  Span: typeof Span;
  P: typeof P;
  H1: typeof H1;
  H2: typeof H2;
  H3: typeof H3;
  Ul: typeof Ul;
  Li: typeof Li;
  Img: typeof Img;
  Form: typeof Form;
  Label: typeof Label;
  Input: typeof Input;
  Select: typeof Select;
  Option: typeof Option;
  Textarea: typeof Textarea;
  Button: typeof Button;
  templateMetadata: typeof templateMetadata;
  initTemplate: typeof initTemplate;
};

const FONT_MODE_STORAGE_KEY = "gallery-font-mode";
const THEME_MODE_STORAGE_KEY = "gallery-theme-mode";
const FONT_MODE_CLASSES = ["font-default", "font-gothic", "font-rounded"] as const;
const THEME_MODE_CLASSES = ["theme-light", "theme-dim", "theme-dark"] as const;

let selectObserver: MutationObserver | null = null;

function createBasicComponent<T>(tag: keyof React.JSX.IntrinsicElements) {
  return function BasicComponent(props: BaseProps<T>) {
    return createElement(tag, props);
  };
}

function isFontMode(value: unknown): value is FontMode {
  return value === "default" || value === "gothic" || value === "rounded";
}

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "light" || value === "dim" || value === "dark";
}

function getStoredFontMode(): FontMode {
  if (typeof window === "undefined") {
    return "default";
  }

  try {
    const storedValue = window.localStorage.getItem(FONT_MODE_STORAGE_KEY);
    return isFontMode(storedValue) ? storedValue : "default";
  } catch {
    return "default";
  }
}

function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedValue = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
    return isThemeMode(storedValue) ? storedValue : "light";
  } catch {
    return "light";
  }
}

function syncFontSelects(mode: FontMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.querySelectorAll<FontSelectElement>("[data-gallery-font-select]").forEach((element) => {
    if (element.value !== mode) {
      element.value = mode;
    }
  });
}

function syncThemeSelects(mode: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.querySelectorAll<ThemeSelectElement>("[data-gallery-theme-select]").forEach((element) => {
    if (element.value !== mode) {
      element.value = mode;
    }
  });
}

function applyFontMode(mode: FontMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.remove(...FONT_MODE_CLASSES);
  document.documentElement.classList.add(`font-${mode}`);
  syncFontSelects(mode);

  try {
    window.localStorage.setItem(FONT_MODE_STORAGE_KEY, mode);
  } catch {
    // 저장소 접근이 막힌 환경에서는 현재 세션에만 적용한다.
  }
}

function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.remove(...THEME_MODE_CLASSES);
  document.documentElement.classList.add(`theme-${mode}`);
  syncThemeSelects(mode);

  try {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode);
  } catch {
    // 저장소 접근이 막힌 환경에서는 현재 세션에만 적용한다.
  }
}

function bindFontSelects(): void {
  if (typeof document === "undefined") {
    return;
  }

  const currentMode = getStoredFontMode();
  syncFontSelects(currentMode);

  document.querySelectorAll<FontSelectElement>("[data-gallery-font-select]").forEach((element) => {
    if (element.dataset.galleryFontBound === "true") {
      return;
    }

    element.dataset.galleryFontBound = "true";
    element.addEventListener("change", (event) => {
      const nextValue = (event.target as HTMLSelectElement).value;

      if (isFontMode(nextValue)) {
        applyFontMode(nextValue);
      }
    });
  });
}

function bindThemeSelects(): void {
  if (typeof document === "undefined") {
    return;
  }

  const currentMode = getStoredThemeMode();
  syncThemeSelects(currentMode);

  document.querySelectorAll<ThemeSelectElement>("[data-gallery-theme-select]").forEach((element) => {
    if (element.dataset.galleryThemeBound === "true") {
      return;
    }

    element.dataset.galleryThemeBound = "true";
    element.addEventListener("change", (event) => {
      const nextValue = (event.target as HTMLSelectElement).value;

      if (isThemeMode(nextValue)) {
        applyThemeMode(nextValue);
      }
    });
  });
}

function setupSelectBindings(): void {
  bindFontSelects();
  bindThemeSelects();

  if (!selectObserver && typeof MutationObserver !== "undefined" && document.body) {
    selectObserver = new MutationObserver(() => {
      bindFontSelects();
      bindThemeSelects();
    });

    selectObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

function initTemplateModes(): void {
  if (typeof document === "undefined") {
    return;
  }

  applyFontMode(getStoredFontMode());
  applyThemeMode(getStoredThemeMode());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSelectBindings, { once: true });
    return;
  }

  setupSelectBindings();
}

export const Div = createBasicComponent<HTMLAttributes<HTMLDivElement>>("div");
export const Article = createBasicComponent<HTMLAttributes<HTMLElement>>("article");
export const Section = createBasicComponent<HTMLAttributes<HTMLElement>>("section");
export const Nav = createBasicComponent<HTMLAttributes<HTMLElement>>("nav");
export const A = createBasicComponent<AnchorHTMLAttributes<HTMLAnchorElement>>("a");
export const Span = createBasicComponent<HTMLAttributes<HTMLSpanElement>>("span");
export const P = createBasicComponent<HTMLAttributes<HTMLParagraphElement>>("p");
export const H1 = createBasicComponent<HTMLAttributes<HTMLHeadingElement>>("h1");
export const H2 = createBasicComponent<HTMLAttributes<HTMLHeadingElement>>("h2");
export const H3 = createBasicComponent<HTMLAttributes<HTMLHeadingElement>>("h3");
export const Ul = createBasicComponent<HTMLAttributes<HTMLUListElement>>("ul");
export const Li = createBasicComponent<HTMLAttributes<HTMLLIElement>>("li");
export const Img = createBasicComponent<ImgHTMLAttributes<HTMLImageElement>>("img");
export const Form = createBasicComponent<FormHTMLAttributes<HTMLFormElement>>("form");
export const Label = createBasicComponent<LabelHTMLAttributes<HTMLLabelElement>>("label");
export const Input = createBasicComponent<InputHTMLAttributes<HTMLInputElement>>("input");
export const Select = createBasicComponent<SelectHTMLAttributes<HTMLSelectElement>>("select");
export const Option = createBasicComponent<OptionHTMLAttributes<HTMLOptionElement>>("option");
export const Textarea = createBasicComponent<TextareaHTMLAttributes<HTMLTextAreaElement>>("textarea");
export const Button = createBasicComponent<ButtonHTMLAttributes<HTMLButtonElement>>("button");

const logger = ((window as any).G7Core?.createLogger?.("Template:glitter-gallery")) ?? {
  log: (...args: unknown[]) => console.log("[Template:glitter-gallery]", ...args),
  warn: (...args: unknown[]) => console.warn("[Template:glitter-gallery]", ...args),
  error: (...args: unknown[]) => console.error("[Template:glitter-gallery]", ...args),
};

export const handlerMap: Record<string, never> = {};

export { templateMetadata };

export function initTemplate(): void {
  initTemplateModes();
  logger.log("glitter-gallery template initialized");
}

const templateBundle: TemplateBundle = {
  Div,
  Article,
  Section,
  Nav,
  A,
  Span,
  P,
  H1,
  H2,
  H3,
  Ul,
  Li,
  Img,
  Form,
  Label,
  Input,
  Select,
  Option,
  Textarea,
  Button,
  templateMetadata,
  initTemplate,
};

if (typeof window !== "undefined") {
  (window as any).G7TemplateHandlers = handlerMap;
  (window as any).GlitterGallery = {
    ...((window as any).GlitterGallery ?? {}),
    ...templateBundle,
  };
}

initTemplate();

export default templateBundle;
