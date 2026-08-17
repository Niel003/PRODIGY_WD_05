export interface GeoLocation {
  id: number;
  name: string;
  country?: string;
  countryCode?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  dewPoint: number;
  precipitation: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  apparentTemperature: number[];
  precipitationProbability: number[];
  weatherCode: number[];
  windSpeed: number[];
  windDirection: number[];
  isDay: number[];
  uvIndex: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  tempMax: number[];
  tempMin: number[];
  precipitationProbability: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
}

export interface AirQuality {
  pm10: number;
  pm2_5: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  ozone: number;
  sulphurDioxide: number;
  dust: number;
  uvIndex: number;
  uvIndexClearSky: number;
  europeanAqi: number | null;
  usAqi: number | null;
}

export interface WeatherData {
  location: GeoLocation;
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  airQuality: AirQuality | null;
}

export type WeatherCategory =
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherInfo {
  label: string;
  category: WeatherCategory;
  icon: string;
}
