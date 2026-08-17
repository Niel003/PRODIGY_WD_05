export type SceneType = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog';

export interface GeoResult {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface SavedCity {
  id: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  dewPoint: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  time: string;
}

export interface HourlyPoint {
  time: string;
  hour: number;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  isDay: boolean;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  windSpeed: number;
  sunrise: string;
  sunset: string;
  uvIndex: number;
}

export interface AirQuality {
  pm10: number;
  pm2_5: number;
  carbonMonoxide: number;
  nitrogenDioxide: number;
  ozone: number;
  sulphurDioxide: number;
  europeanAqi: number;
  usAqi: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  airQuality: AirQuality | null;
  timezone: string;
}
