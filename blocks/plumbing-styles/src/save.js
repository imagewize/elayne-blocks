/**
 * Save component — outputs a hidden span so the block has a DOM presence,
 * which guarantees WordPress enqueues style-index.css on the frontend.
 */
export default function save() {
	return (
		<span
			aria-hidden="true"
			className="wp-block-elayne-plumbing-styles"
			style={ { display: 'none' } }
		/>
	);
}
