import { Directive, Input, HostListener, ElementRef, Renderer2, OnDestroy } from '@angular/core';

@Directive({ selector: '[appTooltip]', standalone: true })
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') text = '';

  private tip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onEnter(): void {
    if (!this.text) return;
    this.tip = this.renderer.createElement('div') as HTMLElement;
    this.renderer.createText(this.text);
    this.tip.textContent = this.text;

    Object.assign(this.tip.style, {
      position:      'fixed',
      background:    '#1f2436',
      color:         '#eef0f6',
      padding:       '5px 10px',
      borderRadius:  '6px',
      fontSize:      '12px',
      fontFamily:    'Inter, sans-serif',
      whiteSpace:    'nowrap',
      pointerEvents: 'none',
      zIndex:        '9999',
      border:        '1px solid rgba(255,255,255,0.1)',
      boxShadow:     '0 4px 16px rgba(0,0,0,0.4)',
      opacity:       '0',
      transition:    'opacity 0.15s ease',
    });

    this.renderer.appendChild(document.body, this.tip);

    const rect = (this.el.nativeElement as HTMLElement).getBoundingClientRect();
    setTimeout(() => {
      if (!this.tip) return;
      const tipRect = this.tip.getBoundingClientRect();
      this.tip.style.left = `${rect.left + rect.width / 2 - tipRect.width / 2}px`;
      this.tip.style.top  = `${rect.top - tipRect.height - 8}px`;
      this.tip.style.opacity = '1';
    }, 0);
  }

  @HostListener('mouseleave') onLeave(): void { this.destroy(); }
  ngOnDestroy(): void { this.destroy(); }

  private destroy(): void {
    if (this.tip) {
      this.renderer.removeChild(document.body, this.tip);
      this.tip = null;
    }
  }
}
