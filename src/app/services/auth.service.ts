import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {    
  private user = new BehaviorSubject<any>(null);

  constructor() { }
  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user)); // Store the user in localStorage
    this.user.next(user); // Update the BehaviorSubject
  }

  getUser() {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  clearUser() {
    localStorage.removeItem('user');
    this.user.next(null); // Set the BehaviorSubject to null
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user && user.id_rol === 1; // Check if user is admin
  }

  getUserObservable() {
    return this.user.asObservable(); // Return an observable for other components to subscribe to
  }
}