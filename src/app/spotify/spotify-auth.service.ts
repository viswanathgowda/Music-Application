import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  http = inject(HttpClient);

  /**sensitive info - keeping here due to not mainting own DB */
  private clientId = 'efd83f035ae648a1a2372f5e57b3118e';
  private clientSecret = 'c3259734bde74186b0154bfcf7015984';
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';

  getToken(): Observable<any> {
    const authOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
      }),
    };

    const body = 'grant_type=client_credentials';

    return this.http.post(this.tokenEndpoint, body, authOptions);
  }
}
