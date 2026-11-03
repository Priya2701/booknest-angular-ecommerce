import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { Book } from '../../../models';
import { RatingStars } from '../rating-stars/rating-stars';

@Component({
  selector: 'app-book-card',
  imports: [CurrencyPipe, RatingStars],
  templateUrl: './book-card.html',
  styleUrl: './book-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCard {
  readonly book = input.required<Book>();
  readonly addToCart = output<Book>();

  protected readonly inStock = computed(() => this.book().stock > 0);
  protected readonly lowStock = computed(() => this.book().stock > 0 && this.book().stock <= 8);

  protected readonly discountPercent = computed(() => {
    const { price, originalPrice } = this.book();
    return originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : 0;
  });
}
