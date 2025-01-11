import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GetWeatherDto } from './get-weather';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get current weather by city' })
  @ApiResponse({ status: 200, description: 'Returns weather data' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  getCurrentWeather(@Query() query: GetWeatherDto) {
    return this.weatherService.getCurrentWeather(query);
  }
}