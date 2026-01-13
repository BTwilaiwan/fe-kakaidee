import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-left-menu',
  imports: [ MenuModule ],
  templateUrl: './left-menu.html',
  styleUrl: './left-menu.scss',
})
export class LeftMenu {

  public menus: any[] = []

  ngOnInit() {
    this.menus = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/taskList'
      },
      {
        label: 'Transition Log',
        icon: 'fa-solid fa-clock-rotate-left',
        routerLink: '/taskList'
      }
    ];
  }
}
