import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from './enviroment';


@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;   
 
  private baseUrl = environment.wsUrl; // Base WebSocket URL
  private topicUrl = '/topic/os-updates'; // Topic URL for receiving messages
  private sendUrl = '/app/nova-os';     // URL for sending messages


  constructor() {
    this.socket$ = webSocket(this.baseUrl); 
  }

  connectSocket(): void { 
    
    this.socket$.subscribe(
      (msg: string) => console.log('message received: ' + JSON.stringify(msg)), 
      (err: any) => console.log(err), 
      () => console.log('complete') 
    );
  }

  socketConnector(){
    return this.socket$;
  }

  sendMessage(message: string) {
    this.socket$.next({ message, destination: this.sendUrl }); 
  }

  disconnectSocket() {
    this.socket$.complete(); 
  }
}
