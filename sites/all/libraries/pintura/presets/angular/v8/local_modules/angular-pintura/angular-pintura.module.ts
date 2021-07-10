// @ts-ignore
import { NgModule } from '@angular/core';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';
import { PinturaEditorComponent } from './pintura-editor.component';
import { PinturaEditorModalComponent } from './pintura-editor-modal.component';
import { PinturaEditorOverlayComponent } from './pintura-editor-overlay.component';

@NgModule({
    declarations: [
        PinturaEditorAbstractComponent,
        PinturaEditorComponent,
        PinturaEditorModalComponent,
        PinturaEditorOverlayComponent,
    ],
    imports: [],
    exports: [PinturaEditorComponent, PinturaEditorModalComponent, PinturaEditorOverlayComponent],
})

// @ts-ignore
export class AngularPinturaModule {}
