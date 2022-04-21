import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Weather } from '../interfaces/weather';
import { LocationService } from '../services/location.service';
import { TimezoneService } from '../services/timezone.service';
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
  public search: string;
  public isSearching: boolean;

  @ViewChild('searchInput') searchInput!: ElementRef;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //if (event.key === 'Enter') console.log('hahabololo');
    //console.log(event.key);
  }

  constructor(
    private locationService: LocationService,
    private weatherService: WeatherService,
    private timezoneService: TimezoneService
  ) {
    this.icon = '';
    this.lighting = '';
    this.weather = {};
    this.weatherData = {};
    this.search = '';
    this.isSearching = true;
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

  public searchLocation(): void {
    this.isSearching = true;

    this.searchInput.nativeElement.blur();

    this.locationService.getLatLng(this.search).subscribe((response) => {
      let data = response.data[0];

      if (response.data.length === 0) {
        this.search = 'Não encontrado';
        this.isSearching = false;
      } else this.getWeather(data.latitude, data.longitude);
    });
  }

  public toggleActiveUnit(): void {
    if (this.weather.activeUnit === 'C') this.weather.activeUnit = 'F';
    else this.weather.activeUnit = 'C';
  }

  public getUserLocation(): void {
    this.locationService.getLocation().then((location) => {
      this.getWeather(location.lat, location.lng);
    });
  }

  public getWeather(lat: number, lng: number): void {
    this.weatherService.getWeather(lat, lng).subscribe((data) => {
      this.weatherData = data;

      this.weather = {
        tempCelsius: Math.round(data.main.temp),
        tempFahrenheit: Math.round(data.main.temp * 1.8 + 32),
        city: data.name,
        activeUnit: 'C',
      };

      if (this.search === '') this.search = data.name;

      this.getActualTime(lat, lng);
    });
  }

  public getActualTime(lat: number, lng: number): void {
    this.timezoneService.getTimezone(lat, lng).subscribe((timezone) => {
      console.log('timezone', timezone);
      console.log(new Date(timezone.formatted).getHours());

      let now = new Date(timezone.formatted).getHours();

      this.buildIcon(now);
    });
  }

  public buildIcon(now: number): void {
    let clouds = this.weatherData.clouds.all;

    if (now >= 5 && now <= 6) {
      if (clouds < 10) this.buildIconPath('sunny');
      else if (clouds < 80) this.buildIconPath('cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'morning-clear';
    } else if (now > 6 && now < 17) {
      if (clouds < 10) this.buildIconPath('sunny');
      else if (clouds < 80) this.buildIconPath('cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'day-clear';
    } else if (now >= 17 && now <= 18) {
      if (clouds < 10) this.buildIconPath('sunny');
      else if (clouds < 80) this.buildIconPath('cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'sunset-clear';
    } else if (now > 18 && now < 20) {
      if (clouds < 10) this.buildIconPath('night');
      else if (clouds < 80) this.buildIconPath('night-cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'nights-start-clear';
    } else {
      if (clouds < 10) this.buildIconPath('night');
      else if (clouds < 80) this.buildIconPath('night-cloudy');
      else this.buildIconPath('cloud');

      this.lighting = 'night-clear';
    }

    this.isSearching = false;
  }

  public buildIconPath(iconName: string): void {
    this.icon = `assets/img/${iconName}.png`;
  }
}
