
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyService } from '../../services/currency.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {
  fromAmount: number = 0;
  toAmount: number = 0;
  fromCurrency: string = 'UAH';
  toCurrency: string = 'USD';
  rates: { [key: string]: number } = {};

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencyService.rates$.subscribe(
      (data: { [key: string]: number }) => {
        this.rates = data;
        this.convertFrom(); 
      },
      (error: unknown) => {
        console.error('Error fetching rates:', error);
      }
    );
  }

  convertFrom(): void {
    if (this.rates[this.fromCurrency] && this.rates[this.toCurrency]) {
      this.toAmount = this.fromAmount * (this.rates[this.toCurrency] / this.rates[this.fromCurrency]);
    } else {
      this.toAmount = 0; 
    }
  }

  convertTo(): void {
    if (this.rates[this.fromCurrency] && this.rates[this.toCurrency]) {
      this.fromAmount = this.toAmount * (this.rates[this.fromCurrency] / this.rates[this.toCurrency]);
    } else {
      this.fromAmount = 0; 
    }
  }

  onFromCurrencyChange(): void {
    this.convertFrom();
  }

  onToCurrencyChange(): void {
    this.convertFrom();
  }
}


