import { NotificationService } from './../../services/notification.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditarCursoModalComponent } from '../editar-curso-modal/editar-curso-modal.component';
import { WebsocketService } from '../../services/websocket.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { format } from 'date-fns'; // Import date-fns for date formatting

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [FormsModule,
    RouterOutlet,
    CommonModule,
    EditarCursoModalComponent,
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    NavbarComponent],
  templateUrl: 'notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss']
})
export class NotificacoesComponent {
  tiposNotificacoes = ['OS', 'TR', 'MR', 'RF']; // Deve ser um array, não um objeto

  selectedNotificacao: any = this.tiposNotificacoes;

  notificacoesCursos: any[] = [
  ];
  messages = [""];

  constructor(private websocketService: WebsocketService, private notification: NotificationService) {
    var ws = this.websocketService.socketConnector();


    this.notification.getNotifications().subscribe(notifications => {
      console.log("IMPORRA")
      console.log(notifications)
      this.notificacoesCursos = [];
      notifications.forEach((element: string) => {
      let { id, name, etc } = this.parseOsString(element);
      const currentDate = new Date();

      // Format the date in Brazilian format
      const formattedDate = format(currentDate, 'dd/MM/yy HH:mm');

      this.addNotificacao(id.toString(), name, etc, formattedDate);
    });
    this.notificacoesCursos.reverse();

    });


    ws.subscribe(
      (msg: any) => {
        let m = msg.message;
        let m2 = msg.message;
        console.log(m);

        let { id, name, etc } = this.parseOsString(m);

        this.messages.push(m)
        this.addNotificacao(id.toString(), name, etc)
        this.notification.playNotificationSound();
      },
      (err: any) => console.log(err),
      () => console.log('complete')
    );


  }

  substituirNotifi(n: any) {
    this.notificacoesCursos = [];
    n.forEach((element: string) => {
      let { id, name, etc } = this.parseOsString(element);
      const currentDate = new Date();

      // Format the date in Brazilian format
      const formattedDate = format(currentDate, 'dd/MM/yy HH:mm');

      this.addNotificacao(id.toString(), name, etc, formattedDate);
    });
    this.notificacoesCursos.reverse();

  }

  ngOnInit() {

  }
  removeDuplicateNotifications(notifications: any[]): any[] {
    const uniqueNotifications = [];
    const seenNotifications = new Set();

    for (const notification of notifications) {
      // Assuming each notification has a unique 'id' property
      if (!seenNotifications.has(notification.id)) {
        seenNotifications.add(notification.id);
        uniqueNotifications.push(notification);
      }
    }

    return uniqueNotifications;
  }

  parseOsString(inputString: string): { id: string; name: string; etc: string } {
    try {
      if (inputString) {
        const parts = inputString.split(",");
        const id = parts[1].split(":")[1].trim(); // No need for parseInt here
        const name = parts[2].trim();
        const etc = parts[3].split(":")[1].trim();

        return { id, name, etc };
      } else {
        console.error("inputString is undefined");
        return { id: '', name: '', etc: '' };
      }
    } catch (error) {
      console.error("Error parsing inputString:", error);
      return { id: '', name: '', etc: '' };
    }
  }

  addNotificacao(osN?: string, nomeCurso?: string, tipo?: string, date?: string) {
    this.notificacoesCursos.push({
      osN: osN, nomeCurso: nomeCurso, tipo: tipo,
      date: date
    });
  }

  deleteNotificacao(notificacao: { osN: null; nomeCurso: string; tipo: string; }) {
   this.notification.deleteNotification(notificacao);
  }

  clearNotificacoes() {
    this.notificacoesCursos = [];
    this.notification.clearNot();
  }
}