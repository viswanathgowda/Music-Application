import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyWebserviceService {
  http = inject(HttpClient);

  private baseUrl = 'https://api.spotify.com/v1';

  getQuery(query: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const authOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get(
      `${this.baseUrl}/search?q=${query}&type=album,artist,playlist,track,show,episode,audiobook`,
      authOptions
    );
  }

  getAlbum(albumId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const authOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get(
      `${this.baseUrl}/albums/${albumId}/tracks`,
      authOptions
    );
  }

  getNewReleases(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const authOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.get(`${this.baseUrl}/browse/new-releases`, authOptions);
  }
}
