import { useEffect, useMemo, useState } from "react";

import { extractPayload, type ToolPayload } from "./data";

export type HostSnapshot = {
  payload?: ToolPayload;
  theme: "light" | "dark";
  displayMode: OpenAiDisplayMode;
  maxHeight?: number;
  safeArea?: OpenAiSafeArea;
  locale: string;
  widgetState: Record<string, unknown>;
};

function readHostSnapshot(override?: Partial<OpenAiHost>): HostSnapshot {
  const host = { ...(window.openai ?? {}), ...(override ?? {}) };
  return {
    payload: extractPayload(host.toolOutput ?? host.toolResponseMetadata),
    theme: host.theme === "dark" ? "dark" : "light",
    displayMode: host.displayMode ?? "inline",
    maxHeight: typeof host.maxHeight === "number" ? host.maxHeight : undefined,
    safeArea: host.safeArea,
    locale: host.locale ?? navigator.language ?? "en",
    widgetState: host.widgetState ?? {},
  };
}

export function useOpenAiHost() {
  const [snapshot, setSnapshot] = useState<HostSnapshot>(() => readHostSnapshot());

  useEffect(() => {
    const onGlobals = (event: Event) => {
      const globals = (event as OpenAiSetGlobalsEvent).detail?.globals;
      setSnapshot(readHostSnapshot(globals));
    };
    const onMessage = (event: MessageEvent) => {
      if (event.source && event.source !== window.parent) return;
      const message = event.data as Record<string, unknown> | undefined;
      if (!message || typeof message !== "object") return;
      if (message.jsonrpc && message.jsonrpc !== "2.0") return;
      if (message.method === "ui/notifications/tool-result") {
        const payload = extractPayload(message.params);
        if (payload) setSnapshot((current) => ({ ...current, payload }));
      } else if (message.result !== undefined) {
        const payload = extractPayload(message.result);
        if (payload) setSnapshot((current) => ({ ...current, payload }));
      }
    };

    window.addEventListener("openai:set_globals", onGlobals, { passive: true });
    window.addEventListener("message", onMessage, { passive: true });
    const retry = window.setTimeout(() => setSnapshot(readHostSnapshot()), 120);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("openai:set_globals", onGlobals);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  useEffect(() => {
    const notify = window.openai?.notifyIntrinsicHeight;
    if (!notify || typeof ResizeObserver === "undefined") return;
    const target = document.querySelector<HTMLElement>(".app-shell") ?? document.getElementById("root");
    if (!target) return;
    let frame = 0;
    let lastHeight = -1;
    const measure = () => {
      frame = window.requestAnimationFrame(() => {
        const contentHeight = Math.ceil(
          Math.max(target.getBoundingClientRect().height, target.scrollHeight),
        );
        const height = snapshot.displayMode === "fullscreen" && snapshot.maxHeight
          ? Math.max(contentHeight, snapshot.maxHeight)
          : contentHeight;
        if (height > 0 && height !== lastHeight) {
          lastHeight = height;
          notify(height);
        }
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(target);
    measure();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [snapshot.payload, snapshot.displayMode, snapshot.maxHeight]);

  return useMemo(() => snapshot, [snapshot]);
}

export async function callTool(name: string, args: Record<string, unknown>) {
  if (typeof window.openai?.callTool !== "function") return undefined;
  return window.openai.callTool(name, args);
}

export function persistWidgetState(state: Record<string, unknown>) {
  window.openai?.setWidgetState?.({ ...(window.openai.widgetState ?? {}), ...state });
}

export async function requestDisplayMode(mode: "inline" | "fullscreen") {
  if (typeof window.openai?.requestDisplayMode !== "function") return false;
  await window.openai.requestDisplayMode({ mode });
  persistWidgetState({ displayMode: mode });
  return true;
}

export function canRequestDisplayMode() {
  return typeof window.openai?.requestDisplayMode === "function";
}

export function sendFollowUp(prompt: string) {
  if (typeof window.openai?.sendFollowUpMessage !== "function") return false;
  void window.openai.sendFollowUpMessage({ prompt, scrollToBottom: true });
  return true;
}
