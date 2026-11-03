import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Book } from '../../../models';
import { BookCard } from '../book-card/book-card';
import { SectionHeading } from '../section-heading/section-heading';

@Component({
  selector: 'app-book-listing',
  imports: [BookCard, SectionHeading],
  templateUrl: './book-listing.html',
  styleUrl: './book-listing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListing {
  readonly books = input.required<readonly Book[]>();
  readonly heading = input<string>();
  readonly subheading = input<string>();
  readonly linkLabel = input<string>();
  readonly link = input<string | readonly unknown[]>('/books');
  readonly emptyMessage = input('No books found.');
  readonly addToCart = output<Book>();
}
