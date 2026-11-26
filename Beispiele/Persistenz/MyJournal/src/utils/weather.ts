import * as Location from 'expo-location';

export type WeatherInfo = {
  location: string | null;
  weather: string | null;
};

const EMPTY_WEATHER: WeatherInfo = { location: null, weather: null };

const WEATHER_LABELS: Record<number, string> = {
  0: 'klar',
  1: 'überwiegend klar',
  2: 'teils bewölkt',
  3: 'bedeckt',
  45: 'Nebel',
  48: 'Nebel',
  51: 'Nieselregen',
  53: 'Nieselregen',
  55: 'Nieselregen',
  56: 'gefrierender Nieselregen',
  57: 'gefrierender Nieselregen',
  61: 'Regen',
  63: 'Regen',
  65: 'starker Regen',
  66: 'gefrierender Regen',
  67: 'gefrierender Regen',
  71: 'Schnee',
  73: 'Schnee',
  75: 'starker Schneefall',
  77: 'Schneegriesel',
  80: 'Regenschauer',
  81: 'Regenschauer',
  82: 'starke Regenschauer',
  85: 'Schneeschauer',
  86: 'starke Schneeschauer',
  95: 'Gewitter',
  96: 'Gewitter',
  99: 'Gewitter',
};

type ForecastResponse = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

const WEB_POSITION_TIMEOUT_MS = 8000;

type Coordinates = {
  latitude: number;
  longitude: number;
};

function readWebPosition(): Promise<Coordinates | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), WEB_POSITION_TIMEOUT_MS);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timer);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: WEB_POSITION_TIMEOUT_MS, maximumAge: 60_000 },
    );
  });
}

async function readDevicePosition(): Promise<Coordinates | null> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== 'granted') {
    console.log('Permission to access location was denied');
    return null;
  }

  const lastKnown = await Location.getLastKnownPositionAsync();
  if (lastKnown) {
    return lastKnown.coords;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return position.coords;
}

async function placeName(latitude: number, longitude: number): Promise<string | null> {
  if (process.env.EXPO_OS === 'web') {
    return null;
  }

  const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
  return place?.city || place?.district || place?.subregion || place?.name || null;
}

export async function getWeather(): Promise<WeatherInfo> {
  try {
    const position = process.env.EXPO_OS === 'web' ? await readWebPosition() : await readDevicePosition();
    if (!position) {
      return EMPTY_WEATHER;
    }

    const { latitude, longitude } = position;
    const location = await placeName(latitude, longitude);
    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${latitude}&longitude=${longitude}` +
      '&current=temperature_2m,weather_code&timezone=auto';
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather request failed: ${response.status}`);
    }

    const data = (await response.json()) as ForecastResponse;
    const temperature = data.current?.temperature_2m;
    const code = data.current?.weather_code;
    if (typeof temperature !== 'number') {
      return { location, weather: null };
    }

    const description = typeof code === 'number' ? (WEATHER_LABELS[code] ?? 'Wetter') : 'Wetter';
    return {
      location,
      weather: `${Math.floor(temperature)}˚C ${description}`,
    };
  } catch (error) {
    console.log('Error fetching weather', error);
    return EMPTY_WEATHER;
  }
}
