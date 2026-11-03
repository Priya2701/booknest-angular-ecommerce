import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../models';

@Component({
  selector: 'app-category-section',
  imports: [RouterLink],
  templateUrl: './category-section.html',
  styleUrl: './category-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategorySection {
  readonly categories = input.required<readonly Category[]>();
  /** Optional book counts keyed by category id. */
  readonly counts = input<Readonly<Record<string, number>>>({});
  /** Slug of the currently selected category, used to mark it as current. */
  readonly activeSlug = input<string>();
}
