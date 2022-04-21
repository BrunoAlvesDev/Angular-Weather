import { Component, OnInit } from '@angular/core';
import { Weather } from '../interfaces/weather';
import { LocationService } from '../services/location.service';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public icon: string;
  public lighting: string;
  public weather: Weather;
  private weatherData: any;

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService
  ) {
    this.icon = '';
    this.lighting = '';
    this.weather = {};
    this.weatherData = {};
  }

  ngOnInit(): void {
    this.weather = {
      tempCelsius: 0,
      tempFahrenheit: 0,
      city: '-',
      activeUnit: 'C',
    };

    this.getUserLocation();
  }

  public getUserLocation(): void {
    this.locationService.getLocation().then((location) => {
      this.getWeather(location);
    });
  }

  public getActualTime(): void {
    let now = new Date().getHours();
    this.buildIcon(now);
  }

  public getWeather(location: any): void {
    this.weatherService
      .getWeather(location.lat, location.lng)
      .subscribe((data) => {
        this.weatherData = data;

        this.weather = {
          tempCelsius: Math.round(data.main.temp),
          tempFahrenheit: Math.round(data.main.temp) * 1.8 + 32,
          city: data.name,
          activeUnit: 'C',
        };

        this.getActualTime();
      });
  }

  public toggleActiveUnit(): void {
    if (this.weather.activeUnit === 'C') this.weather.activeUnit = 'F';
    else this.weather.activeUnit = 'C';
  }

  public buildIcon(now: number): void {
    let clouds = this.weatherData.clouds.all;

    if (now > 6 && now < 18) {
      if (clouds < 10) this.buildIconPath('sunny');
      else if (clouds < 80) this.buildIconPath('cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'day-clear';
    } else {
      console.log('aa', clouds < 80);

      if (clouds < 10) this.buildIconPath('night');
      else if (clouds < 80) this.buildIconPath('night-cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'night-clear';
    }
  }

  public buildIconPath(iconName: string): void {
    this.icon = `assets/img/${iconName}.png`;
  }
}
