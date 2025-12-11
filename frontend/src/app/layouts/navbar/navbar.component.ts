import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserInfoStore } from '../../core/stores/user-info.store';
import { CartStore } from '../../core/stores/cart.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  store = inject(UserInfoStore);
  cartStore = inject(CartStore);
  private el = inject(ElementRef);
  
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.store.logout();
    this.isDropdownOpen = false;
  }

  cartCount() {
    try {
      const items = this.cartStore.cartItemsDetailed();
      return Array.isArray(items) ? items.length : 0;
    } catch {
      return 0;
    }
  }
}