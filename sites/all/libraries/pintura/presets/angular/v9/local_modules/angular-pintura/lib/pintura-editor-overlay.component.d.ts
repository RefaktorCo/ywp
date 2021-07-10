import { OnInit } from '@angular/core';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';
export declare class PinturaEditorOverlayComponent extends PinturaEditorAbstractComponent implements OnInit {
    initEditor(element: HTMLElement, props: any): import("pintura").PinturaEditor;
}
