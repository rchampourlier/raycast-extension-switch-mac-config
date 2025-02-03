import {
  ActionPanel,
  Action,
  List,
  closeMainWindow,
  showHUD,
} from "@raycast/api";
import applyConfig from "./apply-config";
import { popToRoot } from "@raycast/api";
import { CONFIGS } from "./config";

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
                  applyConfig(config);
                  popToRoot();
                  closeMainWindow();
                  showHUD(`Applied config '${config.title}'`);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
