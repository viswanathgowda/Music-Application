import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Subject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { MessageService } from '../util/message.service';
import { SessionValidatorService } from './session-validator.service';

export const apiValidatorInterceptor: HttpInterceptorFn = (req, next) => {
  const message = inject(MessageService);
  const isSessionValid = inject(SessionValidatorService);
  const cancelRequest$ = new Subject<void>();

  if (isSessionValid.isSessionValid()) {
    return next(req);
  } else {
    return next(req).pipe(
      tap(() => {
        if (!isSessionValid.isSessionValid()) {
          const isTokenApi = req.url.includes('/token');
          if (!isTokenApi) {
            cancelRequest$.next();
            message.info();
            message.message(`Your session is expired. Please retry.`);
          }
        }
      }),
      takeUntil(cancelRequest$),
      catchError((status: HttpErrorResponse) => {
        if (status.status === 401) {
          message.info();
          message.message(status.error?.message || status.statusText);
          return next(req);
        }
        const error = status.error?.message || status.statusText;
        return throwError(error);
      })
    );
  }
};
