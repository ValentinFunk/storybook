import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'storybook-button',
  template: `<button type="button" (click)="onClick.emit($event)">{{ label }}</button>`,
})
export class ButtonComponent {
  @Input() label = '';
  @Input() primary = false;
  @Output() onClick = new EventEmitter<Event>();
}
