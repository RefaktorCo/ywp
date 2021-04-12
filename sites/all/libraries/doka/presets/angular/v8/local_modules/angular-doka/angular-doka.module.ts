import { NgModule } from '@angular/core';
import { DokaImageEditorAbstractComponent } from './doka-image-editor-abstract.component';
import { DokaImageEditorComponent } from './doka-image-editor.component';
import { DokaImageEditorModalComponent } from './doka-image-editor-modal.component';
import { DokaImageEditorOverlayComponent } from './doka-image-editor-overlay.component';

@NgModule({
    declarations: [
        DokaImageEditorAbstractComponent,
        DokaImageEditorComponent,
        DokaImageEditorModalComponent,
        DokaImageEditorOverlayComponent,
    ],
    imports: [],
    exports: [
        DokaImageEditorComponent,
        DokaImageEditorModalComponent,
        DokaImageEditorOverlayComponent,
    ],
})
export class AngularDokaModule {}
