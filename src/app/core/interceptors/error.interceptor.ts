import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        const backendError = error.error?.error || error.error?.message || error.message;
        
        switch (error.status) {
          case 400:
            if (backendError.includes('User creation failed')) {
              errorMessage = 'Registration failed. Please check your details and try again.';
            } else if (backendError.includes('Empty short code')) {
              errorMessage = 'Invalid request. Please try again.';
            } else {
              errorMessage = backendError || 'Invalid request data';
            }
            break;
          case 401:
            errorMessage = 'Invalid email or password';
            break;
          case 403:
            if (backendError.includes('delete your own')) {
              errorMessage = 'You can only delete your own short URLs';
            } else {
              errorMessage = 'Access denied';
            }
            break;
          case 404:
            if (backendError.includes('User not found')) {
              errorMessage = 'User account not found';
            } else if (backendError.includes('Admin not found')) {
              errorMessage = 'Administrator not found';
            } else if (backendError.includes('Short URL not found')) {
              errorMessage = 'Short URL not found';
            } else if (backendError.includes('About information not found')) {
              errorMessage = 'About information not found';
            } else {
              errorMessage = 'Resource not found';
            }
            break;
          case 409:
            if (backendError.includes('already exists')) {
              errorMessage = 'This URL already exists in the system';
            } else {
              errorMessage = backendError || 'Conflict occurred';
            }
            break;
          case 500:
            if (backendError.includes('generate unique short code')) {
              errorMessage = 'Unable to generate a unique short code. Please try again later.';
            } else if (backendError.includes('Invalid short code length')) {
              errorMessage = 'System error: Invalid short code configuration';
            } else if (backendError.includes('already exists')) {
              errorMessage = 'This URL already exists in the system';
            } else {
              errorMessage = 'Internal server error. Please try again later.';
            }
            break;
          default:
            errorMessage = backendError || `Error ${error.status}: ${error.statusText}`;
        }
      }

      const skipSnackBar = error.status === 401 || 
                          request.url.includes('/auth/login') ||
                          request.url.includes('/auth/register');

      if (!skipSnackBar) {
        snackBar.open(errorMessage, 'Close', {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }

      return throwError(() => error);
    })
  );
}; 