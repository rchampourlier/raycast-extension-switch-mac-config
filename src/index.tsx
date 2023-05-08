import {
  ActionPanel,
  Action,
  Icon,
  List,
  closeMainWindow,
  showHUD,
} from "@raycast/api";
import applyConfig from "./apply-config";
import { popToRoot } from "@raycast/api";

const CONFIGS = [
  {
    id: "arc-vscode",
    title: "Work",
    subtitle: "Arc + VSCode",
    icon: "list-icon-work.png",
  },
  {
    id: "brave-vscode",
    title: "Off with VSCode",
    subtitle: "Brave + VSCode",
    icon: "list-icon-off.png",
  },
  {
    id: "brave-xcode",
    title: "Off with XCode",
    subtitle: "Brave + XCode",
    icon: "list-icon-off.png",
  },
] as const;

export default function Command() {
  return (
    <List>
      {CONFIGS.map((config) => (
        <List.Item
          key={config.id}
          icon={config.icon}
          title={config.title}
          subtitle={config.subtitle}
          accessories={[]}
          actions={
            <ActionPanel>
              <Action
                title="Apply Config"
                onAction={() => {
                  applyConfig(config.id);
                  popToRoot();
                  closeMainWindow();
                  showHUD("Applied config `" + config.title + "`");
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
