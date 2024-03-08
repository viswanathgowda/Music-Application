import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionValidatorService {
  /**
   *
   * @returns
   * expiresIn > currentTime - allow other than token API
   * expiresIn < currentTime or expireTime not existed  - current API needs to cancel and token API should call then current api needs to call again
   */

  isSessionValid() {
    let expiresIn: number = Number(localStorage.getItem('expires_in')) || 0;
    let currentTimeStamp = new Date().getTime();
    if (expiresIn && expiresIn > currentTimeStamp) {
      return true;
    }
    return false;
  }
}
