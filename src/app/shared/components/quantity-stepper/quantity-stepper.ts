import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Accessible − / + control. Emits the requested new value; the parent owns the state. */
@Component({
  selector: 'app-quantity-stepper',
  templateUrl: './quantity-stepper.html',
  styleUrl: './quantity-stepper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityStepper {
  readonly value = input.required<number>();
  readonly min = input(1);
  readonly max = input(10);
  /** Used in accessible names, e.g. the book title. */
  readonly label = input('item');
  readonly valueChange = output<number>();
}
