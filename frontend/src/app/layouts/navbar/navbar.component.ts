import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserInfoStore } from '../../core/stores/user-info.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  store = inject(UserInfoStore);
  
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.store.logout();
    this.isDropdownOpen = false;
  }
}