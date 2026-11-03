import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { AddToCartResult, Book, CartItem, CartLine } from '../../models';
import { BookService } from './book.service';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'booknest.cart';
const FREE_SHIPPING_THRESHOLD = 35;
const FLAT_SHIPPING = 4.99;
const MAX_QUANTITY_PER_ITEM = 10;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly books = inject(BookService);
  private readonly storage = inject(StorageService);

  private readonly state = signal<readonly CartItem[]>(this.restore());

  /** Cart items resolved against the catalog. Items whose book no longer exists are dropped. */
  readonly lines = computed<readonly CartLine[]>(() =>
    this.state().flatMap((item) => {
      const book = this.books.getById(item.bookId);
      return book
        ? [
            {
              book,
              quantity: item.quantity,
              lineTotal: round(book.price * item.quantity),
              maxQuantity: maxQuantityFor(book),
            },
          ]
        : [];
    }),
  );

  readonly count = computed(() => this.lines().reduce((sum, line) => sum + line.quantity, 0));
  readonly subtotal = computed(() => round(this.lines().reduce((sum, l) => sum + l.lineTotal, 0)));
  readonly shipping = computed(() =>
    this.lines().length === 0 || this.subtotal() >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING,
  );
  readonly total = computed(() => round(this.subtotal() + this.shipping()));
  readonly freeShippingThreshold = FREE_SHIPPING_THRESHOLD;

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this.state()));
  }

  /** Adds `quantity` copies, never exceeding stock or the per-item cap. */
  add(book: Book, quantity = 1): AddToCartResult {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return 'invalid-quantity';
    }
    const max = maxQuantityFor(book);
    if (max < 1) {
      return 'out-of-stock';
    }
    const current = this.quantityOf(book.id);
    if (current >= max) {
      return 'limit-reached';
    }
    this.setQuantity(book, current + quantity);
    return 'added';
  }

  /** Sets an exact quantity (clamped to 1..max). Use `remove` to delete a line. */
  updateQuantity(book: Book, quantity: number): void {
    if (!Number.isFinite(quantity) || this.quantityOf(book.id) === 0) {
      return;
    }
    this.setQuantity(book, Math.max(1, quantity));
  }

  quantityOf(bookId: string): number {
    return this.state().find((item) => item.bookId === bookId)?.quantity ?? 0;
  }

  remove(bookId: string): void {
    this.state.update((items) => items.filter((item) => item.bookId !== bookId));
  }

  clear(): void {
    this.state.set([]);
  }

  private setQuantity(book: Book, requested: number): void {
    const quantity = Math.min(Math.floor(requested), maxQuantityFor(book));
    if (!Number.isFinite(quantity) || quantity < 1) {
      this.remove(book.id);
      return;
    }
    this.state.update((items) =>
      items.some((item) => item.bookId === book.id)
        ? items.map((item) => (item.bookId === book.id ? { ...item, quantity } : item))
        : [...items, { bookId: book.id, quantity }],
    );
  }

  /**
   * Rebuilds the cart from storage. Stored data is untrusted (it can be edited, or stale after a
   * catalogue change), so each entry is validated, duplicates are merged, and quantities are
   * clamped to current stock. Unknown and out-of-stock books are dropped.
   */
  private restore(): readonly CartItem[] {
    const stored = this.storage.read<unknown>(STORAGE_KEY, []);
    if (!Array.isArray(stored)) {
      return [];
    }
    const merged = new Map<string, number>();
    for (const item of stored) {
      if (typeof item?.bookId !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1) {
        continue;
      }
      merged.set(item.bookId, (merged.get(item.bookId) ?? 0) + item.quantity);
    }
    const items: CartItem[] = [];
    for (const [bookId, quantity] of merged) {
      const book = this.books.getById(bookId);
      const max = book ? maxQuantityFor(book) : 0;
      if (max >= 1) {
        items.push({ bookId, quantity: Math.min(quantity, max) });
      }
    }
    return items;
  }
}

function maxQuantityFor(book: Book): number {
  return Math.min(book.stock, MAX_QUANTITY_PER_ITEM);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
