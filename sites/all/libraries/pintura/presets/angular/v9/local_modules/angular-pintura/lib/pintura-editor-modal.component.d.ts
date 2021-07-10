import { OnInit } from '@angular/core';
import { PinturaEditorModal } from 'pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';
export declare class PinturaEditorModalComponent extends PinturaEditorAbstractComponent implements OnInit {
    initEditor(element: HTMLElement, props: any): PinturaEditorModal;
    showEditor(): void;
    hideEditor(): void;
    ngOnDestroy(): void;
}
