
import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyRates } from '../../models/exchange-rates';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  rates: CurrencyRates = {};

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // Підписка на поточні курси валют
    this.currencyService.rates$.subscribe(
      (data: { [key: string]: number }) => {
        this.rates = data;
      },
      (error: unknown) => {
        console.error('Error fetching rates:', error);
      }
    );
  }
}

