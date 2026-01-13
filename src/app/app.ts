import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MultiSelectModule, MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LeftMenu } from "./shared/components/left-menu/left-menu";
import { NavBar } from "./shared/components/nav-bar/nav-bar";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MultiSelect, FormsModule, ButtonModule, LeftMenu, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('fe-kakaidee');
  cities!: any[];

  selectedCities!: any[];

  ngOnInit() {
    this.cities = [
            {name: 'New York', code: 'NY'},
            {name: 'Rome', code: 'RM'},
            {name: 'London', code: 'LDN'},
            {name: 'Istanbul', code: 'IST'},
            {name: 'Paris', code: 'PRS'}
        ];

  }
}
