import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Read-only star rating (0-5) with fractional fill and an accessible label. */
@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.html',
  styleUrl: './rating-stars.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingStars {
  readonly rating = input.required<number>();
  readonly reviewCount = input<number>();

  protected readonly fillPercent = computed(() => Math.min(100, Math.max(0, (this.rating() / 5) * 100)));
  protected readonly label = computed(() => {
    const count = this.reviewCount();
    const base = `Rated ${this.rating().toFixed(1)} out of 5`;
    return count === undefined ? base : `${base} from ${count} reviews`;
  });
}
