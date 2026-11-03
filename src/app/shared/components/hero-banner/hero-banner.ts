import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HeroCover {
  readonly url: string;
  readonly alt: string;
}

/**
 * Marketing hero. Project extra content (e.g. a search bar) between the
 * subheading and the call-to-action buttons.
 */
@Component({
  selector: 'app-hero-banner',
  imports: [RouterLink],
  templateUrl: './hero-banner.html',
  styleUrl: './hero-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBanner {
  readonly eyebrow = input<string>();
  readonly heading = input.required<string>();
  readonly subheading = input<string>();
  readonly ctaLabel = input<string>();
  readonly ctaLink = input<string | readonly unknown[]>('/books');
  /** Up to three covers are shown as a fanned stack on wide screens. */
  readonly covers = input<readonly HeroCover[]>([]);
}
