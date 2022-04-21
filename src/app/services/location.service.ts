import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  public getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  public getLatLng(address: string): Observable<any> {
    const key = '132ab4f1c65e576e40abe4a840b88541';

    return this.http.get(
      `http://api.positionstack.com/v1/forward?access_key=${key}&query=${address}`
    );
  }
}
