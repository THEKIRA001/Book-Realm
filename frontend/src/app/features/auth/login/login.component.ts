import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserInfoStore } from '../../../core/stores/user-info.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  store = inject(UserInfoStore); 
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };
      
      this.store.login(credentials); 
    }
  }
}