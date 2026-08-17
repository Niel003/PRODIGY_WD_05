import type {
  AirQuality,
  CurrentWeather,
  DailyForecast,
  GeoLocation,
  HourlyForecast,
  WeatherData,
} from './types';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const REVERSE_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/reverse';

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (query.trim().length < 2) return [];
  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search cities');
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    countryCode: r.country_code,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  }));
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<GeoLocation> {
  try {
    const url = `${REVERSE_GEO_URL}?latitude=${lat}&longitude=${lon}&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        return {
          id: r.id ?? Date.now(),
          name: r.name,
          country: r.country,
          countryCode: r.country_code,
          admin1: r.admin1,
          latitude: lat,
          longitude: lon,
          timezone: r.timezone,
        };
      }
    }
  } catch {
    /* fall through to generic */
  }
  return {
    id: Date.now(),
    name: 'My Location',
    latitude: lat,
    longitude: lon,
  };
}

export async function fetchWeather(location: GeoLocation): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,cloud_cover,visibility,uv_index,dew_point_2m,precipitation',
    hourly:
      'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m,is_day,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max',
    timezone: 'auto',
    forecast_days: '7',
  });
  const url = `${FORECAST_URL}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  const data = await res.json();

  const current: CurrentWeather = {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    apparentTemperature: data.current.apparent_temperature,
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    humidity: data.current.relative_humidity_2m,
    pressure: data.current.surface_pressure,
    cloudCover: data.current.cloud_cover,
    visibility: data.current.visibility,
    uvIndex: data.current.uv_index,
    dewPoint: data.current.dew_point_2m,
    precipitation: data.current.precipitation,
  };

  const hourly: HourlyForecast = {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    apparentTemperature: data.hourly.apparent_temperature,
    precipitationProbability: data.hourly.precipitation_probability,
    weatherCode: data.hourly.weather_code,
    windSpeed: data.hourly.wind_speed_10m,
    windDirection: data.hourly.wind_direction_10m,
    isDay: data.hourly.is_day,
    uvIndex: data.hourly.uv_index,
  };

  const daily: DailyForecast = {
    time: data.daily.time,
    weatherCode: data.daily.weather_code,
    tempMax: data.daily.temperature_2m_max,
    tempMin: data.daily.temperature_2m_min,
    precipitationProbability: data.daily.precipitation_probability_max,
    windSpeedMax: data.daily.wind_speed_10m_max,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    uvIndexMax: data.daily.uv_index_max,
  };

  let airQuality: AirQuality | null = null;
  try {
    airQuality = await fetchAirQuality(location);
  } catch {
    airQuality = null;
  }

  return { location, current, hourly, daily, airQuality };
}

async function fetchAirQuality(
  location: GeoLocation
): Promise<AirQuality | null> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current:
      'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone,sulphur_dioxide,dust,uv_index,uv_index_clear_sky,european_aqi,us_aqi',
    timezone: 'auto',
  });
  const url = `${AIR_URL}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.current) return null;
  const c = data.current;
  return {
    pm10: c.pm10 ?? 0,
    pm2_5: c.pm2_5 ?? 0,
    carbonMonoxide: c.carbon_monoxide ?? 0,
    nitrogenDioxide: c.nitrogen_dioxide ?? 0,
    ozone: c.ozone ?? 0,
    sulphurDioxide: c.sulphur_dioxide ?? 0,
    dust: c.dust ?? 0,
    uvIndex: c.uv_index ?? 0,
    uvIndexClearSky: c.uv_index_clear_sky ?? 0,
    europeanAqi: c.european_aqi ?? null,
    usAqi: c.us_aqi ?? null,
  };
}
