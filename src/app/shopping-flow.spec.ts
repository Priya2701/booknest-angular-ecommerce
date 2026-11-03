import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';
import { routes } from './app.routes';

/** Click-through tests of the real UI: search, filter, cart, quantities, totals, header badge. */
describe('Shopping flow (integration)', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<App>>;
  let router: Router;
  let root: HTMLElement;

  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
  const $$ = <T extends HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const text = (sel: string) => $(sel)?.textContent?.replace(/\s+/g, ' ').trim();
  const titles = () => $$('app-book-card .title').map((e) => e.textContent!.trim());
  const badge = () => $('.cart__badge')?.textContent?.trim();

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function go(url: string) {
    await router.navigateByUrl(url);
    await settle();
  }

  function addToCart(title: string) {
    const card = $$('app-book-card').find(
      (c) => c.querySelector('.title')?.textContent?.trim() === title,
    )!;
    card.querySelector<HTMLButtonElement>('button')!.click();
    fixture.detectChanges();
  }

  async function search(query: string) {
    $<HTMLInputElement>('input[type="search"]')!.value = query;
    $<HTMLFormElement>('form[role="search"]')!.dispatchEvent(
      new Event('submit', { cancelable: true }),
    );
    await settle();
  }

  const line = (title: string) =>
    $$('.line').find((l) => l.querySelector('.line__title')!.textContent!.trim() === title)!;
  const stepperButton = (title: string, name: 'Increase' | 'Decrease') =>
    line(title).querySelector<HTMLButtonElement>(`button[aria-label^="${name} quantity"]`)!;
  const quantity = (title: string) =>
    line(title).querySelector('.stepper__value')!.textContent!.trim();

  function createApp() {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(App);
    root = fixture.nativeElement;
  }

  beforeEach(() => {
    localStorage.clear();
    createApp();
  });

  it('searches by title and by author', async () => {
    await go('/books');
    expect(titles()).toHaveLength(10);

    await go('/books?q=lighthouse');
    expect(titles()).toEqual(['The Last Lighthouse']);

    await go('/books?q=lila%20hart');
    expect(titles()).toEqual(['Benny and the Moon Bus', "The Tiny Explorer's Atlas"]);
  });

  it('submits the search form to the URL', async () => {
    await go('/books');
    await search('cosmos');
    expect(router.url).toBe('/books?q=cosmos');
    expect(titles()).toEqual(['The Living Cosmos']);
  });

  it('filters by category, combines with search, and can be cleared', async () => {
    await go('/books?category=mystery');
    expect(titles()).toEqual(['The Quiet Archive', 'Ashes at Ridgemont']);
    expect(text('.results-bar__count')).toBe('2 books');

    await go('/books?category=mystery&q=archive');
    expect(titles()).toEqual(['The Quiet Archive']);
    expect(text('.results-bar__count')).toBe('1 book');

    $<HTMLAnchorElement>('.results-bar__clear')!.click();
    await settle();
    expect(titles()).toHaveLength(10);
    expect($('.results-bar__clear')).toBeNull();
  });

  it('keeps the category when searching and the search when changing category', async () => {
    await go('/books?category=science');
    await search('mind');
    expect(router.url).toBe('/books?category=science&q=mind');
    expect(titles()).toEqual(['Patterns of the Mind']);

    $$<HTMLAnchorElement>('.tile')
      .find((t) => t.textContent!.includes('History'))!
      .click();
    await settle();
    expect(router.url).toBe('/books?category=history&q=mind');
    expect(titles()).toEqual([]);
    expect(text('.empty')).toContain('No books match');
  });

  it('shows a helpful message when nothing matches', async () => {
    await go('/books?q=zzzz');
    expect(titles()).toEqual([]);
    expect(text('.empty')).toContain('No books match');
    expect(text('.results-bar__count')).toBe('0 books');
  });

  it('adds books, updates the header badge, quantities, removal and totals', async () => {
    await go('/books');
    addToCart('The Last Lighthouse'); // $14.99
    addToCart('The Last Lighthouse');
    addToCart('The Living Cosmos'); // $24.00
    expect(badge()).toBe('3');

    // 2 x 14.99 + 24 = 53.98, free shipping.
    await go('/cart');
    expect($$('.line')).toHaveLength(2);
    expect(text('.summary__total')).toContain('$53.98');
    expect(text('.summary')).toContain('Free');

    // Increase the lighthouse to 3 copies.
    stepperButton('The Last Lighthouse', 'Increase').click();
    fixture.detectChanges();
    expect(quantity('The Last Lighthouse')).toBe('3');
    expect(text('.summary__total')).toContain('$68.97');
    expect(badge()).toBe('4');

    // Decrease back to 1; the decrease button is then disabled.
    stepperButton('The Last Lighthouse', 'Decrease').click();
    fixture.detectChanges();
    stepperButton('The Last Lighthouse', 'Decrease').click();
    fixture.detectChanges();
    expect(quantity('The Last Lighthouse')).toBe('1');
    expect(stepperButton('The Last Lighthouse', 'Decrease').disabled).toBe(true);
    expect(text('.summary__total')).toContain('$38.99');
    expect(badge()).toBe('2');

    // Remove the Cosmos: subtotal 14.99 is under $35, so shipping applies.
    line('The Living Cosmos').querySelector<HTMLButtonElement>('.line__remove')!.click();
    fixture.detectChanges();
    expect($$('.line')).toHaveLength(1);
    expect(text('.summary')).toContain('$4.99');
    expect(text('.summary__total')).toContain('$19.98');
    expect(badge()).toBe('1');

    // Remove the last item: empty state and no badge.
    $<HTMLButtonElement>('.line__remove')!.click();
    fixture.detectChanges();
    expect(text('.empty__title')).toBe('Your cart is empty');
    expect(badge()).toBeUndefined();
  });

  it('clears the whole cart', async () => {
    await go('/books');
    addToCart('Paper Moons');
    addToCart('Empires of Salt');
    await go('/cart');
    expect($$('.line')).toHaveLength(2);

    $$<HTMLButtonElement>('.summary .link-btn')
      .find((b) => b.textContent!.includes('Clear'))!
      .click();
    fixture.detectChanges();
    expect($('.empty')).not.toBeNull();
    expect(badge()).toBeUndefined();
  });

  it('stops at the available stock and says so', async () => {
    await go('/books?q=ashes'); // stock is 8
    for (let i = 0; i < 9; i++) addToCart('Ashes at Ridgemont');
    await go('/cart');
    expect(quantity('Ashes at Ridgemont')).toBe('8');
    expect(stepperButton('Ashes at Ridgemont', 'Increase').disabled).toBe(true);
    expect(text('.line__max')).toBe('Maximum available');
    expect(badge()).toBe('8');
  });

  it('does not offer out-of-stock books for purchase', async () => {
    await go('/books?q=atlas');
    const button = $<HTMLButtonElement>('app-book-card button')!;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Out of stock');
  });

  it('confirms with a message when a book is added', async () => {
    await go('/books');
    addToCart('Paper Moons');
    expect($('.toast')?.textContent).toContain('Added “Paper Moons”');
  });

  it('keeps the cart after the app is rebuilt (persistence)', async () => {
    await go('/books');
    addToCart('Paper Moons');
    TestBed.tick();

    TestBed.resetTestingModule();
    createApp();
    await go('/cart');
    expect($$('.line')).toHaveLength(1);
    expect(badge()).toBe('1');
  });
});
