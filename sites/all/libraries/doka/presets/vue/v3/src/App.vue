<template>
    <div>
        <h1>Doka Image Editor</h1>

        <h2>Inline</h2>

        <div style="height: 70vh">
            <DokaImageEditor
                v-bind="editorProps"
                :src="inlineSrc"
                @doka:load="handleInlineLoad($event)"
                @doka:process="handleInlineProcess($event)"
            />
        </div>

        <p v-if="inlineResult">
            <img :src="inlineResult" alt="" />
        </p>

        <h2>Modal</h2>

        <p>
            <button @click="modalVisible = true">Open editor</button>
        </p>

        <DokaImageEditorModal
            v-bind="editorProps"
            v-if="modalVisible"
            :src="modalSrc"
            @doka:hide="modalVisible = false"
            @doka:show="handleModalShow()"
            @doka:close="handleModalClose()"
            @doka:load="handleModalLoad($event)"
            @doka:process="handleModalProcess($event)"
        />

        <p v-if="modalResult">
            <img :src="modalResult" alt="" />
        </p>

        <h2>Overlay</h2>

        <p>
            <button v-if="!overlayVisible" @click="overlayVisible = true">Edit image</button>
            <button v-if="overlayVisible" @click="overlayVisible = false">Close editor</button>
        </p>

        <p v-if="!overlayVisible">
            <img :src="overlayResult.imagePreview || overlaySrc" width="512" height="256" alt="" />
        </p>

        <div v-if="overlayVisible" style="width: 512px; height: 256px">
            <DokaImageEditorOverlay
                v-bind="editorProps"
                :src="overlaySrc"
                :imageState="overlayResult.imageState"
                @doka:load="handleOverlayLoad($event)"
                @doka:process="handleOverlayProcess($event)"
            />
        </div>

        <h2>FilePond</h2>

        <file-pond
            ref="pond"
            server="/api"
            accepted-file-types="image/jpeg, image/png"
            allow-multiple="true"
            :imageEditor="myEditor"
            :files="myFiles"
            @:init="handleFilePondInit"
        />
    </div>
</template>

<script>
// Import Vue FilePond
import vueFilePond from 'vue-filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageEditor from 'filepond-plugin-image-editor';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css';

// vue-doka
import { DokaImageEditor, DokaImageEditorModal, DokaImageEditorOverlay } from 'vue-doka';

// doka
import {
    // editor
    createDefaultImageReader,
    createDefaultImageWriter,
    locale_en_gb,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_defaults,
    plugin_crop_locale_en_gb,
    plugin_filter,
    plugin_filter_defaults,
    plugin_filter_locale_en_gb,
    plugin_finetune,
    plugin_finetune_defaults,
    plugin_finetune_locale_en_gb,
    plugin_decorate,
    plugin_decorate_defaults,
    plugin_decorate_locale_en_gb,
    component_shape_editor_locale_en_gb,

    // filepond
    openEditor,
    processImage,
    imageOrienter,
    legacyDataToImageState,
} from 'doka';

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_decorate);

// Create FilePond component
const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImageEditor,
    FilePondPluginFilePoster
);

export default {
    name: 'App',
    components: {
        DokaImageEditor,
        DokaImageEditorModal,
        DokaImageEditorOverlay,
    FilePond,
    },
    methods: {
        // inline
        handleInlineLoad: function (event) {
            console.log('inline load', event.detail);
        },
        handleInlineProcess: function (event) {
            console.log('inline process', event.detail);
            this.inlineResult = URL.createObjectURL(event.detail.dest);
        },

        // modal
        handleModalLoad: function (event) {
            console.log('modal load', event.detail);
        },
        handleModalShow: function () {
            console.log('modal show');
        },
        handleModalClose: function () {
            console.log('modal close');
        },
        handleModalProcess: function (event) {
            console.log('modal process', event.detail);
            this.modalResult = URL.createObjectURL(event.detail.dest);
        },

        // overlay
        handleOverlayLoad: function (event) {
            console.log('overlay load', event.detail);
        },
        handleOverlayProcess: function (event) {
            console.log('overlay process', event.detail);
            const { imageState, dest } = event.detail;
            this.overlayResult = {
                imagePreview: URL.createObjectURL(dest),
                imageState: imageState,
            };
            this.overlayVisible = false;
        },

        // filepond
        handleFilePondInit: function () {
            console.log('FilePond has initialized');
            // FilePond instance methods are available on `this.$refs.pond`
        },
    },
    data() {
        return {
            aspectRatio: undefined,
            // defaults
            editorProps: {
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
            },

            // inline state
            inlineSrc: 'image.jpeg',
            inlineResult: undefined,

            // modal state
            modalSrc: 'image.jpeg',
            modalVisible: false,
            modalResult: undefined,

            // overlay state
            overlaySrc: 'image.jpeg',
            overlayVisible: false,
            overlayResult: {
                imageState: undefined,
                imagePreview: undefined,
            },

            // filepond
            myEditor: {
                // map legacy data objects to new imageState objects
                legacyDataToImageState: legacyDataToImageState,

                // used to create the editor, receives editor configuration, should return an editor instance
                createEditor: openEditor,

                // Required, used for reading the image data
                imageReader: [createDefaultImageReader],

                // optionally. can leave out when not generating a preview thumbnail and/or output image
                imageWriter: [createDefaultImageWriter],

                // used to generate poster images, runs an editor in the background
                imageProcessor: processImage,

                // editor options
                editorOptions: {
                    imageOrienter: imageOrienter,
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
                    },
                },
            },
            myFiles: [],
        };
    },
};
</script>

<style>
@import '../node_modules/doka/doka.css';

html {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

h1 {
    margin-top: 0;
}

body {
    padding: 2em;
}

img {
    max-width: 100%;
}

.doka-image-editor {
    box-shadow: 0 0 0 1px #eee;
}
</style>
