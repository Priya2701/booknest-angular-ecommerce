import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomePage } from './home-page';

describe('HomePage', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ imports: [HomePage], providers: [provideRouter([])] }),
  );

  it('renders hero, search, categories, featured books and new arrivals', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('h1')?.textContent).toContain('Find your next favourite story');
    expect(el.querySelector('form[role="search"]')).toBeTruthy();
    expect(el.querySelectorAll('.tile').length).toBe(5);

    const headings = Array.from(el.querySelectorAll('h2')).map((h) => h.textContent?.trim());
    expect(headings).toContain('Featured books');
    expect(headings).toContain('New arrivals');

    const cards = el.querySelectorAll('app-book-card');
    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.querySelector('img')?.getAttribute('src')).toMatch(/^\/covers\/.+\.svg$/);
      expect(card.querySelector('button')?.textContent).toContain('Add to Cart');
    });
  });
});
