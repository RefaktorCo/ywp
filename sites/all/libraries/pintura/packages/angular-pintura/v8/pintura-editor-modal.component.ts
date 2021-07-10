import { Component, OnInit } from '@angular/core';
import { openEditor, PinturaEditorModal } from '../pintura/pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';

@Component({
    selector: 'pintura-editor-modal',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class PinturaEditorModalComponent extends PinturaEditorAbstractComponent implements OnInit {
    initEditor(element, props) {
        return openEditor(props);
    }

    showEditor() {
        (this.editor as PinturaEditorModal).show();
    }

    hideEditor() {
        (this.editor as PinturaEditorModal).hide();
    }

    ngOnDestroy() {
        if (!this.editor) return;
        this.editor = undefined;
    }
}
