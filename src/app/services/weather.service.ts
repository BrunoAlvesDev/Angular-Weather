import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  public getWeather(lat: number, lng: number): Observable<any> {
    const key = '4b91c52887eedb6e5a883705ddea84ea';

    return this.http.get(
      //`https://api.ambeedata.com/weather/latest/by-lat-lng?lat=${lat}&lng=${lng}`,
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`
    );
  }
}
