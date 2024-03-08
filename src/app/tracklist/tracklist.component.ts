import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { SpotifyWebserviceService } from '../spotify/spotify-webservice.service';
import { AudioService } from '../audio.service';
import { StreamState } from '../stream-state';

@Component({
  selector: 'app-tracklist',
  standalone: true,
  imports: [
    MatSliderModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FormsModule,
  ],
  templateUrl: './tracklist.component.html',
  styleUrl: './tracklist.component.css',
})
export class TracklistComponent {
  spotify = inject(SpotifyWebserviceService);
  audioService = inject(AudioService);
  route = inject(ActivatedRoute);

  state!: StreamState;

  files: Array<any> = [];
  currentFile: any = {};
  albumId: any;
  playlistAudioFileImg: any;
  selected: number | undefined;
  audioEvents: any;

  constructor() {
    this.audioService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('id');
    this.playlistAudioFileImg = localStorage.getItem('playlist-audioFile-img');
    this.getAlbum(this.albumId);
  }

  playStream(url: any) {
    this.audioService.playStream(url).subscribe((events) => {
      this.audioEvents = events;
    });
  }

  getAlbum(albumId: string) {
    this.spotify.getAlbum(albumId).subscribe((res) => {
      this.files = res.items;
      const fileLength = this.files.length;
      this.audioLoop(fileLength);
    });
  }

  async audioLoop(length: number) {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      this.selected = file.track_number;

      // Wrap the asynchronous operation in a Promise
      await new Promise<void>((resolve) => {
        // Subscribe to the playStream observable
        const subscription = this.audioService
          .playStream(file.preview_url)
          .subscribe((events: any) => {
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

  openFile(file: { preview_url: any }, index: any) {
    this.selected = index;
    this.currentFile = { index, file };
    this.audioService.stop();
    this.playStream(file.preview_url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
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
    return this.currentFile.index === 1;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change: any) {
    this.audioService.seekTo(change.value);
  }

  ngOnDestroy() {
    this.stop();
  }
}
