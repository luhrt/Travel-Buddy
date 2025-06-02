import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}

function loginRedirect() {
  window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path == '/login') {
      const loginLink = document.querySelector('#login-button a');

      if (loginLink) {
        loginLink.setAttribute('href', '#login');
      }
    }
  });
}

loginRedirect();