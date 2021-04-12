import { useState } from 'react';

// react-doka
import { DokaImageEditorOverlay } from 'react-doka';

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

export default function ExampleOverlay() {
    // overlay
    const [visible, setVisible] = useState(false);
    const [result, setResult] = useState({
        imagePreview: './image.jpeg',
        imageState: undefined,
    });

    return (
        <div className="App">
            <h2>Overlay</h2>

            <p>
                {!visible && <button onClick={() => setVisible(true)}>Edit image</button>}
                {visible && <button onClick={() => setVisible(false)}>Close editor</button>}
            </p>

            {!visible && (
                <p>
                    <img width="512" height="256" src={result.imagePreview} alt="" />
                </p>
            )}
            {visible && (
                <div style={{ width: '512px', height: '256px' }}>
                    <DokaImageEditorOverlay
                        src={'./image.jpeg'}
                        {...editorDefaults}
                        imageState={result.imageState}
                        onLoad={(res) => console.log('load image', res)}
                        onProcess={({ dest, imageState }) => {
                            setResult({
                                imagePreview: URL.createObjectURL(dest),
                                imageState: imageState,
                            });
                            setVisible(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
