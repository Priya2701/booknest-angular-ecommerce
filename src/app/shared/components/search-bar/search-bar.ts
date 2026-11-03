import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

let nextId = 0;

/** Reusable search form. Emits the trimmed query when submitted; the parent decides what to do. */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBar {
  /** Unique per instance so the label stays correctly associated if two bars share a page. */
  protected readonly inputId = `book-search-${nextId++}`;

  readonly value = input('');
  readonly placeholder = input('Title or author');
  readonly label = input('Search books');
  readonly search = output<string>();

  protected onSubmit(event: Event, query: string): void {
    event.preventDefault();
    this.search.emit(query.trim());
  }
}
