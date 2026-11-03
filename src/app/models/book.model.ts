export interface Book {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly price: number;
  /** Pre-discount price; present only when the book is on sale. */
  readonly originalPrice?: number;
  readonly categoryId: string;
  /** Average rating from 0 to 5. */
  readonly rating: number;
  readonly reviewCount: number;
  /** Units available. 0 means out of stock. */
  readonly stock: number;
  /** Cover image URL. When absent, a placeholder tinted with `coverColor` is shown. */
  readonly coverUrl?: string;
  readonly coverColor: string;
  readonly featured?: boolean;
  readonly isNew?: boolean;
}
