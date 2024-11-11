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

  public static isCoordenador = false;
  public static isEstagiario = false;
  isLoggedIn: boolean = false;
  isLoggedUser: string = '';
  constructor(private authService: AuthService, private route: Router) {}
  modalCred = false;
  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      // Check if the form is valid
      const credentials = loginForm.value; // Get the form values
      this.authService
        .login(credentials)
        .then(async () => {
          let user = await this.authService.getUser(credentials.login);
          console.log(user);
          AppLoginComponent.isCoordenador = user.isCoordenador;
          AppLoginComponent.isEstagiario = user.isEstagiario;
          // Login successful, navigate to the protected route
          if(user.password != "SenhaDefault"){this.route.navigate(['/']);
      } else{
        this.route.navigate(['/loginconfig'], { queryParams: { senha: true} });
      }  })
        .catch((error) => {
          // Handle login error (e.g., show an error message)
          this.modalCred = true;
          console.error('Login error:', error);
          return;
        });
    } else {
      this.modalCred = true;
      return;
    }
  }


  ngOnInit() {
    this.authService.erroLogin$.subscribe((erroLogin:boolean) => {
      this.modalCred = erroLogin;
    });

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
