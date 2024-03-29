import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoaderService } from '../loader.service';
import { MessageService } from '../message.service';
import { SpotifyAuthService } from '../../spotify/spotify-auth.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css',
})
export class IntroComponent {
  message = inject(MessageService);
  spotifyAuth = inject(SpotifyAuthService);
  loaderInfo = inject(LoaderService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  messageState: boolean = false;
  messageText: string | undefined;
  title: string = `Welcome to the Music Web Application`;
  visit: any;

  ngOnInit() {
    this.visit = localStorage.getItem('visited');
    this.message.infoState.subscribe((state) => {
      this.messageState = state;
    });
    this.message.messageState.subscribe((message) => {
      this.messageText = message;
    });
  }
  getToken() {
    this.token();
    this.message.agree();
    this.loaderInfo.hide();
    localStorage.setItem('visited', 'true');
  }

  token() {
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
