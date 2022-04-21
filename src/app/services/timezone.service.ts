import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  constructor(private http: HttpClient) {}

  public getTimezone(lat: number, lng: number): Observable<any> {
    const key = 'VTETW12VMGHL';

    return this.http.get(
      `http://api.timezonedb.com/v2.1/get-time-zone?key=${key}&format=json&by=position&lat=${lat}&lng=${lng}`
    );
  }
}
