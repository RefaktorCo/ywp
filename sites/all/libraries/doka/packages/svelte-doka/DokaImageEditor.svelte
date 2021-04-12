<script>
import { onMount, onDestroy, beforeUpdate, createEventDispatcher } from 'svelte';
import { appendEditor, dispatchEditorEvents } from 'doka';

const dispatch = createEventDispatcher();

let editor;
let element;
let unsubs = [];

onMount(() => {
    editor = appendEditor(element);
    unsubs = dispatchEditorEvents(editor, dispatch);
});

beforeUpdate(() => {
    if (!editor) return;
    Object.assign(editor, $$props);
});

onDestroy(() => {
    if (!editor) return;
    editor.destroy();
    unsubs.forEach(unsub => unsub());
    unsubs = [];
    editor = undefined;
});
</script>

<div class="DokaRootWrapper" bind:this={element}></div>