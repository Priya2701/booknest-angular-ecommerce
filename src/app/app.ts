import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './core/layout/footer/footer';
import { Header } from './core/layout/header/header';
import { Toasts } from './core/layout/toasts/toasts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
