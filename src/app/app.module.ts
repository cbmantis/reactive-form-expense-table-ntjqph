import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { CurrencyInputComponent } from './currency-input/currency-input.component';
import { OnlyNumberDirective } from './only-number/only-number.directive';
import { ExpenseItemComponent } from './expense-item/expense-item.component';

@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [ 
    AppComponent,
    CurrencyInputComponent,
    OnlyNumberDirective,
    ExpenseItemComponent,
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
