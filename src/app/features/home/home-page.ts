import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { BookService } from '../../core/services/book.service';
import { AddToCartService } from '../../core/services/add-to-cart.service';
import { CategoryService } from '../../core/services/category.service';
import { Book } from '../../models';
import { BookListing } from '../../shared/components/book-listing/book-listing';
import { CategorySection } from '../../shared/components/category-section/category-section';
import { HeroBanner, HeroCover } from '../../shared/components/hero-banner/hero-banner';
import { SearchBar } from '../../shared/components/search-bar/search-bar';
import { SectionHeading } from '../../shared/components/section-heading/section-heading';

@Component({
  selector: 'app-home-page',
  imports: [HeroBanner, SearchBar, SectionHeading, CategorySection, BookListing],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private readonly addToCartService = inject(AddToCartService);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);

  protected readonly categories = toSignal(inject(CategoryService).getAll(), { initialValue: [] });
  private readonly allBooks = toSignal(this.bookService.getAll(), { initialValue: [] });
  protected readonly featured = toSignal(this.bookService.getFeatured(), { initialValue: [] });
  protected readonly newArrivals = toSignal(this.bookService.getNewArrivals(), { initialValue: [] });

  protected readonly categoryCounts = computed(() => {
    const counts: Record<string, number> = {};
    for (const book of this.allBooks()) {
      counts[book.categoryId] = (counts[book.categoryId] ?? 0) + 1;
    }
    return counts;
  });

  protected readonly heroCovers = computed<readonly HeroCover[]>(() =>
    this.featured()
      .flatMap((book) => (book.coverUrl ? [{ url: book.coverUrl, alt: book.title }] : []))
      .slice(0, 3),
  );

  protected onSearch(query: string): void {
    void this.router.navigate(['/books'], { queryParams: query ? { q: query } : {} });
  }

  protected addToCart(book: Book): void {
    this.addToCartService.add(book);
  }
}
