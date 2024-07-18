
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subscription, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

interface ExchangeRates {
  rates: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService implements OnDestroy {
  private ratesSubject: BehaviorSubject<{ [key: string]: number }> = new BehaviorSubject<{ [key: string]: number }>({});
  rates$: Observable<{ [key: string]: number }> = this.ratesSubject.asObservable();
  private refreshIntervalId: number | null = null;

  constructor(private http: HttpClient) {
    this.fetchRates();
    this.startAutoRefresh();
  }

  getRates(): Observable<{ [key: string]: number }> {
    return this.http.get<ExchangeRates>('https://api.exchangerate-api.com/v4/latest/UAH').pipe(
      map((data: ExchangeRates) => data.rates),
      tap((rates: { [key: string]: number }) => {
        this.ratesSubject.next(rates);
      }),
      catchError((error: unknown) => {
        if (error instanceof Error) {
          console.error('Error fetching rates:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        return throwError(() => error);
      })
    );
  }

  fetchRates(): void {
    this.getRates().subscribe();
  }

  startAutoRefresh(interval: number = 20000): void {
    this.refreshIntervalId = window.setInterval(() => this.fetchRates(), interval);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId !== null) {
      clearInterval(this.refreshIntervalId);
    }
  }
}





