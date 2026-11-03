"use client";

import { useState } from "react";
import type { Category } from "@workspace/types";
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
import { createCategory, updateCategory, deleteCategory } from "../requests/createCategory";

export interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories: initialCategories }: CategoryTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setNameAr("");
    setSlug("");
    setDescriptionAr("");
    setImage("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80");
    setSortOrder((categories.length + 1).toString());
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setNameAr(c.nameAr);
    setSlug(c.slug);
    setDescriptionAr(c.descriptionAr || "");
    setImage(c.image || "");
    setSortOrder(c.sortOrder.toString());
    setIsModalOpen(true);
  };

  const handleToggleActive = async (c: Category) => {
    const updated = !c.isActive;
    const res = await updateCategory(c.id, { isActive: updated });
    if (res.success) {
      setCategories((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, isActive: updated } : item)),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, {
          name,
          nameAr,
          slug,
          descriptionAr,
          image,
          sortOrder: Number(sortOrder),
        });
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? (res.data as Category) : c)),
          );
          setIsModalOpen(false);
        }
      } else {
        const res = await createCategory({
          name,
          nameAr,
          slug,
          descriptionAr,
          image,
          sortOrder: Number(sortOrder),
          isActive: true,
        });
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
                        <span className="font-bold text-xs block">{c.nameAr}</span>
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
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold">
                {editingCategory ? "تعديل بيانات التصنيف" : "إضافة تصنيف طعام جديد"}
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
                <label className="font-semibold block mb-1">اسم التصنيف بالعربية *</label>
                <input
                  type="text"
                  required
                  value={nameAr}
                  onChange={(e) => {
                    setNameAr(e.target.value);
                    if (!editingCategory && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="مثال: طواجن فخار"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">اسم التصنيف بالإنجليزية *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="e.g. Clay Tagines"
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
                  placeholder="clay-tagines"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">رابط صورة التصنيف (URL)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">ترتيب العرض</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">الوصف بالعربية</label>
                <textarea
                  rows={2}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
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
                {isSubmitting ? "جاري الحفظ..." : "حفظ التصنيف"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
