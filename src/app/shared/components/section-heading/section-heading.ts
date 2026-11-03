import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-section-heading',
  imports: [RouterLink],
  templateUrl: './section-heading.html',
  styleUrl: './section-heading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly heading = input.required<string>();
  readonly subheading = input<string>();
  readonly linkLabel = input<string>();
  readonly link = input<string | readonly unknown[]>('/books');
}
