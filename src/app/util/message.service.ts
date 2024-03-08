import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private infoSubject = new Subject<boolean>();
  infoState = this.infoSubject.asObservable();

  private messageSubject = new Subject<string>();
  messageState = this.messageSubject.asObservable();

  private acceptSubject = new Subject<boolean>();
  acceptState = this.acceptSubject.asObservable();

  info() {
    this.infoSubject.next(true);
  }

  agree() {
    this.infoSubject.next(false);
  }

  message(message: string) {
    this.messageSubject.next(message);
  }
}
