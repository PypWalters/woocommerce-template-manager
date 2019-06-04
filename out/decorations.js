"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function updateDecorations(templateInfo, editor) {
    let color;
    let message;
    if (templateInfo.version < templateInfo.latestVersion) {
        color = { id: 'wooTemplates.alert' };
        message = `This template is out-of-date! The latest version is ${templateInfo.latestVersion}`;
    }
    else {
        color = { id: "wooTemplates.info" };
        message = 'Great! This template is up-to-date!';
    }
    const hoverMessage = generateHoverMessage(templateInfo);
    const wooTipDecorationType = vscode.window.createTextEditorDecorationType({ cursor: 'pointer', after: { margin: '0 0 0 1rem' } });
    const versionLine = [
        {
            hoverMessage: hoverMessage,
            range: new vscode.Range(templateInfo.position.line, 1, templateInfo.position.line, 100),
            renderOptions: { after: { contentText: '// ' + message, color } }
        }
    ];
    editor.setDecorations(wooTipDecorationType, versionLine);
}
exports.updateDecorations = updateDecorations;
/**
 * Creates the hover message and links to appear over the WooCommerce template version
 *
 * @param templateInfo
 */
function generateHoverMessage(templateInfo) {
    const hoverMessage = new vscode.MarkdownString(`Mange this WooCommerce Template  \n---  \n`);
    hoverMessage.isTrusted = true;
    // add open original link
    hoverMessage.appendMarkdown(`[Open the original version ${templateInfo.version} >](command:wooTemplates.getWooTemplate?${encodeURIComponent(JSON.stringify([templateInfo.templatePath, templateInfo.version, true]))})`);
    // link separator
    hoverMessage.appendMarkdown('  \n');
    // add open master link
    hoverMessage.appendMarkdown(`[Open the latest version of ${templateInfo.templatePath} >](command:wooTemplates.getWooTemplate?${encodeURIComponent(JSON.stringify([templateInfo.templatePath, 'master', true]))})`);
    return hoverMessage;
}
//# sourceMappingURL=decorations.js.map