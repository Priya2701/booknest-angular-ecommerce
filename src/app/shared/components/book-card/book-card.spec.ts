import { TestBed } from '@angular/core/testing';

import { BOOKS } from '../../../data/books.mock';
import { BookCard } from './book-card';

describe('BookCard', () => {
  function render(bookIndex: number) {
    const fixture = TestBed.createComponent(BookCard);
    fixture.componentRef.setInput('book', BOOKS[bookIndex]);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => TestBed.configureTestingModule({ imports: [BookCard] }));

  it('shows cover image, title, author, rating and price', () => {
    const el = render(0).nativeElement as HTMLElement;
    const img = el.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/covers/the-last-lighthouse.svg');
    expect(img.alt).toContain('The Last Lighthouse');
    expect(el.querySelector('.title')?.textContent).toContain('The Last Lighthouse');
    expect(el.querySelector('.author')?.textContent).toContain('Elena Marsh');
    expect(el.querySelector('app-rating-stars')).toBeTruthy();
    expect(el.querySelector('.price__now')?.textContent).toContain('$14.99');
  });

  it('shows a discount badge and the original price for sale items', () => {
    const el = render(0).nativeElement as HTMLElement;
    expect(el.querySelector('.badge--sale')?.textContent).toContain('-21%');
    expect(el.querySelector('.price__old')?.textContent).toContain('$18.99');
  });

  it('emits addToCart with the book when the button is clicked', () => {
    const fixture = render(0);
    const emitted: unknown[] = [];
    fixture.componentInstance.addToCart.subscribe((b) => emitted.push(b));
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Add to Cart');
    button.click();
    expect(emitted).toEqual([BOOKS[0]]);
  });

  it('disables the button when out of stock', () => {
    const index = BOOKS.findIndex((b) => b.stock === 0);
    const button = render(index).nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
