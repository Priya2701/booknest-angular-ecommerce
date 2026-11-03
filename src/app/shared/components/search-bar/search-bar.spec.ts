import { TestBed } from '@angular/core/testing';

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [SearchBar] }));

  it('emits the trimmed query on submit', () => {
    const fixture = TestBed.createComponent(SearchBar);
    fixture.detectChanges();
    const emitted: string[] = [];
    fixture.componentInstance.search.subscribe((q) => emitted.push(q));

    const el = fixture.nativeElement as HTMLElement;
    const input = el.querySelector('input') as HTMLInputElement;
    input.value = '  lighthouse ';
    el.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));

    expect(emitted).toEqual(['lighthouse']);
  });

  it('has an accessible label and search landmark', () => {
    const fixture = TestBed.createComponent(SearchBar);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const label = el.querySelector('label')!;
    const input = el.querySelector('input')!;
    expect(el.querySelector('form')?.getAttribute('role')).toBe('search');
    expect(label.textContent).toContain('Search books');
    expect(label.htmlFor).toBe(input.id);
    expect(input.id).not.toBe('');
  });

  it('gives each instance its own input id so two bars never share one', () => {
    const first = TestBed.createComponent(SearchBar);
    const second = TestBed.createComponent(SearchBar);
    first.detectChanges();
    second.detectChanges();
    const idOf = (f: typeof first) => (f.nativeElement as HTMLElement).querySelector('input')!.id;
    expect(idOf(first)).not.toBe(idOf(second));
  });
});
