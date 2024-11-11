import { Component, ElementRef, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { WebsocketService } from '../../services/websocket.service';
import { map, Subscription } from 'rxjs';
import { ProfileService } from '../app-login-config/profile.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  dataList: any;
  profilePicUrl:any
  localStorage: any;
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isLoggedIn: boolean = false;
  showToast() {
    const toastEl = this.el.nativeElement.querySelector('.toast');
    toastEl.classList.add('show');

    setTimeout(() => {
      this.hideToast();
    }, 2500);
  }

  getId(str: string) {
    const segments = str.split('/');
    return segments[segments.length - 1];
  }
  
  goToConfig(idCurso:any) {
    let id = this.getId(idCurso);
    this.router.navigateByUrl('app-login-config/' + id);
  }


   parseOsString(inputString: string): { id: number; name: string; etc: string } {
    const parts = inputString.split(",");
    const id = parseInt(parts[1].split(":")[1].trim(), 10);
    const name = parts[2].trim(); 
    const etc = parts[3].split(":")[1].trim();
  
    return { id, name, etc };
  }

  hideToast() {
    const toastEl = this.el.nativeElement.querySelector('.toast');
    toastEl.classList.remove('show');
  }
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService,
    private websocketService: WebsocketService,
    private el: ElementRef
  ) {
 var ws = this.websocketService.socketConnector();   
 ws.subscribe(
   (msg: any) => {
     let m = msg.message;

     let { id, name, etc } = this.parseOsString(m);

      m = "Nome:"+name;

     console.log(m);
     this.messages.push(m)
     this.currentMsg = m;
     this.showToast();
   }, 
   (err: any) => console.log(err), 
   () => console.log('complete') 
 );
    }

    messages: string[] = [];
  private subscription!: Subscription;
currentMsg = "";
  ngOnDestroy() {
  
  }

  sendNewOsMessage(id: number) {
    const message = `Nova OS, id: ${id}`;
    this.websocketService.sendMessage(message);
  }

  nNotification: number = 0;
  nameNotification: any;
  currentUser: any;
  specificUserName: string | undefined;

  //NOMES DE USUÁRIO---------------------

  isLoggedUser = '';
  async ngOnInit(profilePicUrl:string) {
    this.cookieService.set('profilePicUrl', profilePicUrl);

    const profilePicUrll = this.cookieService.get('profilePicUrl');
    const isLoggedInC = this.cookieService.get('isLoggedIn') === 'true';
    const isLoggedUserC = this.cookieService.get('isLoggedUser');

    

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
    this.authService.isLoggedUser$.subscribe((isLoggedUser) => {
      this.isLoggedUser = isLoggedUser;
      var us = localStorage.getItem('loggedUser');
      this.specificUserName = us != undefined && us != null ? us : '';
      this.specificUserName =
        this.specificUserName != undefined &&
        this.specificUserName != null &&
        this.specificUserName != ''
          ? this.specificUserName
          : isLoggedUserC;
    });
  }
}
