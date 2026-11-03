import { Injectable, inject } from '@angular/core';

import { AddToCartResult, Book } from '../../models';
import { CartService } from './cart.service';
import { ToastService } from './toast.service';

/** Adds to the cart and tells the customer what happened. Shared by every page with "Add to Cart". */
@Injectable({ providedIn: 'root' })
export class AddToCartService {
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);

  add(book: Book): AddToCartResult {
    const result = this.cart.add(book);
    switch (result) {
      case 'added':
        this.toast.show(`Added “${book.title}” to your cart`);
        break;
      case 'limit-reached':
        this.toast.show(`You already have the maximum available of “${book.title}”`, 'info');
        break;
      case 'out-of-stock':
        this.toast.show(`“${book.title}” is out of stock`, 'error');
        break;
      case 'invalid-quantity':
        this.toast.show('Could not add that quantity to your cart', 'error');
        break;
    }
    return result;
  }
}
