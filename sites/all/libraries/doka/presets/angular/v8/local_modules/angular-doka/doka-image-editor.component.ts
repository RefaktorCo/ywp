import { Component, OnInit } from '@angular/core';

import { appendEditor } from '../doka/doka';
import { DokaImageEditorAbstractComponent } from './doka-image-editor-abstract.component';

@Component({
    selector: 'doka-image-editor',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class DokaImageEditorComponent extends DokaImageEditorAbstractComponent implements OnInit {
    initEditor(element, props) {
        return appendEditor(element, props);
    }
}
