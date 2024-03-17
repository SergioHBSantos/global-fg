import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { of } from 'rxjs';
import { LocationTaxService } from '../../services/location-tax.service';
import { UserFormComponent } from './user-form.component';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  let locationTaxServiceStub: Partial<LocationTaxService>;

  locationTaxServiceStub = {
    calculateValues: jasmine
      .createSpy('calculateValues')
      .and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        { provide: LocationTaxService, useValue: locationTaxServiceStub },
        provideAnimationsAsync(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call locationTaxService when form is submitted', () => {
    component.userForm.controls['location'].setValue('Germany');
    component.userForm.controls['vatRate'].setValue(19);
    component.sendForm();
    expect(locationTaxServiceStub.calculateValues).toHaveBeenCalled();
  });

  it('should reset form when resetForm is called', () => {
    component.vatRateList[0] = 10;
    component.userForm.controls['location'].setValue('Germany');
    component.userForm.controls['vatRate'].setValue(19);
    component.userForm.controls['netAmount'].setValue(100);
    component.userForm.controls['grossAmount'].setValue(119);
    component.userForm.controls['vatAmount'].setValue(19);
    component.formSubmitted = true;

    component.resetForm();

    expect(component.userForm.value).toEqual({
      location: component.currentLocation,
      vatRate: component.vatRateList[0],
      netAmount: 0,
      grossAmount: 0,
      vatAmount: 0,
    });
    expect(component.formSubmitted).toBe(false);
  });
});
