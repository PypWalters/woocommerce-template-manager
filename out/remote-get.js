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
// this file handles the remote call to github to grab and display the specified file and version
const vscode = require("vscode");
const parse_templates_1 = require("./parse-templates");
// make the call to github and show the content locally
function getRemoteFile(filePath, version) {
    return __awaiter(this, void 0, void 0, function* () {
        const remoteUrl = createRemoteUrl(filePath, version);
        const content = yield makeRequest('GET', remoteUrl);
        return content;
    });
}
exports.getRemoteFile = getRemoteFile;
function openRemoteDiff(filePath, version, diffFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield getRemoteFile(filePath, version);
        vscode.workspace
            .openTextDocument({
            language: 'php',
            content: content,
        })
            .then(document => {
            if (diffFile) {
                vscode.commands.executeCommand('vscode.diff', document.uri, diffFile.document.uri, `[Remote] - ${parse_templates_1.getWooPath(diffFile.document.fileName)} <-> [Local] - ${parse_templates_1.getWooPath(diffFile.document.fileName)}`);
            }
            else {
                // fallback just incase there is no active editor
                vscode.window.showTextDocument(document);
            }
        });
    });
}
exports.openRemoteDiff = openRemoteDiff;
function openRemoteFile(filePath, version) {
    return __awaiter(this, void 0, void 0, function* () {
        let content = yield getRemoteFile(filePath, version);
        vscode.workspace
            .openTextDocument({
            language: 'php',
            content: content,
        })
            .then(document => {
            vscode.window.showTextDocument(document);
        });
    });
}
exports.openRemoteFile = openRemoteFile;
// generate the remote url based on the file name and version arguments
function createRemoteUrl(filePath, version) {
    return 'https://raw.githubusercontent.com/woocommerce/woocommerce/' + version + '/templates/' + filePath;
}
function makeRequest(method, url) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (200 === xhr.status) {
                    resolve(xhr.responseText);
                }
                else {
                    vscode.window.showErrorMessage(`There was an error retrieving the specified WooCommerce Template at: ${url}. Please check the file path and version number specified and try again.`);
                    reject(xhr.responseText);
                }
            };
            xhr.onerror = function () {
                reject(xhr.responseText);
            };
            xhr.open(method, url);
            xhr.send(null);
        });
    });
}
//# sourceMappingURL=remote-get.js.map