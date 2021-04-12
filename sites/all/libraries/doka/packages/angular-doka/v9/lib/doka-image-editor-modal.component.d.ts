import { OnInit } from '@angular/core';
import { DokaImageEditorModal } from 'doka';
import { DokaImageEditorAbstractComponent } from './doka-image-editor-abstract.component';
export declare class DokaImageEditorModalComponent extends DokaImageEditorAbstractComponent implements OnInit {
    initEditor(element: any, props: any): DokaImageEditorModal;
    showEditor(): void;
    hideEditor(): void;
    ngOnDestroy(): void;
}
