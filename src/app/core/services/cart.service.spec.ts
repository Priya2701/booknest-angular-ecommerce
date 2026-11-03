import { TestBed } from '@angular/core/testing';

import { BOOKS } from '../../data/books.mock';
import { CartService } from './cart.service';

describe('CartService', () => {
  let cart: CartService;
  const lighthouse = BOOKS[0]; // $14.99, stock 24
  const cosmos = BOOKS.find((b) => b.slug === 'the-living-cosmos')!; // $24.00
  const outOfStock = BOOKS.find((b) => b.stock === 0)!;
  const lowStock = BOOKS.find((b) => b.slug === 'ashes-at-ridgemont')!; // stock 8

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    cart = TestBed.inject(CartService);
  });

  it('starts empty with no shipping charge', () => {
    expect(cart.count()).toBe(0);
    expect(cart.total()).toBe(0);
  });

  it('adds a book and accumulates quantity', () => {
    expect(cart.add(lighthouse)).toBe('added');
    cart.add(lighthouse, 2);
    expect(cart.count()).toBe(3);
    expect(cart.lines().length).toBe(1);
    expect(cart.subtotal()).toBe(44.97);
  });

  it('counts the total number of copies across different books', () => {
    cart.add(lighthouse, 2);
    cart.add(cosmos);
    expect(cart.count()).toBe(3);
    expect(cart.lines().length).toBe(2);
  });

  it('calculates subtotal, shipping and total', () => {
    cart.add(lighthouse); // 14.99 -> under the free-shipping threshold
    expect(cart.subtotal()).toBe(14.99);
    expect(cart.shipping()).toBe(4.99);
    expect(cart.total()).toBe(19.98);

    cart.add(cosmos); // 38.99 -> free shipping
    expect(cart.subtotal()).toBe(38.99);
    expect(cart.shipping()).toBe(0);
    expect(cart.total()).toBe(38.99);
  });

  it('gives each line its own total', () => {
    cart.add(cosmos, 2);
    expect(cart.lines()[0].lineTotal).toBe(48);
  });

  it('refuses out-of-stock books', () => {
    expect(cart.add(outOfStock)).toBe('out-of-stock');
    expect(cart.count()).toBe(0);
  });

  it('reports when the available quantity has been reached', () => {
    expect(cart.add(lowStock, 8)).toBe('added');
    expect(cart.add(lowStock)).toBe('limit-reached');
    expect(cart.quantityOf(lowStock.id)).toBe(8);
  });

  it('caps quantity at 10 per book', () => {
    cart.add(lighthouse, 50);
    expect(cart.count()).toBe(10);
    expect(cart.add(lighthouse)).toBe('limit-reached');
    expect(cart.lines()[0].maxQuantity).toBe(10);
  });

  it('increases and decreases quantity', () => {
    cart.add(lighthouse);
    cart.updateQuantity(lighthouse, 3);
    expect(cart.quantityOf(lighthouse.id)).toBe(3);
    cart.updateQuantity(lighthouse, 2);
    expect(cart.quantityOf(lighthouse.id)).toBe(2);
    expect(cart.subtotal()).toBe(29.98);
  });

  it('keeps at least one copy when quantity is lowered below 1 (use remove to delete)', () => {
    cart.add(lighthouse, 2);
    cart.updateQuantity(lighthouse, 0);
    expect(cart.quantityOf(lighthouse.id)).toBe(1);
  });

  it('ignores invalid quantities and books not in the cart', () => {
    cart.add(lighthouse, 2);
    cart.updateQuantity(lighthouse, NaN);
    expect(cart.quantityOf(lighthouse.id)).toBe(2);
    cart.updateQuantity(cosmos, 3);
    expect(cart.quantityOf(cosmos.id)).toBe(0);
  });

  it('removes a single line and updates totals', () => {
    cart.add(lighthouse);
    cart.add(cosmos);
    cart.remove(lighthouse.id);
    expect(cart.lines().map((l) => l.book.id)).toEqual([cosmos.id]);
    expect(cart.count()).toBe(1);
    expect(cart.subtotal()).toBe(24);
  });

  it('clears the cart', () => {
    cart.add(lighthouse);
    cart.add(cosmos);
    cart.clear();
    expect(cart.count()).toBe(0);
    expect(cart.total()).toBe(0);
  });

  it('persists to storage and restores in a new instance', () => {
    cart.add(lighthouse, 2);
    TestBed.tick();
    expect(JSON.parse(localStorage.getItem('booknest.cart')!)).toEqual([
      { bookId: lighthouse.id, quantity: 2 },
    ]);

    TestBed.resetTestingModule();
    const restored = TestBed.inject(CartService);
    expect(restored.quantityOf(lighthouse.id)).toBe(2);
  });

  it('discards corrupt stored data', () => {
    localStorage.setItem(
      'booknest.cart',
      JSON.stringify([{ bookId: 5, quantity: 1 }, { bookId: 'b1', quantity: -3 }, null, 'x']),
    );
    TestBed.resetTestingModule();
    expect(TestBed.inject(CartService).count()).toBe(0);
  });

  describe('add() with invalid quantities', () => {
    it.each([NaN, Infinity, 0, -2, 1.5])('ignores quantity %s and keeps the existing line', (qty) => {
      cart.add(lighthouse, 2);
      cart.add(lighthouse, qty);
      expect(cart.quantityOf(lighthouse.id)).toBe(2);
    });

    it('does not create a line for an invalid quantity', () => {
      cart.add(lighthouse, NaN);
      expect(cart.lines().length).toBe(0);
    });
  });

  describe('restoring from storage', () => {
    function restoreWith(items: unknown): CartService {
      localStorage.setItem('booknest.cart', JSON.stringify(items));
      TestBed.resetTestingModule();
      return TestBed.inject(CartService);
    }

    it('merges duplicate entries for the same book into one line', () => {
      const restored = restoreWith([
        { bookId: lighthouse.id, quantity: 2 },
        { bookId: lighthouse.id, quantity: 3 },
      ]);
      expect(restored.lines().length).toBe(1);
      expect(restored.quantityOf(lighthouse.id)).toBe(5);
      expect(restored.count()).toBe(5);
    });

    it('clamps a stored quantity to the current stock', () => {
      const restored = restoreWith([{ bookId: lowStock.id, quantity: 10 }]);
      expect(restored.quantityOf(lowStock.id)).toBe(lowStock.stock);
      expect(restored.lines()[0].quantity).toBeLessThanOrEqual(restored.lines()[0].maxQuantity);
    });

    it('drops books that are no longer in the catalogue or out of stock', () => {
      const restored = restoreWith([
        { bookId: 'does-not-exist', quantity: 1 },
        { bookId: outOfStock.id, quantity: 1 },
        { bookId: cosmos.id, quantity: 1 },
      ]);
      expect(restored.lines().map((l) => l.book.id)).toEqual([cosmos.id]);
    });
  });
});
