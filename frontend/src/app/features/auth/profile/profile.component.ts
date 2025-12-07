import { Component, inject, OnInit } from '@angular/core';
import { UserInfoStore } from '../../../core/stores/user-info.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  store = inject(UserInfoStore);
  router = inject(Router);

  ngOnInit(): void {
    this.store.loadProfile();
  }

  onLogout() {
    this.store.logout();
  }
}
