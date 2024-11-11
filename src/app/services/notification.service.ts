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

  addNotification(notification: any) {
    const updatedNotifications = [ notification].concat(this.notifications$.value);
    this.notifications$.next(updatedNotifications);
  }
  constructor() { }
}
