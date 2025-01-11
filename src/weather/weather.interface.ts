export interface WeatherData {
  location: {
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  current: {
    temperature: number;
    humidity: number;
    description: string;
    windSpeed: number;
  };
}
