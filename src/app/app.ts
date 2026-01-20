import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftMenu } from "./shared/components/left-menu/left-menu";
import { NavBar } from "./shared/components/nav-bar/nav-bar";
import { Spinner } from './shared/components/spinner/spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LeftMenu, NavBar, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fe-kakaidee');
  cities!: any[];

  selectedCities!: any[];

  ngOnInit() {}
}
