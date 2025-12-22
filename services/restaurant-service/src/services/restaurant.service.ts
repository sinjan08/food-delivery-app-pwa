type RestaurantRegisterInput = {
import { RestaurantCategoryDelegate } from './../../prisma/generated/models/RestaurantCategory';
name: string;
email: string;
phone: string;
password: string;
}

type RestaurantDetailsInput = {
  address: string;
  landmark?: string;
  countryId: number;
  stateId: number;
  cityId: number;
  pincode: string;
  categoryId: number;
  description?: string;
  voiceNoteDirection?: string;
  rating?: number;
  ratingCount?: number;
  isPureVeg?: boolean;
  avgPrepTime?: number;
  searchText?: string;
}

type RestaurantDocsInput = {
  restaurantId: number;
  docType: string;
  path: string;
}

type RestaurantMenuInput = {
  restaurantId: number;
  foodCategoryId: number;
  name: string;
  price: number;
  description: string;
  isVeg: boolean;
}