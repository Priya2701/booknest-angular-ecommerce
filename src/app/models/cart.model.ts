import { Book } from './book.model';

/** What is persisted: only identifiers and quantities, so prices never go stale. */
export interface CartItem {
  readonly bookId: string;
  readonly quantity: number;
}

/** A cart item resolved against the catalog, ready for display. */
export interface CartLine {
  readonly book: Book;
  readonly quantity: number;
  readonly lineTotal: number;
  /** Highest quantity the customer may hold, limited by stock and the per-item cap. */
  readonly maxQuantity: number;
}

/** Outcome of adding a book to the cart. */
export type AddToCartResult = 'added' | 'limit-reached' | 'out-of-stock' | 'invalid-quantity';
