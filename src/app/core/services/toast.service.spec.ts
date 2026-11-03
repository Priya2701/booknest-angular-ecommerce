import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
  let toast: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    toast = TestBed.inject(ToastService);
  });

  afterEach(() => vi.useRealTimers());

  it('shows a message and removes it automatically', () => {
    toast.show('Hello');
    expect(toast.toasts().map((t) => t.message)).toEqual(['Hello']);
    vi.advanceTimersByTime(4000);
    expect(toast.toasts()).toEqual([]);
  });

  it('dismisses a message on demand', () => {
    toast.show('A');
    toast.show('B');
    toast.dismiss(toast.toasts()[0].id);
    expect(toast.toasts().map((t) => t.message)).toEqual(['B']);
  });

  it('keeps at most three messages', () => {
    ['1', '2', '3', '4'].forEach((m) => toast.show(m));
    expect(toast.toasts().map((t) => t.message)).toEqual(['2', '3', '4']);
  });
});
