import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastComponent } from '../util/toast/toast.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  snackBar = inject(MatSnackBar);
  http = inject(HttpClient);

  /**sensitive info - keeping here due to not mainting own DB */
  private clientId = 'efd83f035ae648a1a2372f5e57b3118e';
  private clientSecret = 'c3259734bde74186b0154bfcf7015984';
  private tokenEndpoint = 'https://accounts.spotify.com/api/token';

  getToken() {
    const authOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
      }),
    };

    const body = 'grant_type=client_credentials';

    this.http.post(this.tokenEndpoint, body, authOptions).subscribe(
      (response: any) => {
        localStorage.setItem('access_token', response.access_token);
        const expiresIn = new Date().getTime() + response.expires_in * 1000;
        localStorage.setItem('expires_in', String(expiresIn));
      },
      (error) => {
        this.openSnackBar(`Error fetching access token: ${error}`);
      }
    );
  }

  openSnackBar(message: string) {
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 5 * 1000,
      data: message,
    });
  }
}
