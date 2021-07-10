import { Component, OnInit } from '@angular/core';

import { overlayEditor } from '../pintura/pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';

@Component({
    selector: 'pintura-editor-overlay',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class PinturaEditorOverlayComponent
    extends PinturaEditorAbstractComponent
    implements OnInit {
    initEditor(element, props) {
        return overlayEditor(element, props);
    }
}
