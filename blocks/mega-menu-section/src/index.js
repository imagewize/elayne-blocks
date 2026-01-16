/**
 * Mega Menu Section Block
 * Section with heading for grouping mega menu content
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
