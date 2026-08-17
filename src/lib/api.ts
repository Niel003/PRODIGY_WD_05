import type {
  AirQuality,
  CurrentWeather,
  DailyPoint,
  GeoResult,
  HourlyPoint,
  WeatherData,
} from './types';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function geocode(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

export async function reverseGeocode(lat: number, lon: number): Promise<GeoResult> {
  try {
    const url = `${GEO_URL}?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const r = data.results[0];
        return {
          id: r.id,
          name: r.name,
          country: r.country,
          admin1: r.admin1,
          latitude: r.latitude,
          longitude: r.longitude,
        };
      }
    }
  } catch {
    // fall through
  }
  return {
    id: Math.floor(Math.random() * 1e6),
    name: 'My Location',
    latitude: lat,
    longitude: lon,
  };
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const weatherParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
      'uv_index',
      'dew_point_2m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
  });

  const wRes = await fetch(`${WEATHER_URL}?${weatherParams}`);
  if (!wRes.ok) throw new Error('Weather fetch failed');
  const w = await wRes.json();

  const c = w.current;
  const d = w.daily;

  const current: CurrentWeather = {
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    pressure: c.pressure_msl,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    precipitation: c.precipitation,
    cloudCover: c.cloud_cover,
    visibility: c.visibility,
    uvIndex: c.uv_index,
    dewPoint: c.dew_point_2m,
    tempMax: d.temperature_2m_max[0],
    tempMin: d.temperature_2m_min[0],
    sunrise: d.sunrise[0],
    sunset: d.sunset[0],
    time: c.time,
  };

  const hourly: HourlyPoint[] = [];
  const nowHour = c.time.slice(0, 13);
  const startIndex = w.hourly.time.findIndex((t: string) => t.slice(0, 13) === nowHour);
  const start = startIndex >= 0 ? startIndex : 0;
  for (let i = start; i < Math.min(start + 24, w.hourly.time.length); i++) {
    hourly.push({
      time: w.hourly.time[i],
      hour: new Date(w.hourly.time[i]).getHours(),
      temperature: w.hourly.temperature_2m[i],
      precipitationProbability: w.hourly.precipitation_probability[i] ?? 0,
      weatherCode: w.hourly.weather_code[i],
      windSpeed: w.hourly.wind_speed_10m[i],
      isDay: w.hourly.is_day[i] === 1,
    });
  }

  const daily: DailyPoint[] = [];
  for (let i = 0; i < Math.min(7, d.time.length); i++) {
    daily.push({
      date: d.time[i],
      weatherCode: d.weather_code[i],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      precipitationProbability: d.precipitation_probability_max[i] ?? 0,
      windSpeed: d.wind_speed_10m_max[i],
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
      uvIndex: d.uv_index_max[i] ?? 0,
    });
  }

  let airQuality: AirQuality | null = null;
  try {
    const airParams = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: [
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'ozone',
        'sulphur_dioxide',
        'european_aqi',
        'us_aqi',
      ].join(','),
      timezone: 'auto',
    });
    const aRes = await fetch(`${AIR_URL}?${airParams}`);
    if (aRes.ok) {
      const a = await aRes.json();
      const ac = a.current;
      airQuality = {
        pm10: ac.pm10 ?? 0,
        pm2_5: ac.pm2_5 ?? 0,
        carbonMonoxide: ac.carbon_monoxide ?? 0,
        nitrogenDioxide: ac.nitrogen_dioxide ?? 0,
        ozone: ac.ozone ?? 0,
        sulphurDioxide: ac.sulphur_dioxide ?? 0,
        europeanAqi: ac.european_aqi ?? 0,
        usAqi: ac.us_aqi ?? 0,
      };
    }
  } catch {
    airQuality = null;
  }

  return {
    current,
    hourly,
    daily,
    airQuality,
    timezone: w.timezone,
  };
}
