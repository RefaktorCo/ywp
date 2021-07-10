import { useState } from 'react';

// react-pintura
import { PinturaEditorModal } from 'react-pintura';

// pintura
import 'pintura/pintura.css';
import {
    // editor
    locale_en_gb,
    createDefaultImageReader,
    createDefaultImageWriter,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_locale_en_gb,
    plugin_finetune,
    plugin_finetune_locale_en_gb,
    plugin_finetune_defaults,
    plugin_filter,
    plugin_filter_locale_en_gb,
    plugin_filter_defaults,
    plugin_annotate,
    plugin_annotate_locale_en_gb,
    markup_editor_defaults,
    markup_editor_locale_en_gb,
} from 'pintura';

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
    utils: ['crop', 'finetune', 'filter', 'annotate'],
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
        ...locale_en_gb,
        ...plugin_crop_locale_en_gb,
        ...plugin_finetune_locale_en_gb,
        ...plugin_filter_locale_en_gb,
        ...plugin_annotate_locale_en_gb,
        ...markup_editor_locale_en_gb,
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
                <PinturaEditorModal
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
