import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftMenu } from "./shared/components/left-menu/left-menu";
import { NavBar } from "./shared/components/nav-bar/nav-bar";
import { Spinner } from './shared/components/spinner/spinner';
import { LoadingService } from './shared/service/loading';
import { ImportModule } from './shared/importModule';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LeftMenu, NavBar, Spinner, ImportModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  public loading: boolean = false;

  constructor(
    public loadingService: LoadingService
  ) {}

  ngOnInit() {}
}
