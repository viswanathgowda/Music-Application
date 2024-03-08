import { Routes } from '@angular/router';
import { TracklistComponent } from './tracklist/tracklist.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'tracks/:id', component: TracklistComponent },
  { path: '', component: HomeComponent },
];
