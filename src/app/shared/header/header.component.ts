import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public isLoggedIn: boolean = false;
  public userName: string = '';

  constructor(private userService: UserService) {}

  logout(): void {
    this.userService.logout();
  }

}
