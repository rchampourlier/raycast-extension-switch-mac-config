export type Config = (typeof CONFIGS)[number];

export type Browser = (typeof CONFIGS)[number]["browser"];

export const CONFIGS = [
  {
    id: "work",
    title: "Work",
    subtitle: "Arc + VSCode",
    browser: "arc",
    browserAlternative: "brave",
    ide: "vscode",
    icon: "list-icon-work.png",
  },
  {
    id: "personal",
    title: "Personal",
    subtitle: "Brave + Cursor",
    browser: "brave",
    browserAlternative: null,
    ide: "cursor",
    icon: "list-icon-off.png",
  },
] as const;

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
  cursor: "/Applications/Cursor.app",
  xcode: "/Applications/Xcode.app",
  vscode: "/Applications/Visual Studio Code.app",
};

export const BTT_SHORTCUT_UUIDS = {
  browser: "LOOK INTO BTT",
  ide: "LOOK INTO BTT",
};
