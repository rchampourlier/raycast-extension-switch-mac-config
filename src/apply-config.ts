import { exec } from "child_process";
import {
	type Browser,
	BROWSER_APPLICATION_PATHS,
	BTT_SHARED_SECRET,
	BTT_SHORTCUT_UUIDS,
	type CONFIGS,
	type Config,
	FINICKY_CONFIG_FILES,
	FINICKY_CONFIG_SYMLINK,
	IDE_APPLICATION_PATHS,
} from "./config";
import fs from "node:fs";

type Ide = (typeof CONFIGS)[number]["ide"];

const LOG_VERBOSE = false;
const BTT_MODIFIER_KEYCODES = {
	ALT: 524288,
	CTRL: 262144,
};

export default function applyConfig(config: Config) {
	console.log(`Applying config '${config}'`);

	const { id, browser, ide } = config;
	setBttBrowser(browser);
	setBttIde(ide);
	setFinickyConfig(id as "work" | "personal");
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

function setFinickyConfig(configId: "work" | "personal") {
	console.log(`Setting Finicky config to ${configId}`);

	const targetFile = FINICKY_CONFIG_FILES[configId];

	// Remove existing symlink if it exists
	try {
		fs.unlinkSync(FINICKY_CONFIG_SYMLINK);
	} catch (e) {
		// Ignore if it doesn't exist
	}

	// Create new symlink (relative path for cleaner symlink)
	fs.symlinkSync(targetFile, FINICKY_CONFIG_SYMLINK);
	console.log(`Symlinked ${FINICKY_CONFIG_SYMLINK} -> ${targetFile}`);
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
