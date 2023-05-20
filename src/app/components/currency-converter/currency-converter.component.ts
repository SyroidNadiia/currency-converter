import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
})
export class CurrencyConverterComponent {
  selectedFromCurrency: string = 'USD';
  selectedToCurrency: string = 'UAH';
  amountFrom: number = 0;
  amountTo: number = 0;
  convertedAmount: number = 0;
  inverseConvertedAmount: number = 0;
  currencies: string[] = ['USD', 'EUR', 'UAH'];
  isRequestInProgress: boolean = false;
  accessKey: string = 'JboCBj6wwlC8PsBQdNICUJFDIKst9jhk';

  constructor(private http: HttpClient) {}

  convert() {
    if (this.amountFrom > 0 && !this.isRequestInProgress) {
      this.isRequestInProgress = true;
      const apiUrl = `https://api.apilayer.com/exchangerates_data/convert`;
      const params = {
        amount: this.amountFrom.toString(),
        from: this.selectedFromCurrency,
        to: this.selectedToCurrency,
      };

      this.http
        .get(apiUrl, {
          params,
          headers: {
            apikey: this.accessKey,
          },
        })
        .subscribe(
          (response: any) => {
            console.log(response);
            // Process the response
            if (response.success) {
              this.convertedAmount = parseFloat(response.result);
              this.updateAmountTo();
            } else {
              console.log('Error converting currencies:', response.error);
                }
                this.isRequestInProgress = false;
          },
          (error) => {
              console.log('Error converting currencies:', error);
              this.isRequestInProgress = false; 
          }
        );
    }
  }

  updateAmountTo() {
    if (this.convertedAmount !== 0) {
      this.amountTo = this.amountFrom * this.convertedAmount;
    } else {
      this.amountTo = 0;
    }
  }

  updateAmountFrom() {
    if (this.convertedAmount !== 0) {
      this.amountFrom = this.amountTo / this.convertedAmount;
    } else {
      this.amountFrom = 0;
    }
    this.convert();
  }
}
