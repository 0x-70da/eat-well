"use client";

import { useState } from "react";
import type { Product } from "@workspace/types";
import Image from "next/image";
import { usePermission } from "@/hooks/usePermission";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductRawInput,
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
import { Plus, Trash2, Edit, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { updateProduct, deleteProduct } from "../requests/updateProduct";
import { createProduct } from "../requests/createProduct";

export interface ProductTableProps {
  products: Product[];
  categories: { id: string; nameAr: string }[];
}

export function ProductTable({ products: initialProducts, categories }: ProductTableProps) {
  const { can } = usePermission();
  const canCreate = can("products", "create");
  const canUpdate = can("products", "update");
  const canDelete = can("products", "delete");
  const canUpdateInventory = can("inventory", "update");
  const canToggleStock = canUpdate || canUpdateInventory;

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateProductRawInput, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      slug: "",
      descriptionAr: "",
      price: 0,
      categoryId: categories[0]?.id || "",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      prepTimeMinutes: 20,
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      spicyLevel: 0,
    },
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    reset({
      name: "",
      nameAr: "",
      slug: "",
      descriptionAr: "",
      price: 0,
      categoryId: categories[0]?.id || "",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      prepTimeMinutes: 20,
      isAvailable: true,
      isFeatured: false,
      isPopular: false,
      spicyLevel: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    reset({
      name: p.name,
      nameAr: p.nameAr,
      slug: p.slug,
      descriptionAr: p.descriptionAr || "",
      price: Number(p.price),
      categoryId: p.categoryId,
      image: p.image,
      prepTimeMinutes: p.prepTimeMinutes,
      isAvailable: p.isAvailable,
      isFeatured: p.isFeatured,
      isPopular: p.isPopular,
      spicyLevel: p.spicyLevel,
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (product: Product) => {
    const updatedStatus = !product.isAvailable;
    const res = await updateProduct(product.id, { isAvailable: updatedStatus });
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isAvailable: updatedStatus } : p)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من رغبتك في حذف هذه الوجبة؟")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const onFormSubmit = async (data: CreateProductInput) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, data);
        if (res.success && res.data) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? (res.data as Product) : p)),
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createProduct(data);
        if (res.success && res.data) {
          setProducts((prev) => [res.data as Product, ...prev]);
          setIsModalOpen(false);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          إجمالي الوجبات المتاحة: {products.length}
        </span>
        {canCreate && (
          <Button onClick={openCreateModal} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة وجبة جديدة</span>
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوجبة</TableHead>
                <TableHead>التصنيف</TableHead>
                <TableHead>السعر</TableHead>
                <TableHead>وقت التحضير</TableHead>
                <TableHead>التقييم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-center">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={p.image}
                          alt={p.nameAr}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <span className="block text-xs font-bold">{p.nameAr}</span>
                        <span className="block text-[11px] text-muted-foreground">{p.name}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{p.category?.nameAr || "عام"}</TableCell>
                  <TableCell className="text-xs font-bold text-primary">{p.price} ج.م</TableCell>
                  <TableCell className="text-xs">{p.prepTimeMinutes} دقيقة</TableCell>
                  <TableCell className="text-xs">★ {p.rating}</TableCell>
                  <TableCell>
                    {canToggleStock ? (
                      <button
                        onClick={() => handleToggleAvailability(p)}
                        className="cursor-pointer"
                      >
                        {p.isAvailable ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>متاح</span>
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            <span>غير متوفر</span>
                          </Badge>
                        )}
                      </button>
                    ) : p.isAvailable ? (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>متاح</span>
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        <span>غير متوفر</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      {canUpdate && (
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => openEditModal(p)}
                          title="تعديل"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => handleDelete(p.id)}
                          title="حذف"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {!canUpdate && !canDelete && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
            noValidate
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">
                {editingProduct ? "تعديل بيانات الوجبة" : "إضافة وجبة جديدة للقائمة"}
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
                <label className="mb-1 block font-semibold">اسم الوجبة بالعربية *</label>
                <input
                  type="text"
                  {...register("nameAr", {
                    onChange: (e) => {
                      if (!editingProduct) {
                        setValue("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"), {
                          shouldValidate: true,
                        });
                      }
                    },
                  })}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="مثال: شيش طاووق مشوي على الفحم"
                />
                {errors.nameAr && (
                  <p className="mt-1 text-xs text-destructive">{errors.nameAr.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-semibold">اسم الوجبة بالإنجليزية *</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("name")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="e.g. Charcoal Grilled Shish Tawook"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-semibold">الرابط اللطيف (Slug) *</label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("slug")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="charcoal-grilled-shish-tawook"
                />
                {errors.slug && (
                  <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-semibold">السعر (ج.م) *</label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("price")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                    placeholder="180"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block font-semibold">التصنيف *</label>
                  <select
                    {...register("categoryId")}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-xs text-destructive">{errors.categoryId.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block font-semibold">رابط الصورة (URL) *</label>
                <input
                  type="url"
                  dir="ltr"
                  {...register("image")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                  placeholder="https://images.unsplash.com/..."
                />
                {errors.image && (
                  <p className="mt-1 text-xs text-destructive">{errors.image.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block font-semibold">وصف الوجبة بالعربية</label>
                <textarea
                  rows={3}
                  {...register("descriptionAr")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="مكونات الوجبة وطريقة التحضير وما يقدم معها..."
                />
              </div>

              <div>
                <label className="mb-1 block font-semibold">وقت التحضير التقريبي (بالدقائق)</label>
                <input
                  type="number"
                  {...register("prepTimeMinutes")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.prepTimeMinutes && (
                  <p className="mt-1 text-xs text-destructive">{errors.prepTimeMinutes.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
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
                    <Loader2 className="ml-1 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  "حفظ الوجبة"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
