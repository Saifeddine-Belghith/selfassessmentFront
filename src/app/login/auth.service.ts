import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  logout() {
    // Clear user-related data
    localStorage.removeItem('idEmployee');
    localStorage.removeItem('id');

    // Redirect to the login page
    this.router.navigateByUrl('/login');
  }
}
