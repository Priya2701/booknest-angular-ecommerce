import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Book, CartLine } from '../../../models';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';

export interface QuantityChange {
  readonly book: Book;
  readonly quantity: number;
}

/** Presentational shopping cart. State lives in CartService; this only renders and emits. */
@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, QuantityStepper],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  readonly lines = input.required<readonly CartLine[]>();
  readonly itemCount = input.required<number>();
  readonly subtotal = input.required<number>();
  readonly shipping = input.required<number>();
  readonly total = input.required<number>();
  readonly freeShippingThreshold = input<number>();

  readonly quantityChange = output<QuantityChange>();
  readonly remove = output<Book>();
  readonly clear = output<void>();
}
