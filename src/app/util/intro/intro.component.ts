import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoaderService } from '../loader.service';
import { MessageService } from '../message.service';
import { SpotifyAuthService } from '../../spotify/spotify-auth.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css',
})
export class IntroComponent {
  message = inject(MessageService);
  spotifyAuth = inject(SpotifyAuthService);
  loaderInfo = inject(LoaderService);
  router = inject(Router);

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
    this.spotifyAuth.getToken();
    this.message.agree();
    this.loaderInfo.hide();
    localStorage.setItem('visited', 'true');
  }
}
