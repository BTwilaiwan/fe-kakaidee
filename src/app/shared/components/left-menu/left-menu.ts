import { Component, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-left-menu',
  standalone: true,
  imports: [ MenuModule, RouterModule ],
  templateUrl: './left-menu.html',
  styleUrl: './left-menu.scss',
})
export class LeftMenu {

@ViewChild('menuWrapper') menuWrapper!: ElementRef;

  public menus: any[] = [
    {
      label: 'Product',
      icon: 'pi pi-box',
      routerLink: ['/product'],
      routerLinkActiveOptions: { exact: true }
    },
    {
      label: 'Transition Log',
      icon: 'fa-solid fa-clock-rotate-left',
      routerLink: ['/transaction'],
    }
  ]

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
    .subscribe((e: NavigationEnd) => {
      this.focusMenuByRoute(e.urlAfterRedirects);
    });
  }


  focusMenuByRoute(url: string) {
    const links = this.menuWrapper.nativeElement.querySelectorAll('.p-menu-item') as NodeListOf<HTMLElement>;

    links.forEach(l => l.classList.remove('p-focus'));

    this.menus.forEach(menu => {
      const route = menu.routerLink?.[0];

      if (route && url.startsWith(route)) {
        links.forEach(link => {
          if (link.ariaLabel === menu.label) {
            link.classList.add('p-focus');
            link.focus();
          }
        });
      }
    });
  }
 
}
