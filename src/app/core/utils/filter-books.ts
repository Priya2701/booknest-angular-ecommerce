import { Book, BookFilter } from '../../models';

/** Lowercases and strips accents so "Márquez" matches "marquez". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Filters books by category and by free text over title and author.
 * Every whitespace-separated word of the query must appear in the title or author,
 * so "elena lighthouse" finds "The Last Lighthouse" by Elena Marsh.
 */
export function filterBooks(books: readonly Book[], filter: BookFilter): readonly Book[] {
  const words = normalize(filter.query).split(/\s+/).filter(Boolean);

  return books.filter((book) => {
    if (filter.categoryId && book.categoryId !== filter.categoryId) {
      return false;
    }
    const haystack = normalize(`${book.title} ${book.author}`);
    return words.every((word) => haystack.includes(word));
  });
}
