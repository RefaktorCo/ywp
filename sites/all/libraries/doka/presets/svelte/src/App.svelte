<script>

// svelte doka
import { DokaImageEditor, DokaImageEditorModal, DokaImageEditorOverlay } from 'svelte-doka';

// doka
import 'doka/doka.css';
import {
    // editor
    locale_en_gb,
    createDefaultImageReader,
    createDefaultImageWriter,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_locale_en_gb,
    plugin_crop_defaults,
    plugin_finetune,
    plugin_finetune_locale_en_gb,
    plugin_finetune_defaults,
    plugin_filter,
    plugin_filter_locale_en_gb,
    plugin_filter_defaults,
    plugin_decorate,
    plugin_decorate_defaults,
    plugin_decorate_locale_en_gb,
    component_shape_editor_locale_en_gb,
} from 'doka';

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_decorate);

const editorDefaults = {
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    ...plugin_crop_defaults,
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...plugin_decorate_defaults,
    locale: {
        ...locale_en_gb,
        ...plugin_crop_locale_en_gb,
        ...plugin_finetune_locale_en_gb,
        ...plugin_filter_locale_en_gb,
        ...plugin_decorate_locale_en_gb,
        ...component_shape_editor_locale_en_gb,
    },
};


// props
let inlineResult;

// modal
let modalResult;
let modalVisible = false;

// overlay
let overlayVisible = false;
let overlayResult;
let overlayImageState;
</script>

<main>
	<h1>Doka Image Editor</h1>

	<h2>Inline</h2>

	<div style="height:70vh">
		<DokaImageEditor 
			{ ...editorDefaults }
			on:load={(e) => console.log('inline load', e.detail)}
			on:process={(e) => inlineResult = URL.createObjectURL(e.detail.dest)}
			src="image.jpeg" >
		</DokaImageEditor>
	</div>

	{#if inlineResult}
	<p>
		<img src={inlineResult} alt=""/>
	</p>
	{/if}

	<h2>Modal</h2>

	<p>
		<button on:click={() => modalVisible = true}>Open editor</button>
	</p>

	{#if modalVisible}
		<DokaImageEditorModal
			{ ...editorDefaults }
			on:hide={(e) => modalVisible = false}
			on:load={(e) => console.log('modal load', e.detail)}
			on:process={(e) => modalResult = URL.createObjectURL(e.detail.dest)}
			src="image.jpeg" >

		</DokaImageEditorModal>
	{/if}

	{#if modalResult}
	<p>
		<img src={modalResult} alt=""/>
	</p>
	{/if}

	<h2>Overlay</h2>

	<p>
		{#if !overlayVisible }
			<button on:click={() => overlayVisible = true}>Edit image</button>
		{:else}
			<button on:click={() => overlayVisible = false}>Close editor</button>
		{/if}
	</p>

	{#if !overlayVisible}
	<p>
		<img width="512" height="256" src={overlayResult || 'image.jpeg'} alt="" />
	</p>
	{:else}
	<div style="width:512px; height:256px;">
		<DokaImageEditorOverlay 
			{ ...editorDefaults }
			on:load={(e) => console.log('overlay load', e.detail)}
			on:process={(e) => {
				overlayImageState = e.detail.imageState;
				overlayResult = URL.createObjectURL(e.detail.dest)
				overlayVisible = false;
			}}
			src="image.jpeg" 
			imageState={overlayImageState}>
		</DokaImageEditorOverlay>
	</div>
	{/if}
	
</main>
<style>
	img {
		max-width: 100%;
	}
</style>