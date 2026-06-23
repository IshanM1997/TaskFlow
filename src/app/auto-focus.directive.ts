import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

/**
 * Usage: <input appAutoFocus />           ← presence = true (via transform)
 *        <input [appAutoFocus]="false" />  ← explicit false disables it
 */
@Directive({ selector: '[appAutoFocus]', standalone: true })
export class AutoFocusDirective implements AfterViewInit {
  // booleanAttribute transform: bare attribute "appAutoFocus" becomes true
  @Input({ alias: 'appAutoFocus', transform: (v: unknown) => v !== false && v !== 'false' })
  enabled = true;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (this.enabled) {
      setTimeout(() => this.el.nativeElement.focus(), 50);
    }
  }
}
