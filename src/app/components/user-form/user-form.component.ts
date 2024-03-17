import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { lastValueFrom } from 'rxjs';
import { ILocationTax } from '../../model/location-tax';
import { LocationTaxService } from '../../services/location-tax.service';
import DuplicatedAmountCalcValidator from '../validators/amount.validator';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    CurrencyMaskModule,
    HttpClientModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  currentLocation: String = 'Austria'; // could get this current location from IP address
  locationTaxList: ILocationTax[] = [];
  vatRateList: number[] = [];

  userForm: FormGroup;
  formSubmitted = false;
  selectedVat = 0;

  constructor(private locationTaxService: LocationTaxService) {
    this.userForm = new FormGroup(
      {
        location: new FormControl(this.currentLocation, {
          nonNullable: true,
          validators: [Validators.required],
        }),
        vatRate: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }),
        netAmount: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        grossAmount: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        vatAmount: new FormControl(0, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
      },
      { validators: DuplicatedAmountCalcValidator }
    );
  }

  async ngOnInit() {
    this.locationTaxList = await lastValueFrom(
      this.locationTaxService.getLocationsTaxRates()
    );
    this.userForm.controls['location'].setValue(this.currentLocation);
    this.selectTaxRate(this.currentLocation);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  selectLocation(newValue: String) {
    console.log(`Selected option: ${newValue}`);
    this.currentLocation = newValue;
    this.selectTaxRate(newValue);
  }

  selectTaxRate(location: String) {
    const selectedLocation = this.locationTaxList.find(
      (locationTax) => locationTax.location === location
    );
    this.vatRateList = selectedLocation!.taxRates;
    this.userForm.controls['vatRate'].setValue(this.vatRateList[0]);
  }

  sendForm() {
    if (!this.userForm.invalid) {
      this.formSubmitted = true;
      this.locationTaxService
        .calculateValues(this.userForm)
        .subscribe((response) => {
          this.userForm.controls['netAmount'].setValue(response.netAmount);
          this.userForm.controls['vatAmount'].setValue(response.vatAmount);
          this.userForm.controls['grossAmount'].setValue(response.grossAmount);
        });
    }
    return;
  }

  resetForm() {
    this.userForm.reset({
      location: this.currentLocation,
      vatRate: this.vatRateList[0],
      netAmount: 0,
      grossAmount: 0,
      vatAmount: 0,
    });
    this.formSubmitted = false;
  }
}
