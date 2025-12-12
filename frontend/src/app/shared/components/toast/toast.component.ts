import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CartStore } from '../../../core/stores/cart.store';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, 20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translate(-50%, 0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translate(-50%, 20px)' })),
      ]),
    ]),
  ],
})
export class ToastComponent {
  store = inject(CartStore);

  close() {
    this.store.showToast('');
  }
}
