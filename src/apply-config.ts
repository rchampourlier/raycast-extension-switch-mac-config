import { exec } from "child_process";
import {
	ALWAYS_OPEN_IN_BROWSER,
	type Browser,
	BROWSER_APPLICATION_PATHS,
	BROWSER_FINICKY_NAMES,
	BTT_SHARED_SECRET,
	BTT_SHORTCUT_UUIDS,
	type CONFIGS,
	type Config,
	FINICKY_CONFIG_PATH,
	IDE_APPLICATION_PATHS,
} from "./config";
import fs from "node:fs";
import path from "node:path";

type Ide = (typeof CONFIGS)[number]["ide"];

const LOG_VERBOSE = false;
const BTT_MODIFIER_KEYCODES = {
	ALT: 524288,
	CTRL: 262144,
};
const FINICKY_CONFIG_JS_TEMPLATE = `
export default {
	defaultBrowser: "__DEFAULT_BROWSER__",
	handlers: [__HANDLERS__],
};
`

export default function applyConfig(config: Config) {
	console.log(`Applying config '${config}'`);

	const { browser, ide } = config;
	setBttBrowser(browser);
	setBttIde(ide);
	setFinickyConfig(browser);
}

function setBttBrowser(browser: Browser) {
	const bttConfigUpdateCommand = bttUpdateTrigger({
		bttUuid: BTT_SHORTCUT_UUIDS.browser,
		applicationPath: BROWSER_APPLICATION_PATHS[browser],
		modifierKeyCode: "ALT",
	});
	console.log(`Setting BTT browser shortcut to ${browser}`);
	execCommand(bttConfigUpdateCommand);
}

function setBttIde(ide: Ide) {
	const bttConfigUpdateCommand = bttUpdateTrigger({
		bttUuid: BTT_SHORTCUT_UUIDS.ide,
		applicationPath: IDE_APPLICATION_PATHS[ide],
		modifierKeyCode: "CTRL",
	});
	console.log(`Setting BTT IDE shortcut to ${ide}`);
	execCommand(bttConfigUpdateCommand);
}

function setFinickyConfig(browser: Browser) {
	console.log(`Setting Finicky config for browser ${browser}`);

	let configText = FINICKY_CONFIG_JS_TEMPLATE;
	configText = configText.replace('__DEFAULT_BROWSER__', BROWSER_FINICKY_NAMES[browser]);

	const handlerStrings = buildHandlerStrings();
	configText = configText.replace('__HANDLERS__', handlerStrings.join(",\n"))

	fs.writeFileSync(FINICKY_CONFIG_PATH, configText);
}

function buildHandlerStrings(): string[] {
	return ALWAYS_OPEN_IN_BROWSER.flatMap(({ browser, domains, profile }) =>
		domains.map(
			(domain) =>
				`    { match: /^https?:\\/\\/.*${domain}.*$/, browser: { name: "${BROWSER_FINICKY_NAMES[browser]}", profile: "${profile}" }}`,
		),
	);
}

function bttUpdateTrigger({
	applicationPath,
	bttUuid,
	modifierKeyCode,
}: {
	bttUuid: string;
	applicationPath: string;
	modifierKeyCode: "ALT" | "CTRL";
}): string {
	return `osascript -l JavaScript -e 'var betterTouchTool = Application("BetterTouchTool");var sharedSecret = "${BTT_SHARED_SECRET}";var triggerDefinition = {"BTTTriggerType":0,"BTTTriggerClass":"BTTTriggerTypeKeyboardShortcut","BTTPredefinedActionType":49,"BTTPredefinedActionName":"Launch Application \\/ Open File \\/ Start Apple Script …","BTTLaunchPath":"${applicationPath}","BTTAdditionalConfiguration":"524320","BTTEnabled2":1,"BTTKeyboardShortcutKeyboardType":2102,"BTTRepeatDelay":0,"BTTUUID":"${bttUuid}","BTTTriggerOnDown":1,"BTTNotesInsteadOfDescription":0,"BTTLayoutIndependentChar":"SPACE","BTTEnabled":1,"BTTModifierMode":0,"BTTShortcutKeyCode":49,"BTTShortcutModifierKeys":${BTT_MODIFIER_KEYCODES[modifierKeyCode]},"BTTOrder":12,"BTTDisplayOrder":0,"BTTAutoAdaptToKeyboardLayout":0};betterTouchTool.update_trigger("${bttUuid}",  {json: JSON.stringify(triggerDefinition), shared_secret: sharedSecret});'`;
}

function execCommand(command: string) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		}
		if (LOG_VERBOSE) {
			if (stdout.length > 0) {
				console.log(`stdout: ${stdout}`);
			}
		}
		if (stderr.length > 0) {
			console.error(`stderr: ${stderr}`);
		}
	});
}
