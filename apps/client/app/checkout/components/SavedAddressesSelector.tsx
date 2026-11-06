"use client";

import React from "react";
import type { DeliveryAddress } from "@workspace/types";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Phone,
  Home,
  Briefcase,
} from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

export interface SavedAddressesSelectorProps {
  addresses: DeliveryAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (address: DeliveryAddress) => void;
  onNewAddressClick: () => void;
  isNewAddressSelected: boolean;
}

export function SavedAddressesSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onNewAddressClick,
  isNewAddressSelected,
}: SavedAddressesSelectorProps) {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>اختر من عناوينك المحفوظة</span>
        </label>
        <span className="text-xs text-muted-foreground">
          ({addresses.length}{" "}
          {addresses.length === 1 ? "عنوان محفوظ" : "عناوين محفوظة"})
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected =
            !isNewAddressSelected && selectedAddressId === addr.id;
          const isWork =
            addr.title.includes("عمل") ||
            addr.title.toLowerCase().includes("work");

          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => onSelectAddress(addr)}
              className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2.5 relative ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                  : "border-border/60 hover:border-border bg-card/60 hover:bg-card"
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isWork ? (
                      <Briefcase className="w-4 h-4" />
                    ) : (
                      <Home className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-semibold text-sm text-foreground">
                    {addr.title}
                  </span>
                  {addr.isDefault && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      افتراضي
                    </Badge>
                  )}
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {addr.city} - {addr.area} - {addr.street} - مبنى {addr.building}
                {addr.floor ? ` - طابق ${addr.floor}` : ""}
                {addr.apartment ? ` - شقة ${addr.apartment}` : ""}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 mt-1">
                <Phone className="w-3 h-3 shrink-0" />
                <span dir="ltr">{addr.customerPhone}</span>
              </div>
            </button>
          );
        })}

        {/* Add new address card */}
        <button
          type="button"
          onClick={onNewAddressClick}
          className={`p-4 rounded-2xl border border-dashed text-right transition-all flex flex-col items-center justify-center gap-2 min-h-[110px] ${
            isNewAddressSelected
              ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary"
              : "border-border/80 hover:border-primary/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">
            استخدام عنوان توصيل جديد
          </span>
        </button>
      </div>
    </div>
  );
}
