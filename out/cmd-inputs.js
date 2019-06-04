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
const vscode = require("vscode");
// creates the input box to enter the file name to retrieve
function fileNameInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            ignoreFocusOut: true,
            placeHolder: 'archive-product.php',
            prompt: 'Enter the folder path and file name',
            value: ''
        };
        const fileInput = yield vscode.window.showInputBox(options);
        return fileInput || '';
    });
}
exports.fileNameInput = fileNameInput;
// creates the input box to enter the version number of the file to retrieve
function versionNumberInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            ignoreFocusOut: true,
            placeHolder: '3.2.0 or master',
            prompt: 'Enter a specific version number or master for the latest version',
            value: ''
        };
        const version = yield vscode.window.showInputBox(options);
        return version || '';
    });
}
exports.versionNumberInput = versionNumberInput;
function collectFileInputData() {
    return __awaiter(this, void 0, void 0, function* () {
        let input = {
            fileName: '',
            versionNumber: '',
        };
        input.fileName = yield fileNameInput();
        input.versionNumber = yield versionNumberInput();
        return input;
    });
}
exports.collectFileInputData = collectFileInputData;
//# sourceMappingURL=cmd-inputs.js.map