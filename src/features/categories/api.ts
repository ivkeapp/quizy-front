import type { Category } from '@/entities/Category';
import { http } from '@/shared/api/http';

export async function getCategories() {
  const { data } = await http.get<Category[]>('/api/categories');
  return data;
}
