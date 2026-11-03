import { BOOKS } from '../../data/books.mock';
import { filterBooks } from './filter-books';

describe('filterBooks', () => {
  const titles = (query: string, categoryId?: string) =>
    filterBooks(BOOKS, { query, categoryId }).map((b) => b.title);

  it('returns every book for an empty query', () => {
    expect(titles('')).toHaveLength(BOOKS.length);
    expect(titles('   ')).toHaveLength(BOOKS.length);
  });

  it('matches title case-insensitively', () => {
    expect(titles('LIGHTHOUSE')).toEqual(['The Last Lighthouse']);
  });

  it('matches author', () => {
    expect(titles('lila hart')).toEqual(['Benny and the Moon Bus', "The Tiny Explorer's Atlas"]);
  });

  it('requires every word to match across title and author', () => {
    expect(titles('elena lighthouse')).toEqual(['The Last Lighthouse']);
    expect(titles('elena cosmos')).toEqual([]);
  });

  it('filters by category', () => {
    expect(titles('', 'mystery')).toEqual(['The Quiet Archive', 'Ashes at Ridgemont']);
  });

  it('combines category and text', () => {
    expect(titles('archive', 'mystery')).toEqual(['The Quiet Archive']);
    expect(titles('archive', 'science')).toEqual([]);
  });

  it('ignores accents and treats the query as plain text, not a pattern', () => {
    expect(titles('lïghthouse')).toEqual(['The Last Lighthouse']);
    expect(titles('.*')).toEqual([]);
  });
});
