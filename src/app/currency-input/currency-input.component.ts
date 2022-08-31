import { Component, forwardRef, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyInputComponent),
      multi: true,
    },
  ],
})
export class CurrencyInputComponent implements ControlValueAccessor, OnDestroy {
  unsubscribe$: Subject<void> = new Subject<void>();
  currency = new FormControl('$ 0.00');

  writeValue(value: any): void {
    this.currency.patchValue(this.numberToCurrency(value), {
      emitEvent: false,
    });
  }
  registerOnChange(fn: any): void {
    this.currency.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        map(this.currencyToNumber),
        tap(value => 
          this.currency.patchValue(
            this.numberToCurrency(value.toString()), {emitEvent: false})
          )
      )
      .subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.currency.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        map(() => this.currency.dirty),
      )
      .subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.currency.disable();
    } else {
      this.currency.enable();
    }
  }

  numberToCurrency(value: string = '0'): string {
    const number = Number(parseFloat(value).toFixed(2));
    const currency = number.toLocaleString('en', {
      minimumFractionDigits: 2,
    });
    return '$ ' + currency;
  }

  currencyToNumber(currency: string): number {
    let curNum = currency.replace(/[^0-9-]+/g, '');
    const len = curNum.length;
    if (len === 0) {
      curNum = '000';
    }
    curNum = curNum.substring(0, len - 2) + '.' + curNum.substring(len - 2);
    return Number(curNum);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
