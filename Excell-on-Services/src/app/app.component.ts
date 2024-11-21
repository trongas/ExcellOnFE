import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Excell-on';
  
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    // Subscribe to router events
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }

  isAdminPage(): boolean {
    return this.activatedRoute.snapshot.firstChild?.routeConfig?.path === 'admin';
  }

  isLoginPage(): boolean {    
    return this.activatedRoute.snapshot.firstChild?.routeConfig?.path === 'auth';
  }
  is404Page(): boolean {
    return this.router.url.includes('/error');
  }
  
}
