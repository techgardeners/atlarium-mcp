type OpenAiDisplayMode = "inline" | "fullscreen" | "pip";

type OpenAiSafeArea = {
  insets?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

type OpenAiHost = {
  toolOutput?: unknown;
  toolResponseMetadata?: unknown;
  theme?: "light" | "dark";
  displayMode?: OpenAiDisplayMode;
  maxHeight?: number;
  safeArea?: OpenAiSafeArea;
  locale?: string;
  widgetState?: Record<string, unknown>;
  callTool?: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  sendFollowUpMessage?: (options: {
    prompt: string;
    scrollToBottom?: boolean;
  }) => Promise<void> | void;
  requestDisplayMode?: (options: {
    mode: OpenAiDisplayMode;
  }) => Promise<unknown>;
  setWidgetState?: (state: Record<string, unknown>) => void;
  notifyIntrinsicHeight?: (height?: number) => void;
};

interface Window {
  openai?: OpenAiHost;
}

interface OpenAiSetGlobalsEvent extends Event {
  detail?: {
    globals?: Partial<OpenAiHost>;
  };
}
