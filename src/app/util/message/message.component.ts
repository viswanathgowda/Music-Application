import { Component, inject } from '@angular/core';
import { MessageService } from '../message.service';
import { SpotifyAuthService } from '../../spotify/spotify-auth.service';
import { LoaderService } from '../loader.service';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  message = inject(MessageService);
  spotifyAuth = inject(SpotifyAuthService);
  loaderInfo = inject(LoaderService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  messageState: boolean = false;
  messageText: string | undefined;
  title: string = `Welcome to the Music Web Application`;

  ngOnInit() {
    this.message.infoState.subscribe((state) => {
      this.messageState = state;
    });
    this.message.messageState.subscribe((message) => {
      this.messageText = message;
    });
  }
  getToken() {
    this.spotifyAuth.getToken().subscribe(
      (token) => {
        localStorage.setItem('access_token', token.access_token);
        const expiresIn = new Date().getTime() + token.expires_in * 1000;
        localStorage.setItem('expires_in', String(expiresIn));
      },
      (error) => {
        this.openSnackBar(`Error fetching access token: ${error}`);
      }
    );
    this.message.agree();
    this.loaderInfo.hide();
  }
  openSnackBar(message: string) {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 5 * 1000,
      data: message,
    });
  }
}
