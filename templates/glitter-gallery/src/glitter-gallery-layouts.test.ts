// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  document.documentElement.className = "";
  document.body.innerHTML = "";
  localStorage.clear();
  delete (window as any).GlitterGallery;
  delete (window as any).G7TemplateHandlers;
  (window as any).G7Core = {
    createLogger: () => ({
      log: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }),
  };
});

describe("glitter-gallery template bundle", () => {
  it("registers its component bundle on window.GlitterGallery", async () => {
    const mod = await import("./index");

    expect((window as any).GlitterGallery).toBeDefined();
    expect((window as any).GlitterGallery.Div).toBe(mod.Div);
    expect((window as any).GlitterGallery.Button).toBe(mod.Button);
    expect((window as any).GlitterGallery.templateMetadata).toEqual(mod.templateMetadata);
    expect(typeof (window as any).GlitterGallery.initTemplate).toBe("function");
  });

  it("exposes template handlers for TemplateApp reinitialization", async () => {
    const mod = await import("./index");

    expect((window as any).G7TemplateHandlers).toEqual(mod.handlerMap);
  });

  it("applies persisted font and theme classes during initialization", async () => {
    localStorage.setItem("gallery-font-mode", "gothic");
    localStorage.setItem("gallery-theme-mode", "dark");

    await import("./index");

    expect(document.documentElement.classList.contains("font-gothic")).toBe(true);
    expect(document.documentElement.classList.contains("theme-dark")).toBe(true);
  });
});
