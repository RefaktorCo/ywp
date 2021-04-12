import { h } from 'vue';

import { overlayEditor, dispatchEditorEvents } from 'doka';

export default {
    mounted() {
        this.editor = overlayEditor(this.$refs.elementRef, Object.assign({}, this.$attrs));
        this.unsubs = dispatchEditorEvents(this.editor, this.$refs.elementRef);
    },

    beforeUpdate() {
        Object.assign(this.editor, Object.assign({}, this.$attrs));
    },

    beforeUnmount() {
        if (!this.editor) return;
        this.editor.destroy();
        this.unsubs.forEach((unsub) => unsub());
        this.unsubs = [];
        this.editor = undefined;
    },

    render() {
        return h('div', { className: 'DokaRootWrapper', ref: 'elementRef' });
    },
};
