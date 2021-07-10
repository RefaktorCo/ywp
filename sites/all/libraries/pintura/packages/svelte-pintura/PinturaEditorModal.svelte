<script>
import { onMount, onDestroy, beforeUpdate, createEventDispatcher } from 'svelte';
import { openEditor, dispatchEditorEvents } from 'pintura';

const dispatch = createEventDispatcher();

let editor;
let unsubs = [];

onMount(() => {
    editor = openEditor($$props);
    unsubs = dispatchEditorEvents(editor, dispatch);
});

beforeUpdate(() => {
    if (!editor) return;
    Object.assign(editor, $$props);
});

onDestroy(() => {
    if (!editor) return;
    unsubs.forEach(unsub => unsub());
    unsubs = [];
    editor = undefined;
});
</script>