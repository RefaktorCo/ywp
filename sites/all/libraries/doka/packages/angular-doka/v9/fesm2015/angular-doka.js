import { EventEmitter, Component, ElementRef, NgZone, Input, Output, NgModule } from '@angular/core';
import { dispatchEditorEvents, appendEditor, openEditor, overlayEditor } from 'doka';

class DokaImageEditorAbstractComponent {
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
        this.element.nativeElement.classList.add('DokaRootWrapper');
        // will block angular from listening to events inside doka
        this.zone.runOutsideAngular(() => {
            this.editor = this.initEditor(this.element.nativeElement, Object.assign({}, this.options, { src: this.src }));
            this.unsubs = dispatchEditorEvents(this.editor, this.element.nativeElement);
        });
        // route events
        Object.keys(this)
            .filter((key) => this[key] instanceof EventEmitter)
            .forEach((key) => {
            this.element.nativeElement.addEventListener(`doka:${key}`, this.routeEvent);
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
            this.element.nativeElement.removeEventListener(`doka:${key}`, this.routeEvent);
        });
        this.editor = undefined;
    }
    ngOnInit() { }
}
DokaImageEditorAbstractComponent.decorators = [
    { type: Component, args: [{
                selector: 'doka-image-editor',
                template: ` <ng-content></ng-content> `
            },] }
];
DokaImageEditorAbstractComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone }
];
DokaImageEditorAbstractComponent.propDecorators = {
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

class DokaImageEditorComponent extends DokaImageEditorAbstractComponent {
    initEditor(element, props) {
        return appendEditor(element, props);
    }
}
DokaImageEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'doka-image-editor',
                template: ` <ng-content></ng-content> `
            },] }
];

class DokaImageEditorModalComponent extends DokaImageEditorAbstractComponent {
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
DokaImageEditorModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'doka-image-editor-modal',
                template: ` <ng-content></ng-content> `
            },] }
];

class DokaImageEditorOverlayComponent extends DokaImageEditorAbstractComponent {
    initEditor(element, props) {
        return overlayEditor(element, props);
    }
}
DokaImageEditorOverlayComponent.decorators = [
    { type: Component, args: [{
                selector: 'doka-image-editor-overlay',
                template: ` <ng-content></ng-content> `
            },] }
];

class AngularDokaModule {
}
AngularDokaModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
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
            },] }
];

/*
 * Public API Surface of angular-doka
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AngularDokaModule, DokaImageEditorComponent, DokaImageEditorModalComponent, DokaImageEditorOverlayComponent, DokaImageEditorAbstractComponent as ɵa };
//# sourceMappingURL=angular-doka.js.map
