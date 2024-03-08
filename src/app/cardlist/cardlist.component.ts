import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SpotifyWebserviceService } from '../spotify/spotify-webservice.service';
import { AudioService } from '../audio.service';

import { StreamState } from '../stream-state';

import { ToastComponent } from '../util/toast/toast.component';

@Component({
  selector: 'app-cardlist',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSliderModule,
    MatDividerModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: './cardlist.component.html',
  styleUrl: './cardlist.component.css',
})
export class CardlistComponent {
  @Input() audio: any;
  @Input() viewMore: any;

  spotify = inject(SpotifyWebserviceService);
  audioService = inject(AudioService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  private audioStreamSubscription!: Subscription;

  state!: StreamState;

  centered = false;
  disabled = false;
  unbounded = false;

  files: Array<any> = [];
  currentFile: any = {};
  playId: any = null;
  selected = { track_number: '', title: '', total: 0 };
  urlNotfound: boolean = false;

  constructor() {
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  playStream(url: any) {
    this.audioStreamSubscription = this.audioService
      .playStream(url)
      .subscribe((events) => {});
  }

  getTracks(albumId: string) {
    this.spotify.getAlbum(albumId).subscribe((res) => {
      this.files = res.items;
      this.audioLoop();
    });
  }

  async audioLoop() {
    this.selected.total = this.files.length;

    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      this.selected.track_number = file.track_number;
      this.selected.title = file.name;

      // Wrap the asynchronous operation in a Promise
      await new Promise<void>((resolve) => {
        // Subscribe to the playStream observable
        const subscription = this.audioService
          .playStream(file.preview_url)
          .subscribe((events: any) => {
            this.urlNotfound = ['error'].includes(events.type);
            this.urlNotfound ? this.openSnackBar('audio not found') : '';
            if (events.type === 'ended') {
              // When the 'ended' event occurs, resolve the Promise
              subscription.unsubscribe(); // Unsubscribe to avoid memory leaks
              resolve();
            }
          });
      });

      // Continue with the next iteration after the 'ended' event
    }
  }

  getAlbum(audioFile: any) {
    const url =
      audioFile.type === 'track'
        ? audioFile.album.images[0].url
        : audioFile.images.length > 0
        ? audioFile.images[0].url
        : '/src/assets/pexels-shelagh-murphy-1666816.jpg';
    localStorage.setItem('playlist-audioFile-img', url);
    ['album', 'playlist'].includes(audioFile.type)
      ? this.router.navigate(['/tracks', audioFile.id])
      : '';
  }

  openFile(file: { preview_url: any }, index: any) {
    this.currentFile = { index, file };
    this.audioService.stop();
    if (file.preview_url) {
      this.playStream(file.preview_url);
      this.urlNotfound = false;
    } else {
      this.audioService.stop();
      this.playStream(null);
      this.urlNotfound = true;
      this.urlNotfound ? this.openSnackBar('audio not found') : '';
    }
  }

  pause(albumId: string) {
    this.playId = albumId;
    this.audioService.pause();
  }

  play(audioFile: any) {
    const cFn = (albumId: any) => {
      if (albumId !== this.playId) {
        this.audioService.stop();
        this.playId = albumId;
      }
    };
    if (audioFile.type === 'album') {
      cFn(audioFile.id);
      this.getTracks(audioFile.id);
      this.audioService.play();
    } else if (audioFile.type === 'track') {
      cFn(audioFile.id);
      const file = audioFile;
      const index = audioFile.track_number;
      this.openFile(file, index);
      this.audioService.play();
    }
  }

  pausePlay(albumId: string) {
    this.audioService.play();
  }

  stop() {
    this.audioStreamSubscription.unsubscribe();
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 5 * 1000,
      data: message,
    });
  }
}
