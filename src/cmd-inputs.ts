import * as vscode from 'vscode';

// creates the input box to enter the file name to retrieve
export async function fileNameInput() {

	const options: vscode.InputBoxOptions = {
		ignoreFocusOut: true,
		placeHolder: 'archive-product.php',
		prompt:
		  'Enter the folder path and file name',
		value: ''
	  };

	const fileInput = await vscode.window.showInputBox( options );
	return fileInput || '';
}

// creates the input box to enter the version number of the file to retrieve
export async function versionNumberInput() {
	
	const options: vscode.InputBoxOptions = {
		ignoreFocusOut: true,
		placeHolder: '3.2.0 or master',
		prompt:
		  'Enter a specific version number or master for the latest version',
		value: ''
	  };

	const version = await vscode.window.showInputBox( options );
	return version || '';
}

export async function collectFileInputData() {
	let input : { fileName:string , versionNumber: string } = {
		fileName : '',
		versionNumber : '',
	};
	
	input.fileName      = await fileNameInput();
	input.versionNumber = await versionNumberInput();

	return input;
}