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
const vscode_1 = require("vscode");
const remote_get_1 = require("./remote-get");
function parseFileHeader(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        var info = {
            isWoocommerce: false,
            version: '',
            position: null,
            templatePath: '',
            fileName: doc.fileName,
            latestVersion: ''
        };
        let documentText = doc.getText().split(/\r?\n/);
        let versionArray = null;
        for (let index = 1; index < Math.min(documentText.length, 20); index++) {
            if (documentText[index].includes('WooCommerce/Templates')) {
                info.isWoocommerce = true;
            }
            if (documentText[index].includes('@version')) {
                versionArray = documentText[index].match((/\d+(\.)?/g));
                info.position = new vscode_1.Position(index, documentText[index].length);
            }
        }
        if (info.isWoocommerce && null !== versionArray) {
            info.version = versionArray.join('');
            // get the template path based on the local path
            info.templatePath = getWooPath(doc.fileName);
            // see if this template is up-to-date
            let remoteContent = yield remote_get_1.getRemoteFile(info.templatePath, 'master');
            if (remoteContent) {
                let remoteText = remoteContent.split(/\r?\n/);
                for (let index = 1; index < Math.min(remoteText.length, 20); index++) {
                    if (remoteText[index].includes('@version')) {
                        versionArray = remoteText[index].match((/\d+(\.)?/g));
                        if (null !== versionArray) {
                            info.latestVersion = versionArray.join('');
                        }
                    }
                }
            }
        }
        return info;
    });
}
exports.parseFileHeader = parseFileHeader;
/**
 * Gets the path inside the /woocommerce/templates
 *
 * @param fullFilePath full path to the file on disk
 */
function getWooPath(fullFilePath) {
    return fullFilePath.substr(fullFilePath.indexOf('woocommerce') + 12);
}
exports.getWooPath = getWooPath;
//# sourceMappingURL=parse-templates.js.map