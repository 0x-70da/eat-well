"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@workspace/types";
import { Search, SlidersHorizontal } from "lucide-react";

export interface MenuFilterBarProps {
  categories: Category[];
  selectedCategory?: string;
  currentSort?: string;
  initialSearch?: string;
}

export function MenuFilterBar({
  categories,
  selectedCategory,
  currentSort = "newest",
  initialSearch = "",
}: MenuFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategorySelect = (catId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId) {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/menu?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", newSort);
    router.push(`/menu?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q") as string;
    const params = new URLSearchParams(searchParams.toString());
    if (query?.trim()) {
      params.set("search", query.trim());
    } else {
      params.delete("search");
    }
    router.push(`/menu?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full sm:max-w-md flex items-center"
        >
          <Search className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none" />
          <input
            type="search"
            name="q"
            defaultValue={initialSearch}
            placeholder="ابحث بالاسم أو المكونات (كباب، كفتة، شاورما...)"
            className="w-full h-10 pr-9 pl-4 text-xs rounded-xl border border-input bg-card shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </form>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-10 px-3 text-xs font-semibold rounded-xl border border-input bg-card shadow-xs focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="newest">الترتيب: الأحدث</option>
            <option value="popular">الأكثر طلباً</option>
            <option value="rating">الأعلى تقييماً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => handleCategorySelect(undefined)}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            !selectedCategory
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          كافة الوجبات
        </button>

        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategorySelect(c.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {c.nameAr}
            </button>
          );
        })}
      </div>
    </div>
  );
}
