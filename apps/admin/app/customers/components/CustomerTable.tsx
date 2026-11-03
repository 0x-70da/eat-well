"use client";

import type { CustomerSummary } from "@workspace/types";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { UserCheck } from "lucide-react";

export interface CustomerTableProps {
  customers: CustomerSummary[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        {customers.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            لا يوجد عملاء مسجلين حالياً
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العميل</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>عدد الطلبات</TableHead>
                <TableHead>إجمالي الإنفاق</TableHead>
                <TableHead>تاريخ التسجيل</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-xs">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {c.email}
                  </TableCell>
                  <TableCell className="font-semibold text-xs">
                    {c.ordersCount} طلب
                  </TableCell>
                  <TableCell className="font-bold text-xs text-primary">
                    {c.totalSpent} ج.م
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("ar-EG")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
