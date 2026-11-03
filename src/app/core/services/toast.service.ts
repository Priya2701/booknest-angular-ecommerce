import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'info' | 'error';

export interface Toast {
  readonly id: number;
  readonly message: string;
  readonly kind: ToastKind;
}

const DISPLAY_MS = 3500;

/** Shows short, auto-dismissing status messages (rendered by the Toasts component). */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();

  private readonly _toasts = signal<readonly Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, kind: ToastKind = 'success'): void {
    const toast: Toast = { id: this.nextId++, message, kind };
    // Keep at most three on screen.
    this._toasts.update((list) => [...list.slice(-2), toast]);
    this.timers.set(toast.id, setTimeout(() => this.dismiss(toast.id), DISPLAY_MS));
  }

  dismiss(id: number): void {
    clearTimeout(this.timers.get(id));
    this.timers.delete(id);
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
