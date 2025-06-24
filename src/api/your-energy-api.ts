import axios from 'axios';
import {
  Equipment,
  ExerciseFilter,
  BodyPart,
  Muscles,
  type Quote,
  type SubscriptionResponse,
  type Exercise,
  type GetExercisesResponse,
  type Rating,
} from './api.interface';

export class YourEnergyAPI {
  // singleton Axios
  private static axiosInstance = axios.create({
    baseURL: 'https://your-energy.b.goit.study/api/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Setup interceptors
  static {
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          switch (status) {
            case 404:
              return Promise.reject(new Error('Resource not found (404).'));
            case 500:
              return Promise.reject(new Error('Server error (500). Please try again later.'));
            default:
              return Promise.reject(new Error(error.message || 'Unexpected error occurred.'));
          }
        }
        return Promise.reject(new Error('An unknown error occurred.'));
      },
    );
  }

  // 1. Перелік фільтрів (вправ)
  static async getFilters(exerciseFilter: ExerciseFilter, page = 1, limit = 12) {
    const params: Record<string, string | number | undefined> = {
      page,
      limit,
    };

    if (exerciseFilter !== ExerciseFilter.All) {
      params.filter = exerciseFilter;
    }

    const response = await this.axiosInstance.get('/filters', { params });
    return response.data;
  }

  // 2. Перелік вправ з фільтрацією по категорії та ключовому слову
  static async getExercises(params: {
    bodypart?: BodyPart;
    muscles?: Muscles;
    equipment?: Equipment;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Promise<GetExercisesResponse> {
    const response = await this.axiosInstance.get('/exercises', { params });
    return response.data;
  }

  // 3. Детальна інформація про вправу
  static async getExerciseById(exerciseID: string): Promise<Exercise> {
    const response = await this.axiosInstance.get(`/exercises/${exerciseID}`);
    return response.data as Exercise;
  }

  // 4. Додавання рейтингу окремій вправі
  static async rateExercise(exerciseID: string, rating: Rating): Promise<Exercise> {
    const response = await this.axiosInstance.patch(`/exercises/${exerciseID}/rating`, {
      rate: rating.rate,
      email: rating.email,
      review: rating.review,
    });
    return response.data as Exercise;
  }

  // 5. Цитата дня
  static async getQuote(): Promise<Quote> {
    const response = await this.axiosInstance.get('/quote');
    return response.data as Quote;
  }

  // 6. Оформлення підписки
  static async subscribe(email: string): Promise<SubscriptionResponse> {
    const response = await this.axiosInstance.post('/subscription', { email });
    return response.data as SubscriptionResponse;
  }
}

/* 
Usage in components:

async function getFilters() {
  try {
    const filters = await YourEnergyAPI.getFilters('Body parts', 1, 12);
    return filters
  } catch (error) {
    console.error(error.message); // "Resource not found (404)."
  }
}

async function getExcercises() {
  try {
    const exercise = await YourEnergyAPI.getExercises({bodyPart: "shoulders", equipment: "kettlebell", muscles: "delts", keyword: "kettlebell", limit: 10, page: 1 });
    return excercise
  } catch (error) {
    console.error(error.message); // "Resource not found (404)."
  }
}

async function getQuoteOfTheDay() {
  try {
    const quote = await YourEnergyAPI.getQuote();
    return quote
  } catch (error) {
    console.error(error.message); // If 500 error, shows "Server error (500)..."
  }
}
*/
