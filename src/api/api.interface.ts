export type FilterValue = BodyPart | Muscles | Equipment;

export interface Exercise {
  _id: string;
  bodyPart: BodyPart;
  burnedCalories: number;
  description: string;
  equipment: Equipment;
  gifUrl: string;
  name: string;
  popularity: number;
  rating: number;
  target: Muscles;
  time: number; // in minutes
}

export type Rating = {
  rate: number;
  email: string;
  review: string;
};

export type Quote = {
  author: string;
  quote: string;
};

export interface PaginatedResponse<T> {
  page: number | string;
  perPage: number | string;
  totalPages: number;
  results: T[];
}

export type GetExercisesResponse = PaginatedResponse<Exercise>;
export type GetFiltersResponse = PaginatedResponse<FilterValue>;

export type SubscriptionResponse = {
  message: string;
};

//  literal union types
export const ExerciseFilter = {
  All: 'All',
  Body_parts: 'Body_parts',
  Muscles: 'Muscles',
  Equipment: 'Equipment',
} as const;

export type ExerciseFilter = keyof typeof ExerciseFilter;

export const BodyPart = [
  'back',
  'cardio',
  'chest',
  'lower arms',
  'lower legs',
  'neck',
  'shoulders',
  'upper arms',
  'upper legs',
  'waist',
] as const;

export type BodyPart = (typeof BodyPart)[number];

export const Muscles = [
  'abductors',
  'abs',
  'adductors',
  'biceps',
  'calves',
  'cardiovascular system',
  'delts',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'levator scapulae',
  'pectorals',
  'quads',
  'serratus anterior',
  'spine',
  'traps',
  'triceps',
  'upper back',
] as const;

export type Muscles = (typeof Muscles)[number];

export const Equipment = [
  'assisted',
  'band',
  'barbell',
  'body weight',
  'bosu ball',
  'cable',
  'dumbbell',
  'elliptical machine',
  'ez barbell',
  'hammer',
  'kettlebell',
  'leverage machine',
  'medicine ball',
  'olympic barbell',
  'resistance band',
  'roller',
  'rope',
  'skierg machine',
  'sled machine',
  'smith machine',
  'stability ball',
  'stationary bike',
  'stepmill machine',
  'tire',
  'trap bar',
  'upper body ergometer',
  'weighted',
  'wheel roller',
] as const;

export type Equipment = (typeof Equipment)[number];
