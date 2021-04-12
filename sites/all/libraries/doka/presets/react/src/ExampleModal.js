import { useState } from 'react';

// react-doka
import { DokaImageEditorModal } from 'react-doka';

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

export default function ExampleModal() {
    // modal
    const [visible, setVisible] = useState(false);
    const [result, setResult] = useState('');

    return (
        <div>
            <h2>Modal</h2>

            <p>
                <button onClick={() => setVisible(true)}>Open editor</button>
            </p>
            {visible && (
                <DokaImageEditorModal
                    {...editorDefaults}
                    src={'./image.jpeg'}
                    onLoad={(res) => console.log('load modal image', res)}
                    onHide={() => setVisible(false)}
                    onProcess={({ dest }) => setResult(URL.createObjectURL(dest))}
                />
            )}
            {!!result.length && (
                <p>
                    <img src={result} alt="" />
                </p>
            )}
        </div>
    );
}
