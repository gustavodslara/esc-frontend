import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from './enviroment'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get(arg0: string) {
    throw new Error('Method not implemented.');
  }
  modalCred: boolean = false;
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private isLoggedInSubject = new BehaviorSubject<boolean>(true);
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  private isLoggedUserSubject = new BehaviorSubject<string>('');
  isLoggedUser$: Observable<string> = this.isLoggedUserSubject.asObservable();

  apiUrl = environment.jsonServerUrl;

  async login(credentials: any): Promise<void> {
    try {
      const usersResponse = await this.http
        .get<any[]>(`${this.apiUrl}users?login=${credentials.login}`)
        .toPromise();

      if (usersResponse) {
        const users: any[] = usersResponse;
        const user = users.find(u => u.login === credentials.login);

        if (user && user.password === credentials.password) {
          this.isLoggedInSubject.next(true);
          this.isLoggedUserSubject.next(credentials.login);
          localStorage.setItem('isLoggedIn', 'true');
          this.cookieService.set('isLoggedIn', 'true');
          this.cookieService.set('loggedUser', credentials.login);
          localStorage.setItem('loggedUser', credentials.login);
        } else {
          console.error('Invalid credentials');
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedUser');
  }

  init(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);

  }
}

export class ProfileService {
  private uploadUrl = 'http://localhost:3000/upload';

  constructor(private http: HttpClient) {}

  uploadProfilePic(file: File) {
    const formData = new FormData();
    formData.append('profile-pic', file);

    return this.http.post<{ filePath: string }>(this.uploadUrl, formData);
  }
}