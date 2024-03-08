import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { SpotifyWebserviceService } from '../spotify/spotify-webservice.service';
import { AudioService } from '../audio.service';
import { CardlistComponent } from '../cardlist/cardlist.component';
import { LoaderService } from '../util/loader.service';
import { MessageService } from '../util/message.service';
import { SessionValidatorService } from '../app-services/session-validator.service';

import { StreamState } from '../stream-state';

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

@Component({
  selector: 'app-home',
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
    CardlistComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  spotify = inject(SpotifyWebserviceService);
  audioService = inject(AudioService);
  router = inject(Router);
  loader = inject(LoaderService);
  message = inject(MessageService);
  isSessionValid = inject(SessionValidatorService);

  state!: StreamState;

  audio: HTMLAudioElement = new Audio();

  playId: any = null;
  query: any;
  currentFile: any = {};
  files: Array<any> = [];
  audioItems: any[] = [];
  viewmore: viewmore = { state: false, value: '' };
  newRelease: boolean = false;
  debounceTime: any;

  centered = false;
  disabled = false;
  unbounded = false;

  constructor() {
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  ngOnInit() {
    const visit = localStorage.getItem('visited');
    if (visit === 'false') {
      this.message.info();
      this.message
        .message(`This application runs on Spotify Developer APIs, allowing you to enjoy
        music for up to 29 seconds. Feel the rhythm and experience the joy of
        music!`);
    }
    const pollingInterval = setInterval(() => {
      const visit = localStorage.getItem('visited');
      if (visit === 'true') {
        this.query = sessionStorage.getItem('query');
        this.query ? this.searchQuery() : this.newReleases();
        clearInterval(pollingInterval);
      }
    }, 1000);
  }

  playStream(url: any) {
    this.audioService.playStream(url).subscribe((events) => {});
  }

  newReleases() {
    this.loader.show();
    this.spotify.getNewReleases().subscribe((res) => {
      this.audioItems = [];
      this.audioItems.push(res.albums);
      this.newRelease = true;
      this.loader.hide();
    });
  }

  searchQuery() {
    clearTimeout(this.debounceTime);
    this.debounceTime = setTimeout(this.getQuery, 1000);
    this.query === '' ? this.newReleases() : '';
    sessionStorage.setItem('query', this.query);
  }

  getQuery = () => {
    if (this.query) {
      this.loader.show();
      this.spotify.getQuery(this.query).subscribe((res) => {
        this.audioItems = [];
        this.audioItems.push(
          res.tracks,
          res.playlists,
          res.albums,
          res.artists,
          res.audiobooks,
          res.episodes,
          res.shows
        );
        this.newRelease = false;
        this.loader.hide();
      });
    }
  };

  getTracks(albumId: string) {
    this.loader.show();
    this.spotify.getAlbum(albumId).subscribe((res) => {
      this.files = res.items;
      const file = res.items[0];
      const index = res.items[0].track_number;
      this.openFile(file, index);
      this.loader.hide();
    });
  }

  getAlbum(albumId: string) {
    this.router.navigate(['/tracks', albumId]);
  }

  openFile(file: { preview_url: any }, index: any) {
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.preview_url);
  }

  pause(albumId: string) {
    this.playId = albumId;
    this.audioService.pause();
  }

  play(albumId: string) {
    if (albumId !== this.playId) {
      this.stop();
    }
    this.playId = albumId;
    this.getTracks(albumId);
    this.audioService.play();
  }

  stop() {
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

  viewMore(type: string) {
    this.viewmore = { state: !this.viewmore['state'], value: type };
  }
}

interface viewmore {
  state: boolean;
  value: string;
}
