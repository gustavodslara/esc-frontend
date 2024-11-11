import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { EditarCursoModalComponent } from './pages/editar-curso-modal/editar-curso-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AppLoginComponent } from './pages/app-login/app-login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule, EditarCursoModalComponent, NavbarComponent,AppLoginComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private http: HttpClient, private router: Router) {}

  async ngOnInit() {
  }
    
}

