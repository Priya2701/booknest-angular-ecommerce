import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';

import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Book } from '../../models';
import { Cart, QuantityChange } from '../../shared/components/cart/cart';

@Component({
  selector: 'app-cart-page',
  imports: [Cart],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPage {
  protected readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly heading = viewChild.required<ElementRef<HTMLElement>>('heading');

  protected onQuantityChange({ book, quantity }: QuantityChange): void {
    this.cart.updateQuantity(book, quantity);
  }

  protected onRemove(book: Book): void {
    this.cart.remove(book.id);
    this.toast.show(`Removed “${book.title}” from your cart`, 'info');
    this.restoreFocus();
  }

  protected onClear(): void {
    this.cart.clear();
    this.toast.show('Your cart is now empty', 'info');
    this.restoreFocus();
  }

  /** The button that was just activated is removed from the DOM; keep keyboard focus on the page. */
  private restoreFocus(): void {
    this.heading().nativeElement.focus();
  }
}
