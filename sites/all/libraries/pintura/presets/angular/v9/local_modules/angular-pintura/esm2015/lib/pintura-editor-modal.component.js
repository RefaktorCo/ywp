import { Component } from '@angular/core';
import { openEditor } from 'pintura';
import { PinturaEditorAbstractComponent } from './pintura-editor-abstract.component';
export class PinturaEditorModalComponent extends PinturaEditorAbstractComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGludHVyYS1lZGl0b3ItbW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9hbmd1bGFyLXBpbnR1cmEvdjkvcHJvamVjdHMvYW5ndWxhci1waW50dXJhL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9waW50dXJhLWVkaXRvci1tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUVsRCxPQUFPLEVBQUUsVUFBVSxFQUFzQixNQUFNLFNBQVMsQ0FBQztBQUN6RCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQU9yRixNQUFNLE9BQU8sMkJBQTRCLFNBQVEsOEJBQThCO0lBQzNFLFVBQVUsQ0FBQyxPQUFvQixFQUFFLEtBQVU7UUFDdkMsT0FBTyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELFVBQVU7UUFDTCxJQUFJLENBQUMsTUFBNkIsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQyxDQUFDO0lBRUQsVUFBVTtRQUNMLElBQUksQ0FBQyxNQUE2QixDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUM1QixDQUFDOzs7WUFyQkosU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRSw2QkFBNkI7YUFFMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBvcGVuRWRpdG9yLCBQaW50dXJhRWRpdG9yTW9kYWwgfSBmcm9tICdwaW50dXJhJztcbmltcG9ydCB7IFBpbnR1cmFFZGl0b3JBYnN0cmFjdENvbXBvbmVudCB9IGZyb20gJy4vcGludHVyYS1lZGl0b3ItYWJzdHJhY3QuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwaW50dXJhLWVkaXRvci1tb2RhbCcsXG4gICAgdGVtcGxhdGU6IGAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PiBgLFxuICAgIHN0eWxlczogW10sXG59KVxuZXhwb3J0IGNsYXNzIFBpbnR1cmFFZGl0b3JNb2RhbENvbXBvbmVudCBleHRlbmRzIFBpbnR1cmFFZGl0b3JBYnN0cmFjdENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgaW5pdEVkaXRvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgcHJvcHM6IGFueSkge1xuICAgICAgICByZXR1cm4gb3BlbkVkaXRvcihwcm9wcyk7XG4gICAgfVxuXG4gICAgc2hvd0VkaXRvcigpIHtcbiAgICAgICAgKHRoaXMuZWRpdG9yIGFzIFBpbnR1cmFFZGl0b3JNb2RhbCkuc2hvdygpO1xuICAgIH1cblxuICAgIGhpZGVFZGl0b3IoKSB7XG4gICAgICAgICh0aGlzLmVkaXRvciBhcyBQaW50dXJhRWRpdG9yTW9kYWwpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVkaXRvcikgcmV0dXJuO1xuICAgICAgICB0aGlzLmVkaXRvciA9IHVuZGVmaW5lZDtcbiAgICB9XG59XG4iXX0=