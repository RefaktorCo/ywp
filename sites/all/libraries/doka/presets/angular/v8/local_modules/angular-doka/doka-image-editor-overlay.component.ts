import { Component, OnInit } from '@angular/core';

import { overlayEditor } from '../doka/doka';
import { DokaImageEditorAbstractComponent } from './doka-image-editor-abstract.component';

@Component({
    selector: 'doka-image-editor-overlay',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class DokaImageEditorOverlayComponent
    extends DokaImageEditorAbstractComponent
    implements OnInit {
    initEditor(element, props) {
        return overlayEditor(element, props);
    }
}
