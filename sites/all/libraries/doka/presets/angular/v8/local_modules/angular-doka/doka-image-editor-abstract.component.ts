import { Component, Input, Output, EventEmitter, ElementRef, NgZone, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import {
    ImageSource,
    DokaImageEditorOptions,
    DokaImageEditor,
    dispatchEditorEvents,
} from '../doka/doka';

@Component({
    selector: 'doka-image-editor',
    template: ` <ng-content></ng-content> `,
    styles: [],
})
export class DokaImageEditorAbstractComponent implements OnInit {
    protected element: ElementRef;
    protected editor: DokaImageEditor;
    protected zone: NgZone;
    private unsubs: Function[] = [];

    @Input() src: ImageSource | SafeUrl = undefined;
    @Input() options: DokaImageEditorOptions = undefined;

    @Output() loadstart: EventEmitter<any> = new EventEmitter();
    @Output() loaderror: EventEmitter<any> = new EventEmitter();
    @Output() loadprogress: EventEmitter<any> = new EventEmitter();
    @Output() load: EventEmitter<any> = new EventEmitter();
    @Output() processstart: EventEmitter<any> = new EventEmitter();
    @Output() processerror: EventEmitter<any> = new EventEmitter();
    @Output() processprogress: EventEmitter<any> = new EventEmitter();
    @Output() process: EventEmitter<any> = new EventEmitter();
    @Output() undo: EventEmitter<any> = new EventEmitter();
    @Output() redo: EventEmitter<any> = new EventEmitter();
    @Output() revert: EventEmitter<any> = new EventEmitter();
    @Output() destroy: EventEmitter<any> = new EventEmitter();
    @Output() show: EventEmitter<any> = new EventEmitter();
    @Output() hide: EventEmitter<any> = new EventEmitter();
    @Output() close: EventEmitter<any> = new EventEmitter();

    constructor(element: ElementRef, zone: NgZone) {
        this.element = element;
        this.zone = zone;
    }

    private routeEvent: EventHandlerNonNull = (e: CustomEvent) => {
        const emitter = this[e.type.split(':')[1]];
        if (!emitter) return;
        emitter.emit(e.detail);
    };

    protected initEditor(element: HTMLElement, props: any): DokaImageEditor {
        return undefined;
    }

    ngAfterViewInit(): void {
        this.element.nativeElement.classList.add('DokaRootWrapper');
        // will block angular from listening to events inside doka
        this.zone.runOutsideAngular(() => {
            this.editor = this.initEditor(
                this.element.nativeElement,
                Object.assign({}, this.options, { src: this.src as string })
            );
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
        if (!this.editor) return;
        Object.assign(this.editor, this.options, { src: this.src });
    }

    ngOnDestroy() {
        if (!this.editor) return;

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

    ngOnInit(): void {}
}
