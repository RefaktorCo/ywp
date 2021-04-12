import { useState } from 'react';

// doka
import 'doka/doka.css';
import {
    // editor
    openEditor,
    locale_en_gb,
    createDefaultImageReader,
    createDefaultImageWriter,
    legacyDataToImageState,
    processImage,
    imageOrienter,

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

// filepond
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginImageEditor from 'filepond-plugin-image-editor';
registerPlugin(FilePondPluginImageEditor, FilePondPluginFilePoster);

// doka
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_decorate);

export default function ExampleFilePond() {
    const [files, setFiles] = useState([]);

    return (
        <div>
            <h2>FilePond</h2>
            <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                filePosterMaxHeight={256}
                server="/api"
                name="files"
                imageEditor={{
                    // map legacy data objects to new imageState objects
                    legacyDataToImageState: legacyDataToImageState,

                    // used to create the editor, receives editor configuration, should return an editor instance
                    createEditor: openEditor,

                    // Required, used for reading the image data
                    imageReader: [
                        createDefaultImageReader,
                        {
                            /* optional image reader options here */
                        },
                    ],

                    // optionally. can leave out when not generating a preview thumbnail and/or output image
                    imageWriter: [
                        createDefaultImageWriter,
                        {
                            /* optional image writer options here */
                        },
                    ],

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
                            ...component_shape_editor_locale_en_gb,
                        },
                    },
                }}
            />
        </div>
    );
}
