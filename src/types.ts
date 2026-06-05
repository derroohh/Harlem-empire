export interface GoogleUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface QuickNote {
  id: string;
  text: string;
  createdAt: string;
}

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface EventItem {
  id: string;
  title: string;
  time: string;
  category: 'work' | 'personal' | 'health';
}
