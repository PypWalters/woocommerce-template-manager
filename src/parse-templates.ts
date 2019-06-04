import { TextDocument, Position } from "vscode";
import { getRemoteFile } from './remote-get';

/**
 * Parse the first few lines of the file to determine if it is woocommerce,
 * If it is Woocommerce try to gather info about the version and path
 * 
 * @param doc
 * 
 * @return array
 */
export interface WooTemplateInfo{ 
	isWoocommerce: boolean;
	version: string;
	position: any;
	templatePath: string;
	fileName: string;
	latestVersion:string;
}

export async function parseFileHeader( doc:TextDocument ) {
	var info: WooTemplateInfo = {
		isWoocommerce: false,
		version: '',
		position: null,
		templatePath: '',
		fileName: doc.fileName,
		latestVersion: ''
	};

	let documentText = doc.getText().split(/\r?\n/);
	let versionArray = null;

	for ( let index = 1; index < Math.min( documentText.length, 20 ); index++ ) {
		if ( documentText[index].includes('WooCommerce/Templates') ) {
			info.isWoocommerce = true;
		}
		if ( documentText[index].includes('@version') ) {
			versionArray = documentText[index].match( (/\d+(\.)?/g) );
			info.position = new Position(index, documentText[index].length);
		}			
	}
		
	if ( info.isWoocommerce && null !== versionArray ) {
		info.version = versionArray.join('');

		// get the template path based on the local path
		info.templatePath = getWooPath( doc.fileName );

		// see if this template is up-to-date
		let remoteContent = await getRemoteFile( info.templatePath, 'master' );
		if ( remoteContent ) {
			let remoteText = remoteContent.split(/\r?\n/);
			for ( let index = 1; index < Math.min( remoteText.length, 20 ); index++ ) {
				if ( remoteText[index].includes('@version') ) {
					versionArray = remoteText[index].match( (/\d+(\.)?/g) );
					if( null !== versionArray ) {
						info.latestVersion = versionArray.join('');
					}
				}	
			}
		}
	} 

	return info;
}

/**
 * Gets the path inside the /woocommerce/templates
 * 
 * @param fullFilePath full path to the file on disk
 */
export function getWooPath( fullFilePath:string ) {
	return fullFilePath.substr( fullFilePath.indexOf( 'woocommerce' ) + 12 );
}