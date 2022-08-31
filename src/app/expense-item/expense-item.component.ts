import { Component, forwardRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { 
    ControlValueAccessor, 
    NG_VALUE_ACCESSOR, 
    NG_VALIDATORS, 
    FormGroup,
    FormControl, 
    Validator,
    AbstractControl,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { map, takeUntil, tap, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExpenseItemComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ExpenseItemComponent),
      multi: true,
    },
  ],
})
export class ExpenseItemComponent implements ControlValueAccessor, Validator, OnDestroy {
  unsubscribe$: Subject<void> = new Subject<void>();
  @Output() remove: EventEmitter<void> = new EventEmitter();
  
  expenseItem = new FormGroup({
    name: new FormControl(undefined, Validators.required),
    amount: new FormControl(undefined, Validators.required),
  });

  writeValue(value: any): void {
    this.expenseItem.patchValue(value, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    this.expenseItem.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        // filter(() => this.expenseItem.valid),
      )
      .subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.expenseItem.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        map(() =>
          Object.keys(this.expenseItem.controls)
            .map(key => this.expenseItem.controls[key].dirty)
            .every(Boolean),
        ),
      )
      .subscribe(fn);
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.expenseItem.disable();
    } else {
      this.expenseItem.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.expenseItem.valid ? null : {
      expenseItemError: true
    };
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}