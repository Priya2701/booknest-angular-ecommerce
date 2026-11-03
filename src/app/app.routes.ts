import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'BookNest',
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'books',
    title: 'Books | BookNest',
    loadComponent: () => import('./features/catalog/catalog-page').then((m) => m.CatalogPage),
  },
  {
    path: 'cart',
    title: 'Cart | BookNest',
    loadComponent: () => import('./features/cart/cart-page').then((m) => m.CartPage),
  },
  { path: '**', redirectTo: '' },
];
