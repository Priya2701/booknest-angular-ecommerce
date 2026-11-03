import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BOOKS } from '../../data/books.mock';
import { Book } from '../../models';

/**
 * Data-access layer for books. Backed by mock data today; methods return
 * Observables so an HttpClient implementation can replace it without
 * changing any consumer.
 */
@Injectable({ providedIn: 'root' })
export class BookService {
  getAll(): Observable<readonly Book[]> {
    return of(BOOKS);
  }

  getFeatured(): Observable<readonly Book[]> {
    return of(BOOKS.filter((book) => book.featured));
  }

  getNewArrivals(): Observable<readonly Book[]> {
    return of(BOOKS.filter((book) => book.isNew));
  }

  getByCategory(categoryId: string): Observable<readonly Book[]> {
    return of(BOOKS.filter((book) => book.categoryId === categoryId));
  }

  getById(id: string): Book | undefined {
    return BOOKS.find((book) => book.id === id);
  }
}
