import { useState } from 'react';

import { doka } from 'doka/doka.module.css';

// react-doka
import { DokaImageEditor, DokaImageEditorModal, DokaImageEditorOverlay } from 'react-doka';

// doka
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

export default function Home() {
    // inline
    const [inlineResult, setInlineResult] = useState('');

    // modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalResult, setModalResult] = useState('');

    // overlay
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [overlayResult, setOverlayResult] = useState({
        imagePreview: './image.jpeg',
        imageState: undefined,
    });

    return (
        <div className="App">
            <h1>Doka Image Editor</h1>

            <h2>Inline</h2>

            <div style={{ height: '70vh' }}>
                <DokaImageEditor
                    {...editorDefaults}
                    className={doka}
                    src={'./image.jpeg'}
                    onLoad={(res) => console.log('load inline image', res)}
                    onProcess={({ dest }) => setInlineResult(URL.createObjectURL(dest))}
                />
            </div>

            {!!inlineResult.length && (
                <p>
                    <img src={inlineResult} alt="" />
                </p>
            )}

            <h2>Modal</h2>

            <p>
                <button onClick={() => setModalVisible(true)}>Open editor</button>
            </p>
            {modalVisible && (
                <DokaImageEditorModal
                    {...editorDefaults}
                    className={doka}
                    src={'./image.jpeg'}
                    onLoad={(res) => console.log('load modal image', res)}
                    onHide={() => setModalVisible(false)}
                    onProcess={({ dest }) => setModalResult(URL.createObjectURL(dest))}
                />
            )}
            {!!modalResult.length && (
                <p>
                    <img src={modalResult} alt="" />
                </p>
            )}

            <h2>Overlay</h2>

            <p>
                {!overlayVisible && (
                    <button onClick={() => setOverlayVisible(true)}>Edit image</button>
                )}
                {overlayVisible && (
                    <button onClick={() => setOverlayVisible(false)}>Close editor</button>
                )}
            </p>

            {!overlayVisible && (
                <p>
                    <img width="512" height="256" src={overlayResult.imagePreview} alt="" />
                </p>
            )}
            {overlayVisible && (
                <div style={{ width: '512px', height: '256px' }}>
                    <DokaImageEditorOverlay
                        src={'./image.jpeg'}
                        {...editorDefaults}
                        className={doka}
                        imageState={overlayResult.imageState}
                        onLoad={(res) => console.log('load overlay image', res)}
                        onProcess={({ dest, imageState }) => {
                            setOverlayResult({
                                imagePreview: URL.createObjectURL(dest),
                                imageState: imageState,
                            });
                            setOverlayVisible(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
