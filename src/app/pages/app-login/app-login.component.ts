import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import {
  RouterOutlet,
  RouterModule,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { EditarCursoModalComponent } from '../editar-curso-modal/editar-curso-modal.component';
import { AppComponent } from '../../app.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet,
    CommonModule,
    EditarCursoModalComponent,
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    AppComponent,
  ],
  templateUrl: './app-login.component.html',
  styleUrl: './app-login.component.scss',
})
export class AppLoginComponent {
  isLoggedIn: boolean = false;
  isLoggedUser: string = '';
  modalCred: boolean = false;
  constructor(private authService: AuthService, private route: Router) {}

  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      // Check if the form is valid
      const credentials = loginForm.value; // Get the form values
      this.authService
        .login(credentials)
        .then(() => {
          // Login successful, navigate to the protected route
          this.route.navigate(['/home']);
        })
        .catch((error) => {
          // Handle login error (e.g., show an error message)
          this.modalCred = true;
          console.error('Login error:', error);
        });
    }
  }

  ativaErroLogin() {
    this.modalCred = true;
  }

  ngOnInit() {
    this.authService.isLoggedUser$.subscribe((isLoggedIn) => {
      this.isLoggedUser = isLoggedIn;
    });
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.route.navigateByUrl('/');
      }
    });
  }
}
