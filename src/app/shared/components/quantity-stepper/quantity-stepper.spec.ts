import { TestBed } from '@angular/core/testing';

import { QuantityStepper } from './quantity-stepper';

describe('QuantityStepper', () => {
  function render(value: number, max = 10) {
    const fixture = TestBed.createComponent(QuantityStepper);
    fixture.componentRef.setInput('value', value);
    fixture.componentRef.setInput('max', max);
    fixture.componentRef.setInput('label', 'Paper Moons');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const [minus, plus] = Array.from(el.querySelectorAll('button')) as HTMLButtonElement[];
    const emitted: number[] = [];
    fixture.componentInstance.valueChange.subscribe((v) => emitted.push(v));
    return { el, minus, plus, emitted };
  }

  beforeEach(() => TestBed.configureTestingModule({ imports: [QuantityStepper] }));

  it('emits value + 1 and value - 1', () => {
    const { minus, plus, emitted } = render(3);
    plus.click();
    minus.click();
    expect(emitted).toEqual([4, 2]);
  });

  it('disables decrease at the minimum', () => {
    const { minus, plus } = render(1);
    expect(minus.disabled).toBe(true);
    expect(plus.disabled).toBe(false);
  });

  it('disables increase at the maximum', () => {
    const { minus, plus } = render(5, 5);
    expect(plus.disabled).toBe(true);
    expect(minus.disabled).toBe(false);
  });

  it('has descriptive accessible names', () => {
    const { minus, plus } = render(2);
    expect(minus.getAttribute('aria-label')).toBe('Decrease quantity of Paper Moons');
    expect(plus.getAttribute('aria-label')).toBe('Increase quantity of Paper Moons');
  });
});
