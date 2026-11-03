import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavLink } from '../../../models';
import { Navigation } from '../../../shared/components/navigation/navigation';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Navigation],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly cart = inject(CartService);

  protected readonly links: readonly NavLink[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Books', path: '/books' },
  ];

  protected readonly menuOpen = signal(false);
  protected readonly cartLabel = computed(() => {
    const count = this.cart.count();
    return `Cart, ${count} ${count === 1 ? 'item' : 'items'}`;
  });

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
