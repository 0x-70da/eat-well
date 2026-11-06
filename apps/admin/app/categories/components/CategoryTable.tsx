"use client";

import { useState } from "react";
import type { Category } from "@workspace/types";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  type CreateCategoryInput,
  type CreateCategoryRawInput,
} from "@workspace/validation";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../requests/createCategory";

export interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({
  categories: initialCategories,
}: CategoryTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateCategoryRawInput, unknown, CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      nameAr: "",
      slug: "",
      descriptionAr: "",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      sortOrder: initialCategories.length + 1,
      isActive: true,
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({
      name: "",
      nameAr: "",
      slug: "",
      descriptionAr: "",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      sortOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    reset({
      name: c.name,
      nameAr: c.nameAr,
      slug: c.slug,
      descriptionAr: c.descriptionAr || "",
      image: c.image || "",
      sortOrder: c.sortOrder,
      isActive: c.isActive,
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (c: Category) => {
    const updated = !c.isActive;
    const res = await updateCategory(c.id, { isActive: updated });
    if (res.success) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, isActive: updated } : item,
        ),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذا التصنيف؟")) return;
    const res = await deleteCategory(id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const onFormSubmit = async (data: CreateCategoryInput) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, data);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id ? (res.data as Category) : c,
            ),
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createCategory(data);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data as Category]);
          setIsModalOpen(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          إجمالي التصنيفات: {categories.length}
        </span>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>إضافة تصنيف جديد</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>التصنيف</TableHead>
                <TableHead>الرابط اللطيف</TableHead>
                <TableHead>عدد الوجبات</TableHead>
                <TableHead>الترتيب</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-muted">
                        {c.image ? (
                          <Image
                            src={c.image}
                            alt={c.nameAr}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : null}
                      </div>
                      <div>
                        <span className="font-bold text-xs block">
                          {c.nameAr}
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          {c.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.slug}
                  </TableCell>
                  <TableCell className="font-semibold text-xs">
                    {c.productCount || 0} وجبة
                  </TableCell>
                  <TableCell className="text-xs">{c.sortOrder}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleActive(c)}
                      className="cursor-pointer"
                    >
                      {c.isActive ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>مفعل</span>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>معطل</span>
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => openEditModal(c)}
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => handleDelete(c.id)}
                        title="حذف"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
            noValidate
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">
                {editingCategory
                  ? "تعديل بيانات التصنيف"
                  : "إضافة تصنيف طعام جديد"}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  اسم التصنيف بالعربية *
                </label>
                <input
                  type="text"
                  {...register("nameAr", {
                    onChange: (e) => {
                      if (!editingCategory) {
                        setValue(
                          "slug",
                          e.target.value.toLowerCase().replace(/\s+/g, "-"),
                          {
                            shouldValidate: true,
                          },
                        );
                      }
                    },
                  })}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="مثال: طواجن فخار"
                />
                {errors.nameAr && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.nameAr.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  اسم التصنيف بالإنجليزية *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("name")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="e.g. Clay Tagines"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  الرابط اللطيف (Slug) *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("slug")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="clay-tagines"
                />
                {errors.slug && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  رابط صورة التصنيف (URL)
                </label>
                <input
                  type="url"
                  dir="ltr"
                  {...register("image")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="https://images.unsplash.com/..."
                />
                {errors.image && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">ترتيب العرض</label>
                <input
                  type="number"
                  {...register("sortOrder")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.sortOrder && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.sortOrder.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  الوصف بالعربية
                </label>
                <textarea
                  rows={2}
                  {...register("descriptionAr")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="وصف مختصر للتصنيف..."
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ التصنيف"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
