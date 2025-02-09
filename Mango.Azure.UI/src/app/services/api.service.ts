import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { protectedResources } from '../auth-config';
import { ResponseDto } from '../models/response.model'; // ✅ Import model

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private authService: MsalService) { }

  // ✅ Helper function to get the Bearer token
  private async getAuthHeaders(): Promise<HttpHeaders> {
    try {
      const accounts = this.authService.instance.getAllAccounts();
      if (accounts.length === 0) throw new Error("No active account found!");

      // Await the promise directly without calling toPromise()
      const tokenResponse = await this.authService.instance.acquireTokenSilent({
        account: accounts[0],
        scopes: protectedResources.api.scopes
      });

      if (!tokenResponse || !tokenResponse.accessToken) {
        throw new Error("Token acquisition failed");
      }

      return new HttpHeaders({
        Authorization: `Bearer ${tokenResponse.accessToken}`,
        'Content-Type': 'application/json'
      });
    } catch (error) {
      console.error("❌ Error fetching token:", error);
      throw error;
    }
  }

  // ✅ Generic GET request handling ResponseDto<T>
  get<T>(url: string): Observable<T | null> {
    return new Observable<T | null>(observer => {
      this.getAuthHeaders().then(headers => {
        this.http.get<ResponseDto<T>>(url, { headers }).pipe(
          map(response => this.handleResponse(response)),
          catchError(error => {
            this.handleError(error);
            observer.error(error);
            return throwError(() => error);
          })
        ).subscribe({
          next: (result) => {
            observer.next(result);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
      }).catch(error => {
        this.handleError(error);
        observer.error(error);
      });
    });
  }

  // ✅ Generic POST request handling ResponseDto<T>
  post<T>(url: string, body: any): Observable<T | null> {
    return new Observable<T | null>(observer => {
      this.getAuthHeaders().then(headers => {
        this.http.post<ResponseDto<T>>(url, body, { headers }).pipe(
          map(response => this.handleResponse(response)),
          catchError(error => {
            this.handleError(error);
            observer.error(error);
            return throwError(() => error);
          })
        ).subscribe({
          next: (result) => {
            observer.next(result);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
      }).catch(error => {
        this.handleError(error);
        observer.error(error);
      });
    });
  }

  // ✅ Generic PUT request handling ResponseDto<T>
  put<T>(url: string, body: any): Observable<T | null> {
    return new Observable<T | null>(observer => {
      this.getAuthHeaders().then(headers => {
        this.http.put<ResponseDto<T>>(url, body, { headers }).pipe(
          map(response => this.handleResponse(response)),
          catchError(error => {
            this.handleError(error);
            observer.error(error);
            return throwError(() => error);
          })
        ).subscribe({
          next: (result) => {
            observer.next(result);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
      }).catch(error => {
        this.handleError(error);
        observer.error(error);
      });
    });
  }

  // ✅ Generic DELETE request handling ResponseDto<T>
  delete<T>(url: string): Observable<T | null> {
    return new Observable<T | null>(observer => {
      this.getAuthHeaders().then(headers => {
        this.http.delete<ResponseDto<T>>(url, { headers }).pipe(
          map(response => this.handleResponse(response)),
          catchError(error => {
            this.handleError(error);
            observer.error(error);
            return throwError(() => error);
          })
        ).subscribe({
          next: (result) => {
            observer.next(result);
            observer.complete();
          },
          error: (err) => observer.error(err)
        });
      }).catch(error => {
        this.handleError(error);
        observer.error(error);
      });
    });
  }

  // ✅ Extracts `result` from ResponseDto<T> and handles failures
  private handleResponse<T>(response: ResponseDto<T>): T | null {
    if (!response.isSuccess) {
      console.warn(`⚠️ API returned failure: ${response.message}`);
      return null;
    }
    return response.result;
  }

  // ✅ Global error handler
  private handleError(error: any) {
    console.error("API Error:", error);
    return throwError(() => new Error(error.message || "Something went wrong"));
  }
}
