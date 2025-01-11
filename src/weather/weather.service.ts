import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { GetWeatherDto } from './get-weather';
import { WeatherData } from './weather.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCurrentWeather(
    params: GetWeatherDto,
  ): Promise<WeatherData | WeatherData[]> {
    try {
      // Zipcode-only implementation
      if (!params.zipcode) {
        throw new HttpException(
          'Zipcode parameter must be provided',
          HttpStatus.BAD_REQUEST,
        );
      }

      const country = params.country || 'PH';
      return await this.fetchWeatherDataByZipcode(params.zipcode, country);
    } catch (error) {
      // Error handling remains the same
      if (error instanceof HttpException) {
        throw error;

      }
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  private async fetchWeatherDataByZipcode(
    zipcode: string,
    country: string,
  ): Promise<WeatherData> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${country}&appid=d80ca131e485bb6e4c8b755b216c7c79&units=metric`;
      console.log('Requesting URL:', url);

      const response = await firstValueFrom(this.httpService.get(url));
      return this.transformWeatherData(response.data);
    } catch (error) {
      console.error(
        `Error fetching weather for zipcode ${zipcode}:`,
        error.message,
      );

      // Check if it's a 404 error from OpenWeatherMap
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes('not found')
      ) {
        throw new HttpException(
          `No weather data found for zipcode ${zipcode}`,
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Error fetching weather data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async fetchWeatherData(location: string): Promise<WeatherData> {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=d80ca131e485bb6e4c8b755b216c7c79&units=metric`;
      console.log('Requesting URL:', url);

      const response = await firstValueFrom(this.httpService.get(url));
      return this.transformWeatherData(response.data);
    } catch (error) {
      console.error(`Error fetching weather for ${location}:`, error.message);
      return null;
    }
  }

  private transformWeatherData(data: any): WeatherData {
    return {
      location: {
        city: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
      },
      current: {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
      },
    };
  }
}
