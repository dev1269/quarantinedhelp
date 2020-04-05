import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { TranslateService } from '@ngx-translate/core';
import { PlaceSuggestion } from '../auto-complete/auto-complete.component';
import { IRegisterForm, IPosition } from 'src/app/models/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class RegisterComponent implements OnInit {

  selectedAddress: any;
  registerData: IRegisterForm;
  additionalForm = new FormGroup({
    //position: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    passwordconfirm: new FormControl('', [Validators.required, Validators.minLength(6)]),
    /* googlePlaceId: new FormControl('', [Validators.required]),
    is_available: new FormControl('', [Validators.required]),
    crisis: new FormControl('', [Validators.required]),
    abilities: new FormControl('', [Validators.required]), */
  });

  basicInfoForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    street: new FormControl('', [Validators.required]),
    housenumber: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
    secondAddress: new FormControl(''),
  })

  constructor(private _router: Router, private _translate: TranslateService, private http: HttpClient) { }

  ngOnInit() {
  }

  navigateHome(): void {
    this._router.navigate(['register']);
  }

  autocompleteChanged(value: any) {
    if (value && value.data) {
      const info = value.data.address;
      this.selectedAddress = value;
      if (info.city) {
        this.basicInfoForm.get('city').setValue(info.city);
      }
      if (info.houseNumber) {
        this.basicInfoForm.get('housenumber').setValue(info.houseNumber);
      }
      if (info.street) {
        this.basicInfoForm.get('street').setValue(info.street);
      }
      if (info.city) {
        this.basicInfoForm.get('city').setValue(info.city);
      }
      if (info.postalCode) {
        this.basicInfoForm.get('postcode').setValue(info.postalCode);
      }
      if (info.country) {
        this.basicInfoForm.get('country').setValue(info.country);
      }
    }

  }

  get password() { return this.additionalForm.get('password'); }
  get passwordconfirm() { return this.additionalForm.get('passwordconfirm'); }

  compare(): void {
    if (this.password.value !== this.passwordconfirm.value) {
      this.passwordconfirm.setErrors({
        notmatched: true
      });
    }
  }

  /*   {
      "user": {
        "firstName": "Patient First Test with 6",
        "lastName": "Patient last",
        "email": "patientssss2dsddgfg@patient.com",
        "password": "YEEHA"
      },
      "position": {
        "longitude": "2.7105760574340807",
        "latitude": "48.19827663849882"
      },
      "type": "AF",
      "firstLineOfAddress": "First Line of add",
      "secondLineOfAddress": "Second line",
      "placeId": "ChIJwyyKo7J3X0YRZ5XOMcLx3xo",
      "postCode": "12345",
      "city": "Berlin",
      "country": "DE",
      "crisis": 1,
      "phone": "+46761189391"
    } */

  submit(): void {
    this.registerData = {
      city: this.basicInfoForm.get('city').value,
      country: this.basicInfoForm.get('country').value,
      crisis: 1,
      phone: this.basicInfoForm.get('phone').value,
      firstLineOfAddress: this.selectedAddress.shortAddress,
      secondLineOfAddress: this.basicInfoForm.get('secondAddress').value,
      position: this.getLocation(this.selectedAddress.shortAddress),
      postCode: this.basicInfoForm.get('postcode').value,
      user: {
        firstName: this.basicInfoForm.get('firstName').value,
        lastName: this.basicInfoForm.get('lastName').value,
        email: this.basicInfoForm.get('email').value,
        password: this.additionalForm.get('password').value
      },
      placeId: this.selectedAddress.data.locationId,
      type: null
    }

    console.log('FINAL', this.registerData);

  }

  private getLocation(address: string): IPosition {
    const REST_KEY = "INxGhspY9TqShx3heSZSBmobOsutPeE9eJaTxfHiiQQ";
    const url = `https://geocoder.ls.hereapi.com/6.2/geocode.json?searchtext=${address}&apiKey=${REST_KEY}`;
    let pos: IPosition = { lattitude: null, longitude: null };

    this.http.get(url).subscribe((data: any) => {
      const res = data && data.Response && data.Response.View && data.Response.View[0];
      const locdata = res && res.Result && res.Result[0].Location;
      const final = locdata && locdata.DisplayPosition;
      pos.lattitude = final.Latitude;
      pos.longitude = final.Longitude;
    }, err => {
      pos = null;
    });
    return pos;
  }

}
