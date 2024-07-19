import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject,  throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ExchangeRates, CurrencyRates } from '../models/exchange-rates';



@Injectable({
  providedIn: 'root'
})
export class CurrencyService implements OnDestroy {
  // BehaviorSubject для зберігання курсів валют
  private ratesSubject: BehaviorSubject<CurrencyRates> = new BehaviorSubject<CurrencyRates>({});
  // Observable для доступу до курсів валют з інших компонентів
  rates$: Observable<CurrencyRates> = this.ratesSubject.asObservable();
  // Змінна для зберігання ідентифікатора інтервалу оновлення
  private refreshIntervalId: number | null = null;

  constructor(private http: HttpClient) {
    this.fetchRates(); // Завантаження курсів валют при створенні сервісу
    this.startAutoRefresh(); // Початок автоматичного оновлення курсів
  }

  // Метод для отримання курсів валют з API
  getRates(): Observable<CurrencyRates> {
    return this.http.get<ExchangeRates>('https://api.exchangerate-api.com/v4/latest/UAH').pipe(
      map((data: ExchangeRates) => data.rates), // Мапування отриманих даних до формату курсів
      tap((rates: CurrencyRates) => {
        this.ratesSubject.next(rates); // Оновлення BehaviorSubject новими курсами
      }),
      catchError((error: unknown) => {
        // Обробка помилок
        if (error instanceof Error) {
          console.error('Error fetching rates:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
        return throwError(() => error);
      })
    );
  }

  // Метод для завантаження курсів валют і оновлення BehaviorSubject
  fetchRates(): void {
    this.getRates().subscribe();
  }

  // Метод для запуску автоматичного оновлення курсів з певним інтервалом
  startAutoRefresh(interval: number = 20000): void { // Інтервал за замовчуванням - 20 секунд
    this.refreshIntervalId = window.setInterval(() => this.fetchRates(), interval);
  }

  // Метод, що викликається при знищенні сервісу, для очищення інтервалу
  ngOnDestroy(): void {
    if (this.refreshIntervalId !== null) {
      clearInterval(this.refreshIntervalId); // Очищення інтервалу
    }
  }
}
