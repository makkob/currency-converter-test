import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyRates } from '../../models/exchange-rates';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  fromAmount: number = 0; // Кількість валюти, яку конвертуємо
  toAmount: number = 0; // Кількість конвертованої валюти
  fromCurrency: string = 'UAH'; // Початкова валюта
  toCurrency: string = 'USD'; // Валюта, в яку конвертуємо
  rates: CurrencyRates  = {}; // Обєкт з курсами валют

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    // Підписка на поточні курси валют
    this.currencyService.rates$.subscribe(
      (data: CurrencyRates ) => {
        this.rates = data; // Збереження курсів валют
        this.convertFrom(); // Конвертуємо валюту при завантаженні курсів
      },
      (error: unknown) => {
        console.error('Error fetching rates:', error); // Обробка помилки
      }
    );
  }

  // Метод для конвертації з початкової валюти в цільову
  convertFrom(): void {
    if (this.rates[this.fromCurrency] && this.rates[this.toCurrency]) {
      this.toAmount = this.fromAmount * (this.rates[this.toCurrency] / this.rates[this.fromCurrency]);
    } else {
      this.toAmount = 0; // Якщо курси відсутні, встановлюємо 0
    }
  }

  // Метод для конвертації з цільової валюти в початкову
  convertTo(): void {
    if (this.rates[this.fromCurrency] && this.rates[this.toCurrency]) {
      this.fromAmount = this.toAmount * (this.rates[this.fromCurrency] / this.rates[this.toCurrency]);
    } else {
      this.fromAmount = 0; // Якщо курси відсутні, встановлюємо 0
    }
  }

  // Виклик методу при зміні початкової валюти
  onFromCurrencyChange(): void {
    this.convertFrom();
  }

  // Виклик методу при зміні цільової валюти
  onToCurrencyChange(): void {
    this.convertFrom();
  }
}



