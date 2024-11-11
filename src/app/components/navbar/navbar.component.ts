import { Component, ElementRef, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { WebsocketService } from '../../services/websocket.service';
import { delay, map, Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  dataList: any;
  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
    location.reload();
    delay(111);
    location.reload();
  }
  isLoggedIn: boolean = false;
  showToast() {
    const toastEl = this.el.nativeElement.querySelector('.toast');
    toastEl.classList.add('show');
    this.notification.playNotificationSound();
    setTimeout(() => {
      this.hideToast();
    }, 2500);
  }

  parseOsString(inputString: string): { id: number; name: string; etc: string } {
    const parts = inputString.split(",");
    const id = parseInt(parts[1].split(":")[1].trim(), 10);
   console.log("tessss");
   console.log(id);
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
    private el: ElementRef,
    private notification: NotificationService
  ) {
    var ws = this.websocketService.socketConnector();
    ws.subscribe(
      (msg: any) => {
      console.log("AAAAAAAAA");
      console.log(msg);
      let m = msg.message;
      this.messages.push(m);
      this.notification.notifications$.next(this.messages);let m2 = msg;

        let { id, name, etc } = this.parseOsString(m);

        m = "Nome:" + name;

        console.log(m);
       
        this.currentMsg = m;
      
        this.showToast();
      },
      (err: any) => console.log(err),
      () => console.log('complete')
    );

  
  }
  private notificationsSubscription!: Subscription; 

  messages: string[] = [];
  private subscription!: Subscription;
  currentMsg = "";
  ngOnDestroy() {
    if (this.notificationsSubscription) {
      this.notificationsSubscription.unsubscribe();
    }
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
  async ngOnInit() {
    // Check for login status in cookies
    const isLoggedIn = this.cookieService.get('isLoggedIn') === 'true';
    this.isLoggedIn = isLoggedIn;

    const isLoggedUserC = this.cookieService.get('loggedUser');

    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      console.log("navbaar");
      console.log(isLoggedIn);
    });
    this.authService.isLoggedUser$.subscribe((isLoggedUser) => {
      this.isLoggedUser = isLoggedUser;
      console.log(isLoggedUser);
    });
  }
}