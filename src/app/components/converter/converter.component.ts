import { Component } from '@angular/core';
import { CurrencyService } from '../../services/currency.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent {
  rates: any = {};
  fromCurrency = 'UAH';
  toCurrency = 'USD';
  fromAmount!: number ;
  toAmount!: number;

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencyService.getRates().subscribe(data => {
      this.rates = data.rates;
      this.convertFrom();
    });
  }

  convertFrom(): void {
    this.toAmount = this.fromAmount * (this.rates[this.toCurrency] / this.rates[this.fromCurrency]);
  }

  convertTo(): void {
    this.fromAmount = this.toAmount * (this.rates[this.fromCurrency] / this.rates[this.toCurrency]);
  }

  onFromCurrencyChange(): void {
    this.convertFrom();
  }

  onToCurrencyChange(): void {
    this.convertFrom();
  }
}
