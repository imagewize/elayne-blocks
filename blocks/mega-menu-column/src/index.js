/**
 * Mega Menu Column Block
 * Column container for organizing mega menu content in grid layouts
 */

import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType(metadata.name, {
	...metadata,
	edit: Edit,
	save: Save,
});
