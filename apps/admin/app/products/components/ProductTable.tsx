"use client";

import { useState } from "react";
import type { Product } from "@workspace/types";
import Image from "next/image";
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
import { Plus, Trash2, Edit, CheckCircle2, XCircle } from "lucide-react";
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

  // Form states
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [image, setImage] = useState("");
  const [prepTimeMinutes, setPrepTimeMinutes] = useState("20");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setNameAr("");
    setSlug("");
    setDescriptionAr("");
    setPrice("");
    setCategoryId(categories[0]?.id || "");
    setImage("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80");
    setPrepTimeMinutes("20");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setNameAr(p.nameAr);
    setSlug(p.slug);
    setDescriptionAr(p.descriptionAr || "");
    setPrice(p.price.toString());
    setCategoryId(p.categoryId);
    setImage(p.image);
    setPrepTimeMinutes(p.prepTimeMinutes.toString());
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, {
          name,
          nameAr,
          slug,
          descriptionAr,
          price: Number(price),
          categoryId,
          image,
          prepTimeMinutes: Number(prepTimeMinutes),
        });
        if (res.success && res.data) {
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? (res.data as Product) : p)),
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createProduct({
          name,
          nameAr,
          slug,
          descriptionAr,
          price: Number(price),
          categoryId,
          image,
          prepTimeMinutes: Number(prepTimeMinutes),
          isAvailable: true,
          isFeatured: false,
          isPopular: false,
          spicyLevel: 0,
        });
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
                        <span className="font-bold text-xs block">{p.nameAr}</span>
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
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
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
                <label className="font-semibold block mb-1">اسم الوجبة بالعربية *</label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => {
                    setNameAr(e.target.value);
                    if (!editingProduct && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="مثال: شيش طاووق مشوي على الفحم"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">اسم الوجبة بالإنجليزية *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="e.g. Charcoal Grilled Shish Tawook"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">الرابط اللطيف (Slug) *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="charcoal-grilled-shish-tawook"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">السعر (ج.م) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                    placeholder="180"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">التصنيف *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">رابط الصورة (URL) *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">وصف الوجبة بالعربية</label>
                <textarea
                  rows={3}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  placeholder="مكونات الوجبة وطريقة التحضير وما يقدم معها..."
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">وقت التحضير التقريبي (بالدقائق)</label>
                <input
                  type="number"
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
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
                {isSubmitting ? "جاري الحفظ..." : "حفظ الوجبة"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
