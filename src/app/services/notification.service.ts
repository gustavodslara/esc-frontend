import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  sound = new Howl({
    src: ['sound.mp3']
  });
  playNotificationSound() {
    this.sound.play();
  }

  public notifications$ = new BehaviorSubject<any[]>([]);
  // Start with an empty array

  getNotifications() {
    return this.notifications$.asObservable();
  }

  getNotValue() {
    return this.notifications$.getValue();
  }

  addNotification(notification: any) {
    const updatedNotifications = [notification].concat(this.notifications$.value);
    this.notifications$.next(updatedNotifications);
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

  deleteNotification(notificacao: { osN: null; nomeCurso: string; tipo: string; }) {
    console.log("KKKAKAKA@22");
    console.log(this.notifications$.getValue().indexOf((e: string) => this.parseOsString(e).id == notificacao.osN));
    console.log(this.notifications$.getValue());
    console.log(this.parseOsString(this.notifications$.getValue()[0]));
    console.log("KKKAKAKA@22");
    console.log(this.parseOsString(this.notifications$.getValue()[0]).id == notificacao.osN);
    console.log(notificacao);
    console.log("Valor de notificacao.osN:", notificacao.osN);
    console.log("Tipo de notificacao.osN:", typeof notificacao.osN);
    this.notifications$.getValue().forEach((e: string, index: number) => {
      console.log(`Elemento ${index}:`, e);
      console.log(`parseOsString(e).id:`, this.parseOsString(e).id);
      console.log(`Comparação:`, this.parseOsString(e).id == notificacao.osN);
      console.log(`Comparação estrita:`, this.parseOsString(e).id === notificacao.osN);
    });
    this.notifications$.next(this.notifications$.getValue().filter((e: string) => this.parseOsString(e).id != notificacao.osN));
    console.log(this.notifications$.getValue().filter((e: string) => this.parseOsString(e).id != notificacao.osN));

  }

  clearNot() {
    this.notifications$.next([]);
  }

  constructor() { }
}
