import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from './enviroment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, public cookieService: CookieService, private router: Router) { }
  private erroLoginSubject = new BehaviorSubject<boolean>(this.cookieService.get("erroLoginSubject") != null && this.cookieService.get("erroLoginSubject") != undefined && this.cookieService.get("erroLoginSubject") === "true");
  public erroLogin$: Observable<boolean> = this.erroLoginSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.cookieService.get("isLoggedIn") != null && this.cookieService.get("isLoggedIn") != undefined && this.cookieService.get("isLoggedIn") === "true");
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private loggedUserSubject = new BehaviorSubject<string>(this.cookieService.get('loggedUser'));
  isLoggedUser$: Observable<string> = this.loggedUserSubject.asObservable();

  apiUrl = environment.jsonServerUrl;

  async login(credentials: any): Promise<void> {
    try {
      const usersResponse = await this.http.get<any[]>(this.apiUrl + '/users?login=' + credentials.login).toPromise();

      if (usersResponse) {
        const users = usersResponse;
        const user = users.find(u => u.login === credentials.login);

        if (user && user.password === credentials.password) {
          this.isLoggedInSubject.next(true);
          this.loggedUserSubject.next(user.login);
          // Store login state persistently (choose localStorage or cookies)
          this.cookieService.set('isLoggedIn', 'true'); // Using cookies for this example
          this.cookieService.set('loggedUser', user.login);
        } else {
          console.error('Invalid credentials');
          this.erroLoginSubject.next(true);
          this.isLoggedInSubject.next(false);
          this.loggedUserSubject.next(user.login);
        }
      } else {
        console.error('No users found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async getUser(login: string): Promise<any> {
    try {
      const usersResponse = await this.http.get<any[]>(this.apiUrl + '/users?login=' + login).toPromise();

      if (usersResponse) {
        const users = usersResponse;
        const user = users.find(u => u.login === login);

        if (user) {
          return user;
        } else {
          return undefined;
        }
      } else {
        console.error('No users found');
        return undefined;

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return undefined;
    }
  }

  async save(user: any): Promise<void> {
    try {
      const usersResponse = await this.http.put<any[]>(this.apiUrl + '/users/' + user.id, user).toPromise();

      if (usersResponse) {

        if (usersResponse) {
        } else {
        }
      } else {
        console.error('No users found');

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }


  logout(): void {
    this.isLoggedInSubject.next(false);
    this.loggedUserSubject.next('');
    this.cookieService.delete('isLoggedIn');
    this.cookieService.delete('loggedUser');
    delay(100)

  }

  // Check login status on app initialization
  init(): void {
    const isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);
  }
}