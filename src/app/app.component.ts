import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoaderComponent } from './util/loader/loader.component';
import { IntroComponent } from './util/intro/intro.component';
import { AudiolistStatusComponent } from './util/audiolist-status/audiolist-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    RouterOutlet,
    LoaderComponent,
    IntroComponent,
    AudiolistStatusComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Music Application';

  constructor() {}

  ngOnInit() {
    const visit = localStorage.getItem('visited');
    if (visit === 'false' || visit === null) {
      localStorage.setItem('visited', 'false');
      sessionStorage.removeItem('query');
    }
  }
}
