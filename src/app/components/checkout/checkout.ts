import { LocationUpgradeModule } from '@angular/common/upgrade';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopService } from '../../services/shop.service';
import { start } from '@popperjs/core';

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
    } else {
      billing.reset();
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

  onSubmit() {
    console.log('handling the submit button');
    console.log(this.checkoutFormGroup?.get('customer')?.value);
  }
}
