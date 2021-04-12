/*!
 * Doka Image Editor 7.5.0
 * (c) 2018-2021 PQINA Inc. - All Rights Reserved
 * License: https://pqina.nl/doka/license/
 */
/* eslint-disable */

function useEditorWithUppy (openEditor, options = {}, getUppyAddFileRef) {
    const queue = [];

    const editNextFile = () => {
        const next = queue[0];
        if (next) next();
    };

    const queueFile = (file) => {
        queue.push(function () {
            const editor = openEditor({
                ...options,
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
                    handledByDoka: true,
                });
            });
        });

        // If this is first item, let's open the editor immmidiately
        if (queue.length === 1) editNextFile();
    };

    return (file) => {
        if (file.handledByDoka) return true;

        // edit first, then add manually
        queueFile(file);

        // can't add now, we have to wait for editing to finish
        return false;
    };
}

export default useEditorWithUppy;
