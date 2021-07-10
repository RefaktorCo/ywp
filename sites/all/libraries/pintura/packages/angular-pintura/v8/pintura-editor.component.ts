import { Component, OnInit } from '@angular/core';

import { appendEditor } from '../pintura/pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';

@Component({
    selector: 'pintura-editor',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class PinturaEditorComponent extends PinturaEditorAbstractComponent implements OnInit {
    initEditor(element, props) {
        return appendEditor(element, props);
    }
}
