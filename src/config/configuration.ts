import { Config } from './config.interface';

export default (): Config => ({
  openWeatherMap: {
    apiKey: process.env.API_KEY || 'd80ca131e485bb6e4c8b755b216c7c79',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
  },
});
