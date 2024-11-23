import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../components/app-login-config/profile.service'; // Corrigida a importação
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-config',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './app-login-config.component.html',
  styleUrls: ['./app-login-config.component.scss']
})
export class AppLoginConfigComponent implements OnInit {
  isLoggedUser: string = '';
  profilePicUrl: any = 'profile-picture.jpg';


  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router, private route: ActivatedRoute) { }
  mudeSenha = false;
  async ngOnInit() {
    this.authService.isLoggedUser$.subscribe(user => {
      this.isLoggedUser = user;

    });

    this.user = await this.authService.getUser(this.isLoggedUser);


    this.route.queryParamMap.subscribe(queryParams => {
      const senha = queryParams.get('senha');
      this.mudeSenha = (senha === 'true');
    });
  }

  async salvar() {
    await this.authService.save(this.user);
    this.salvo = true;
    this.mudeSenha = false;
    window.location.reload();
  }

  salvo = false;

  user: any = {
    id: "",
    password: "",
    login: "",
    img: "", isCoordenador: false,
    isEstagiario: false
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.user.img
            = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }


  goToConfig() {
    this.router.navigateByUrl('app-login-config/');
  }
}
