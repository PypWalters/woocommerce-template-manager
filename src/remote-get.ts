// this file handles the remote call to github to grab and display the specified file and version
import * as vscode from 'vscode';
import { getWooPath } from './parse-templates';


// make the call to github and show the content locally
export async function getRemoteFile(filePath: string, version: string):Promise<string> {
    const remoteUrl: string = createRemoteUrl(filePath, version);
    const content: string = await makeRequest('GET', remoteUrl);   
    
    return content;
}

export async function openRemoteDiff( filePath: string, version: string, diffFile:vscode.TextEditor | undefined ) {

    let content = await getRemoteFile( filePath, version );

    vscode.workspace
    .openTextDocument({
        language: 'php',
        content: content,
    })
        .then(document => {
            if ( diffFile ){
                vscode.commands.executeCommand( 'vscode.diff', document.uri, diffFile.document.uri, `[Remote] - ${getWooPath(diffFile.document.fileName)} <-> [Local] - ${getWooPath(diffFile.document.fileName)}` );
            } else {
                // fallback just incase there is no active editor
                vscode.window.showTextDocument(document);  
            }
        }); 
}

export async function openRemoteFile( filePath: string, version: string ) {

    let content = await getRemoteFile( filePath, version );

    vscode.workspace
    .openTextDocument({
        language: 'php',
        content: content,
    })
        .then(document => {
            vscode.window.showTextDocument(document);  
        }); 
}

// generate the remote url based on the file name and version arguments
function createRemoteUrl(filePath: string, version: string) {
    return 'https://raw.githubusercontent.com/woocommerce/woocommerce/' + version + '/templates/' + filePath;
}

async function makeRequest(method: string, url: string):Promise<string> {
    return new Promise(function (resolve, reject) {
        let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if( 200 === xhr.status ) {
                resolve(xhr.responseText);
            } else {
                vscode.window.showErrorMessage( `There was an error retrieving the specified WooCommerce Template at: ${url}. Please check the file path and version number specified and try again.`);
                reject(xhr.responseText);
            }
        };
        xhr.onerror = function () {
            reject(xhr.responseText);
        };
        xhr.open(method, url);
        xhr.send(null);
    });
}
