import { TestBed } from '@angular/core/testing';

import { RatingStars } from './rating-stars';

describe('RatingStars', () => {
  function render(rating: number, reviewCount?: number) {
    const fixture = TestBed.createComponent(RatingStars);
    fixture.componentRef.setInput('rating', rating);
    if (reviewCount !== undefined) {
      fixture.componentRef.setInput('reviewCount', reviewCount);
    }
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  beforeEach(() => TestBed.configureTestingModule({ imports: [RatingStars] }));

  it('fills stars proportionally to the rating', () => {
    const fill = render(4.5).querySelector('.stars__fill') as HTMLElement;
    expect(fill.style.width).toBe('90%');
  });

  it('clamps out-of-range ratings', () => {
    expect((render(7).querySelector('.stars__fill') as HTMLElement).style.width).toBe('100%');
  });

  it('exposes an accessible label including review count', () => {
    const label = render(4.6, 1280).querySelector('[role="img"]')?.getAttribute('aria-label');
    expect(label).toBe('Rated 4.6 out of 5 from 1280 reviews');
  });
});
