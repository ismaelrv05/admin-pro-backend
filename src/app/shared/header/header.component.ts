import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public showPortada = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe(evt => {
        this.showPortada = !evt.urlAfterRedirects.includes('/inmueble/');
      });
  }
}
