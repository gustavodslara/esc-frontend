import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditarCursoModalComponent } from '../editar-curso-modal/editar-curso-modal.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [    FormsModule,
    RouterOutlet,
    CommonModule,
    EditarCursoModalComponent,
    RouterOutlet,
    RouterModule,
    RouterLink,
    RouterLinkActive,],
  templateUrl: 'notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss']
})
export class NotificacoesComponent {
  tiposNotificacoes = ['OS', 'TR', 'MR', 'RF']; // Deve ser um array, não um objeto

  selectedNotificacao:any = this.tiposNotificacoes ;

  notificacoesCursos:any[] = [
  ];
  messages = [""];

  constructor(private websocketService: WebsocketService) {
    var ws = this.websocketService.socketConnector();   
 ws.subscribe(
   (msg: any) => {
     let m = msg.message;
     console.log(m);

    let {id,name,etc} = this.parseOsString(m);

     this.messages.push(m)
     this.addNotificacao(id.toString(),name,etc);
   }, 
   (err: any) => console.log(err), 
   () => console.log('complete') 
 );
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

  addNotificacao(osN?: string, nomeCurso?:string,tipo?:string) {
    this.notificacoesCursos.push({ osN: osN, nomeCurso: nomeCurso != undefined ? nomeCurso : "", tipo: tipo });
  }

  deleteNotificacao(notificacao: { osN: null; nomeCurso: string; tipo: string; }) {
    const index = this.notificacoesCursos.indexOf(notificacao);
    if (index > -1) {
      this.notificacoesCursos.splice(index, 1);
    }
  }

  clearNotificacoes() {
    this.notificacoesCursos = [];
  }

}