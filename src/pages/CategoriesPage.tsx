import { useCategories } from '@/features/categories/hooks';
import { ErrorState } from '@/shared/ui/ErrorState';
import { LoadingState } from '@/shared/ui/LoadingState';

export function CategoriesPage() {
  const categories = useCategories();

  if (categories.isLoading) {
    return <LoadingState label="Loading categories..." />;
  }

  if (categories.isError) {
    return <ErrorState message="Failed to load categories." />;
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h1 className="text-xl font-semibold">Categories</h1>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {categories.data?.map((category) => (
          <li key={category.id} className="rounded-lg border border-slate-200 p-3">
            <div className="font-medium">{category.name}</div>
            <p className="text-sm text-slate-600">{category.description || 'No description'}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
