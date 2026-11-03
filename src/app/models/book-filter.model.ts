export interface BookFilter {
  /** Free text matched against title and author. Every word must match. */
  readonly query: string;
  /** Restrict results to this category id. */
  readonly categoryId?: string;
}
