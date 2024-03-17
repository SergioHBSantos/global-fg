import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILocationTax } from '../model/location-tax';

@Injectable({
  providedIn: 'root',
})
export class LocationTaxService {
  constructor(private http: HttpClient) {}

  getLocationsTaxRates(): Observable<ILocationTax[]> {
    return this.http.get<ILocationTax[]>('http://localhost:8080/api/tax/list');
  }

  calculateValues(formData: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/tax/calc', {
      location: formData.get('location')?.value,
      netAmount: formData.get('netAmount')?.value,
      vatRate: formData.get('vatRate')?.value,
    });
  }
}
