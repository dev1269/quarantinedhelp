import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRegisterForm } from '../models/auth';
import { Observable } from 'rxjs';

export const BASE_URL = "https://api.quarantinehelp.space";
export const ENDPOINT = {
  REGISTER: "/api/v1/auth/register/",
  LOGIN: "/api/v1/auth/login/"
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient) { }

  register(user: IRegisterForm): Observable<any> {
    return this._http.post(BASE_URL + ENDPOINT.REGISTER, user);
  }
}
