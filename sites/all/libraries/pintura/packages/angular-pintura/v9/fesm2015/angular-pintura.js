import { EventEmitter, Component, ElementRef, NgZone, Input, Output, NgModule } from '@angular/core';
import { dispatchEditorEvents, appendEditor, openEditor, overlayEditor } from 'pintura';

class PinturaEditorAbstractComponent {
    constructor(element, zone) {
        this.unsubs = [];
        this.src = undefined;
        this.options = undefined;
        this.loadstart = new EventEmitter();
        this.loaderror = new EventEmitter();
        this.loadprogress = new EventEmitter();
        this.load = new EventEmitter();
        this.processstart = new EventEmitter();
        this.processerror = new EventEmitter();
        this.processprogress = new EventEmitter();
        this.process = new EventEmitter();
        this.undo = new EventEmitter();
        this.redo = new EventEmitter();
        this.revert = new EventEmitter();
        this.destroy = new EventEmitter();
        this.show = new EventEmitter();
        this.hide = new EventEmitter();
        this.close = new EventEmitter();
        this.routeEvent = (e) => {
            const emitter = this[e.type.split(':')[1]];
            if (!emitter)
                return;
            emitter.emit(e.detail);
        };
        this.element = element;
        this.zone = zone;
    }
    initEditor(element, props) {
        return undefined;
    }
    ngAfterViewInit() {
        this.element.nativeElement.classList.add('PinturaRootWrapper');
        // will block angular from listening to events inside the editor
        this.zone.runOutsideAngular(() => {
            this.editor = this.initEditor(this.element.nativeElement, Object.assign({}, this.options, { src: this.src }));
            this.unsubs = dispatchEditorEvents(this.editor, this.element.nativeElement);
        });
        // route events
        Object.keys(this)
            .filter((key) => this[key] instanceof EventEmitter)
            .forEach((key) => {
            this.element.nativeElement.addEventListener(`pintura:${key}`, this.routeEvent);
        });
    }
    ngOnChanges() {
        if (!this.editor)
            return;
        Object.assign(this.editor, this.options, { src: this.src });
    }
    ngOnDestroy() {
        if (!this.editor)
            return;
        this.editor.destroy();
        // unsubscribe
        this.unsubs.forEach((unsub) => unsub());
        this.unsubs = [];
        // unroute events
        Object.keys(this)
            .filter((key) => this[key] instanceof EventEmitter)
            .forEach((key) => {
            this.element.nativeElement.removeEventListener(`pintura:${key}`, this.routeEvent);
        });
        this.editor = undefined;
    }
    ngOnInit() { }
}
PinturaEditorAbstractComponent.decorators = [
    { type: Component, args: [{
                selector: 'pintura-editor',
                template: ` <ng-content></ng-content> `
            },] }
];
PinturaEditorAbstractComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
PinturaEditorAbstractComponent.propDecorators = {
    src: [{ type: Input }],
    options: [{ type: Input }],
    loadstart: [{ type: Output }],
    loaderror: [{ type: Output }],
    loadprogress: [{ type: Output }],
    load: [{ type: Output }],
    processstart: [{ type: Output }],
    processerror: [{ type: Output }],
    processprogress: [{ type: Output }],
    process: [{ type: Output }],
    undo: [{ type: Output }],
    redo: [{ type: Output }],
    revert: [{ type: Output }],
    destroy: [{ type: Output }],
    show: [{ type: Output }],
    hide: [{ type: Output }],
    close: [{ type: Output }]
};

class PinturaEditorComponent extends PinturaEditorAbstractComponent {
    initEditor(element, props) {
        return appendEditor(element, props);
    }
}
PinturaEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'pintura-editor',
                template: ` <ng-content></ng-content> `
            },] }
];

class PinturaEditorModalComponent extends PinturaEditorAbstractComponent {
    initEditor(element, props) {
        return openEditor(props);
    }
    showEditor() {
        this.editor.show();
    }
    hideEditor() {
        this.editor.hide();
    }
    ngOnDestroy() {
        if (!this.editor)
            return;
        this.editor = undefined;
    }
}
PinturaEditorModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'pintura-editor-modal',
                template: ` <ng-content></ng-content> `
            },] }
];

class PinturaEditorOverlayComponent extends PinturaEditorAbstractComponent {
    initEditor(element, props) {
        return overlayEditor(element, props);
    }
}
PinturaEditorOverlayComponent.decorators = [
    { type: Component, args: [{
                selector: 'pintura-editor-overlay',
                template: ` <ng-content></ng-content> `
            },] }
];

class AngularPinturaModule {
}
AngularPinturaModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    PinturaEditorComponent,
                    PinturaEditorModalComponent,
                    PinturaEditorOverlayComponent,
                ],
                imports: [],
                exports: [PinturaEditorComponent, PinturaEditorModalComponent, PinturaEditorOverlayComponent],
            },] }
];

/*
 * Public API Surface of angular-pintura
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AngularPinturaModule, PinturaEditorComponent, PinturaEditorModalComponent, PinturaEditorOverlayComponent, PinturaEditorAbstractComponent as ɵa };
//# sourceMappingURL=angular-pintura.js.map
