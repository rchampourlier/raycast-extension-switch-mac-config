export type Config = keyof typeof CONFIGS;

export type Browser = (typeof CONFIGS)[keyof typeof CONFIGS]["browser"];

export const CONFIGS = {
  "arc-vscode": {
    browser: "arc",
    browserAlternative: "brave",
    ide: "vscode",
  },
  "brave-vscode": {
    browser: "brave",
    browserAlternative: null,
    ide: "vscode",
  },
  "brave-xcode": {
    browser: "brave",
    browserAlternative: null,
    ide: "xcode",
  },
} as const;

export const BTT_SHARED_SECRET = "REPLACE";

export const FINICKY_CONFIG_PATH = "/Users/YOU/.config/finicky/current.js";

export const BROWSER_APPLICATION_PATHS = {
  arc: "/Applications/Arc.app",
  brave: "/Applications/Brave Browser.app",
  firefox: "/Applications/Firefox.app",
};

export const BROWSER_FINICKY_NAMES = {
  arc: "Arc",
  brave: "Brave Browser",
  firefox: "Firefox",
};

export const ALWAYS_OPEN_IN_BROWSER: Record<Browser, string[]> = {
  arc: [],
  brave: ["youtube.com", "youtu.be"],
};

export const IDE_APPLICATION_PATHS = {
  xcode: "/Applications/Xcode.app",
  vscode: "/Applications/Visual Studio Code.app",
};

export const BTT_SHORTCUT_UUIDS = {
  browser: "LOOK INTO BTT",
  ide: "LOOK INTO BTT",
};
