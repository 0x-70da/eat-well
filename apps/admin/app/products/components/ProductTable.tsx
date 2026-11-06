"use client";

import { useState } from "react";
import type { Product } from "@workspace/types";
import Image from "next/image";
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
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { updateProduct, deleteProduct } from "../requests/updateProduct";
import { createProduct } from "../requests/createProduct";

export interface ProductTableProps {
  products: Product[];
  categories: { id: string; nameAr: string }[];
}

export function ProductTable({
  products: initialProducts,
  categories,
}: ProductTableProps) {
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
        prev.map((p) =>
          p.id === product.id ? { ...p, isAvailable: updatedStatus } : p,
        ),
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
            prev.map((p) =>
              p.id === editingProduct.id ? (res.data as Product) : p,
            ),
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
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          إجمالي الوجبات المتاحة: {products.length}
        </span>
        <Button onClick={openCreateModal} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>إضافة وجبة جديدة</span>
        </Button>
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
                      <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-muted">
                        <Image
                          src={p.image}
                          alt={p.nameAr}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-xs block">
                          {p.nameAr}
                        </span>
                        <span className="text-[11px] text-muted-foreground block">
                          {p.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.category?.nameAr || "عام"}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-primary">
                    {p.price} ج.م
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.prepTimeMinutes} دقيقة
                  </TableCell>
                  <TableCell className="text-xs">★ {p.rating}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleAvailability(p)}
                      className="cursor-pointer"
                    >
                      {p.isAvailable ? (
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>متاح</span>
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>غير متوفر</span>
                        </Badge>
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => openEditModal(p)}
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        onClick={() => handleDelete(p.id)}
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

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
            noValidate
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">
                {editingProduct
                  ? "تعديل بيانات الوجبة"
                  : "إضافة وجبة جديدة للقائمة"}
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
                  اسم الوجبة بالعربية *
                </label>
                <input
                  type="text"
                  {...register("nameAr", {
                    onChange: (e) => {
                      if (!editingProduct) {
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
                  placeholder="مثال: شيش طاووق مشوي على الفحم"
                />
                {errors.nameAr && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.nameAr.message}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  اسم الوجبة بالإنجليزية *
                </label>
                <input
                  type="text"
                  dir="ltr"
                  {...register("name")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="e.g. Charcoal Grilled Shish Tawook"
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
                  placeholder="charcoal-grilled-shish-tawook"
                />
                {errors.slug && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">
                    السعر (ج.م) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    {...register("price")}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                    placeholder="180"
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-semibold block mb-1">التصنيف *</label>
                  <select
                    {...register("categoryId")}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-xs text-destructive mt-1">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  رابط الصورة (URL) *
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
                <label className="font-semibold block mb-1">
                  وصف الوجبة بالعربية
                </label>
                <textarea
                  rows={3}
                  {...register("descriptionAr")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="مكونات الوجبة وطريقة التحضير وما يقدم معها..."
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  وقت التحضير التقريبي (بالدقائق)
                </label>
                <input
                  type="number"
                  {...register("prepTimeMinutes")}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                />
                {errors.prepTimeMinutes && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.prepTimeMinutes.message}
                  </p>
                )}
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
