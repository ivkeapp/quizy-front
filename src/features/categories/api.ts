import type { Category } from '@/entities/Category';
import { http } from '@/shared/api/http';

type CategoriesApiResponse = Category[] | { items?: Category[]; categories?: Category[] };

export async function getCategories() {
  const { data } = await http.get<CategoriesApiResponse>('/api/categories');

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.categories)) {
    return data.categories;
  }

  return [];
}
