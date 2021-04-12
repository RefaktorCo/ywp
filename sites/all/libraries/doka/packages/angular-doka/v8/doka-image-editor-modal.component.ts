import { Component, OnInit } from '@angular/core';
import { openEditor, DokaImageEditorModal } from '../doka/doka';
import { DokaImageEditorAbstractComponent } from './doka-image-editor-abstract.component';

@Component({
    selector: 'doka-image-editor-modal',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class DokaImageEditorModalComponent
    extends DokaImageEditorAbstractComponent
    implements OnInit {
    initEditor(element, props) {
        return openEditor(props);
    }

    showEditor() {
        (this.editor as DokaImageEditorModal).show();
    }

    hideEditor() {
        (this.editor as DokaImageEditorModal).hide();
    }

    ngOnDestroy() {
        if (!this.editor) return;
        this.editor = undefined;
    }
}
