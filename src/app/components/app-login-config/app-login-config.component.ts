import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../components/app-login-config/profile.service'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-config',
  standalone: true,
  templateUrl: './app-login-config.component.html',
  styleUrls: ['./app-login-config.component.scss']
})
export class AppLoginConfigComponent implements OnInit {
  isLoggedUser: string = '';
  profilePicUrl: any = 'profile-picture.jpg';
  

  constructor(private authService: AuthService, private profileService: ProfileService, private router: Router) {}

  ngOnInit() {
    this.authService.isLoggedUser$.subscribe(user => {
      this.isLoggedUser = user;
      
    });
  }

  onProfilePicChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.profileService.uploadProfilePic(file).subscribe({
        next: (response) => {
          this.profilePicUrl = response.filePath;
          console.log('Upload bem-sucedido:', response);
        },
        error: (err) => {
          console.error('Erro ao fazer upload:', err);
        }
      });
    }
  }


  goToConfig() {
    this.router.navigateByUrl('app-login-config/');
  }
}
