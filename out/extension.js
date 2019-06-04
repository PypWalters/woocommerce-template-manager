"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const cmd_inputs_1 = require("./cmd-inputs");
const remote_get_1 = require("./remote-get");
const parse_templates_1 = require("./parse-templates");
const decorations_1 = require("./decorations");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // this will store the parsed file info so that we only need to parse each file on open 
    let wooTemplateManager = [];
    // The command has been defined in the package.json file
    // The commandId parameter must match the command field in package.json
    let getWooTemplate = vscode.commands.registerCommand('wooTemplates.getWooTemplate', (filePath, version, shouldDiff) => __awaiter(this, void 0, void 0, function* () {
        // ask the user for input if we don't have any info to go on
        if (undefined === filePath || undefined === version) {
            const fileInfoInputs = yield cmd_inputs_1.collectFileInputData();
            filePath = fileInfoInputs.fileName;
            version = fileInfoInputs.versionNumber;
        }
        // open the remote file or diff
        if (shouldDiff) {
            let diffEditor = vscode.window.activeTextEditor;
            remote_get_1.openRemoteDiff(filePath, version, diffEditor);
        }
        else {
            remote_get_1.openRemoteFile(filePath, version);
        }
    }));
    context.subscriptions.push(getWooTemplate);
    // listen for new editors becoming active
    vscode.window.onDidChangeActiveTextEditor((editor) => __awaiter(this, void 0, void 0, function* () {
        if (undefined !== editor) {
            let doc = editor.document;
            let templateInfo;
            // check to see if it is a php file
            if (!doc.isUntitled && 0 < vscode.languages.match('php', doc)) {
                // see if we have already parsed this file
                let trackedIndex = null;
                let index = 0;
                wooTemplateManager.map(template => {
                    if (doc.fileName === template.fileName) {
                        trackedIndex = index;
                    }
                    index++;
                });
                if (null === trackedIndex) {
                    templateInfo = yield parse_templates_1.parseFileHeader(doc);
                    // track this file so we don't need to parse it again
                    wooTemplateManager.push(templateInfo);
                }
                else {
                    templateInfo = wooTemplateManager[trackedIndex];
                }
                if (templateInfo.isWoocommerce) {
                    decorations_1.updateDecorations(templateInfo, editor);
                }
            }
        }
    }));
    vscode.workspace.onDidCloseTextDocument((doc) => {
        // remove the closed doc from wooTemplateManager
        let index = 0;
        wooTemplateManager.map(template => {
            if (doc.fileName === template.fileName) {
                wooTemplateManager.splice(index, index);
            }
            index++;
        });
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map