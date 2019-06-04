// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { collectFileInputData } from './cmd-inputs';
import { openRemoteDiff, getRemoteFile, openRemoteFile } from './remote-get';
import { parseFileHeader, WooTemplateInfo } from './parse-templates';
import { updateDecorations } from './decorations';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// this will store the parsed file info so that we only need to parse each file on open 
	let wooTemplateManager: Array<WooTemplateInfo>= [];

	// The command has been defined in the package.json file
	// The commandId parameter must match the command field in package.json
	let getWooTemplate = vscode.commands.registerCommand('wooTemplates.getWooTemplate', async ( filePath?:string, version?:string, shouldDiff?:boolean ) => {

		// ask the user for input if we don't have any info to go on
		if ( undefined === filePath || undefined === version ) {
			const fileInfoInputs = await collectFileInputData();
			filePath = fileInfoInputs.fileName;
			version = fileInfoInputs.versionNumber;
		}

		// open the remote file or diff
		if( shouldDiff ) {
			let diffEditor = vscode.window.activeTextEditor;
			openRemoteDiff( filePath, version, diffEditor );
		} else {
			openRemoteFile( filePath, version );
		}
	});
	context.subscriptions.push(getWooTemplate);

	// listen for new editors becoming active
	vscode.window.onDidChangeActiveTextEditor( async ( editor ) => {
		if ( undefined !== editor ) {
			let doc = editor.document;
			let templateInfo:WooTemplateInfo;
			
			// check to see if it is a php file
			if ( ! doc.isUntitled && 0 < vscode.languages.match('php', doc ) ) {
				// see if we have already parsed this file
				let trackedIndex:number|null = null;
				let index = 0;
				wooTemplateManager.map( template => {
					if ( doc.fileName === template.fileName ) {
						trackedIndex = index;					
					}
					index++;
				}
				);

				if ( null === trackedIndex ) {
					templateInfo = await parseFileHeader( doc );
					// track this file so we don't need to parse it again
					wooTemplateManager.push( templateInfo );
				} else {
					templateInfo = wooTemplateManager[trackedIndex];				
				}

				if ( templateInfo.isWoocommerce ) {					
					updateDecorations( templateInfo, editor );
				}
			}
		}
	});

	vscode.workspace.onDidCloseTextDocument( (doc:vscode.TextDocument) => {
		// remove the closed doc from wooTemplateManager
		let index:number = 0;
		wooTemplateManager.map( template => {
			if ( doc.fileName === template.fileName ) {
				wooTemplateManager.splice(index, index);
			}
			index++;
		}
		);
	} );

}


// this method is called when your extension is deactivated
export function deactivate() {}