import { Component } from '@angular/core';
import { openEditor } from 'doka';
import { DokaImageEditorAbstractComponent } from './doka-image-editor-abstract.component';
export class DokaImageEditorModalComponent extends DokaImageEditorAbstractComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9rYS1pbWFnZS1lZGl0b3ItbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9hbmd1bGFyLWRva2EvdjkvcHJvamVjdHMvYW5ndWxhci1kb2thL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9kb2thLWltYWdlLWVkaXRvci1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsVUFBVSxFQUF3QixNQUFNLE1BQU0sQ0FBQztBQUN4RCxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQztBQU8xRixNQUFNLE9BQU8sNkJBQ1QsU0FBUSxnQ0FBZ0M7SUFFeEMsVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLO1FBQ3JCLE9BQU8sVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVO1FBQ0wsSUFBSSxDQUFDLE1BQStCLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELFVBQVU7UUFDTCxJQUFJLENBQUMsTUFBK0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU87UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7SUFDNUIsQ0FBQzs7O1lBdkJKLFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUUsNkJBQTZCO2FBRTFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG9wZW5FZGl0b3IsIERva2FJbWFnZUVkaXRvck1vZGFsIH0gZnJvbSAnZG9rYSc7XG5pbXBvcnQgeyBEb2thSW1hZ2VFZGl0b3JBYnN0cmFjdENvbXBvbmVudCB9IGZyb20gJy4vZG9rYS1pbWFnZS1lZGl0b3ItYWJzdHJhY3QuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdkb2thLWltYWdlLWVkaXRvci1tb2RhbCcsXG4gICAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxuICAgIHN0eWxlczogW10sXG59KVxuZXhwb3J0IGNsYXNzIERva2FJbWFnZUVkaXRvck1vZGFsQ29tcG9uZW50XG4gICAgZXh0ZW5kcyBEb2thSW1hZ2VFZGl0b3JBYnN0cmFjdENvbXBvbmVudFxuICAgIGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBpbml0RWRpdG9yKGVsZW1lbnQsIHByb3BzKSB7XG4gICAgICAgIHJldHVybiBvcGVuRWRpdG9yKHByb3BzKTtcbiAgICB9XG5cbiAgICBzaG93RWRpdG9yKCkge1xuICAgICAgICAodGhpcy5lZGl0b3IgYXMgRG9rYUltYWdlRWRpdG9yTW9kYWwpLnNob3coKTtcbiAgICB9XG5cbiAgICBoaWRlRWRpdG9yKCkge1xuICAgICAgICAodGhpcy5lZGl0b3IgYXMgRG9rYUltYWdlRWRpdG9yTW9kYWwpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVkaXRvcikgcmV0dXJuO1xuICAgICAgICB0aGlzLmVkaXRvciA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iXX0=