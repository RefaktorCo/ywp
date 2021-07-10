/*!
 * Pintura Image Editor 8.1.1
 * (c) 2018-2021 PQINA Inc. - All Rights Reserved
 * License: https://pqina.nl/pintura/license/
 */
/* eslint-disable */

var useEditorWithUppy = (function () {
    'use strict';

    function useEditorWithUppy (openEditor, editorOptions = {}, getUppyAddFileRef) {
        const queue = [];

        const editNextFile = () => {
            const next = queue[0];
            if (next) next();
        };

        const queueFile = (file) => {
            queue.push(function () {
                const editor = openEditor({
                    ...editorOptions,
                    src: file.data,
                });

                editor.on('hide', () => {
                    // Remove this item from the queue
                    queue.shift();

                    // Edit next item in queue
                    editNextFile();
                });

                editor.on('process', ({ dest }) => {
                    // Don't add file if cancelled
                    if (!dest) return;

                    // add the modified file
                    const add = getUppyAddFileRef ? getUppyAddFileRef() : window['uppy'].addFile;

                    // add back into uppy file queue
                    add({
                        ...file,
                        data: dest,
                        __handledByEditor: true,
                    });
                });
            });

            // If this is first item, let's open the editor immmidiately
            if (queue.length === 1) editNextFile();
        };

        return (file) => {
            if (file.__handledByEditor) return true;

            // edit first, then add manually
            queueFile(file);

            // can't add now, we have to wait for editing to finish
            return false;
        };
    }

    return useEditorWithUppy;

}());
