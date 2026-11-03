import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavLink } from '../../../models';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.vertical]': "orientation() === 'vertical'" },
})
export class Navigation {
  readonly links = input.required<readonly NavLink[]>();
  readonly label = input('Main navigation');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Emits after a link is activated, so a parent (e.g. a mobile menu) can close itself. */
  readonly navigated = output<void>();
}
