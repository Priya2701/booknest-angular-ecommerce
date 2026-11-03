import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AddToCartService } from '../../core/services/add-to-cart.service';
import { BookService } from '../../core/services/book.service';
import { CategoryService } from '../../core/services/category.service';
import { filterBooks } from '../../core/utils/filter-books';
import { Book } from '../../models';
import { BookListing } from '../../shared/components/book-listing/book-listing';
import { CategorySection } from '../../shared/components/category-section/category-section';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';

const MAX_QUERY_LENGTH = 100;

/** Lists books, narrowed by the `category` (slug) and `q` (title/author text) query params. */
@Component({
  selector: 'app-catalog-page',
  imports: [CategorySection, BookListing, SearchBar, SectionHeading, RouterLink],
  templateUrl: './catalog-page.html',
  styleUrl: './catalog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogPage {
  private readonly addToCartService = inject(AddToCartService);
  private readonly router = inject(Router);

  protected readonly categories = toSignal(inject(CategoryService).getAll(), { initialValue: [] });
  private readonly allBooks = toSignal(inject(BookService).getAll(), { initialValue: [] });

  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap);

  protected readonly activeSlug = computed(() => this.params()?.get('category') ?? undefined);
  protected readonly query = computed(() =>
    (this.params()?.get('q') ?? '').trim().slice(0, MAX_QUERY_LENGTH),
  );

  private readonly activeCategory = computed(() =>
    this.categories().find((category) => category.slug === this.activeSlug()),
  );

  protected readonly isFiltered = computed(() => !!this.query() || !!this.activeCategory());

  protected readonly books = computed(() =>
    filterBooks(this.allBooks(), {
      query: this.query(),
      categoryId: this.activeCategory()?.id,
    }),
  );

  protected readonly heading = computed(() => {
    const parts: string[] = [];
    const category = this.activeCategory();
    const query = this.query();
    if (category) parts.push(category.name);
    if (query) parts.push(`“${query}”`);
    return parts.length ? parts.join(' · ') : 'All books';
  });

  protected readonly resultSummary = computed(() => {
    const count = this.books().length;
    return `${count} ${count === 1 ? 'book' : 'books'}`;
  });

  protected onSearch(query: string): void {
    void this.router.navigate(['/books'], {
      queryParams: { q: query || null },
      queryParamsHandling: 'merge',
    });
  }

  protected addToCart(book: Book): void {
    this.addToCartService.add(book);
  }
}
