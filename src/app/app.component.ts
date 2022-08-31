import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  expensesForm = new FormGroup({
    expenses: new FormArray([]),
  });
  get expenses(): FormArray {
    return this.expensesForm.get('expenses') as FormArray;
  }

  monthlyAmount: Observable<number> = this.expensesForm.valueChanges.pipe(
    map(form => form.expenses.map(item => item.amount)),
    map(amounts => amounts.filter(amount => amount !== undefined)),
    filter(amounts => amounts.length > 0),
    map(amounts => amounts.reduce((a, c) => a + c)),
  );

  addItem() {
    this.expenses.push(
      new FormControl({
        name: undefined,
        amount: undefined,
      }),
    );
  }

  removeItem(index: number) {
    this.expenses.removeAt(index);
  }
}
