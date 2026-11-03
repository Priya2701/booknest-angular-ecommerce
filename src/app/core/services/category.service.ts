import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CATEGORIES } from '../../data/categories.mock';
import { Category } from '../../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  getAll(): Observable<readonly Category[]> {
    return of(CATEGORIES);
  }
}
