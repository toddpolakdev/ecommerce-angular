import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries!: Observable<Country[]>;

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private ShopService: ShopService
  ) {}

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    const startMonth: number = new Date().getMonth() + 1;

    this.ShopService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });

    this.ShopService.getCreditCardYears(startMonth).subscribe((data) => {
      this.creditCardYears = data;
    });

    this.countries = this.ShopService.getCountries();
  }

  copyShippingAddressToBillingAddress($event: Event) {
    // if (event?.target.checked) {
    // }
    // this.checkoutFormGroup.controls.billingAddress.setValue(
    //   this.checkoutFormGroup.controls.shippingAddress.value
    // );

    // `event` (deprecated)
    const input = $event.target as HTMLInputElement | null;

    // target can be null.
    if (!input) return;

    // Use `get()` (or bracket access)
    const billing = this.checkoutFormGroup.get('billingAddress') as FormGroup;
    const shipping = this.checkoutFormGroup.get('shippingAddress') as FormGroup;

    if (input.checked) {
      // Copy values; `patchValue` is safer than `setValue`
      billing.patchValue(shipping.getRawValue());

      this.billingAddressStates = [...this.shippingAddressStates];
    } else {
      billing.reset({
        country: null,
        street: '',
        city: '',
        state: null,
        zipCode: '',
      });
      this.billingAddressStates = [];
    }
  }

  handleMonthAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup?.value.expirationYear
    );

    let startMonth: number;

    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.ShopService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data;
    });
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.ShopService.getStates(countryCode).subscribe((data) => {
      console.log('states', data);

      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup?.get('state')?.setValue(data[0]);
    });
  }

  compareCountries(c1: Country, c2: Country): boolean {
    return c1 && c2 ? c1.code === c2.code : c1 === c2;
  }

  onSubmit() {
    console.log('handling the submit button');
    console.log(this.checkoutFormGroup?.get('customer')?.value);

    console.log(
      'The shipping address country is ' +
        this.checkoutFormGroup?.get('shippingAddress')?.value.country.name
    );

    console.log(
      'The shipping address state is ' +
        this.checkoutFormGroup?.get('shippingAddress')?.value.state.name
    );

    console.log(
      'The billing address country is ' +
        this.checkoutFormGroup?.get('billingAddress')?.value.country.name
    );

    console.log(
      'The billing address state is ' +
        this.checkoutFormGroup?.get('billingAddress')?.value.state.name
    );
  }
}
