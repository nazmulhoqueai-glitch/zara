"use client";

import { useMemo } from "react";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, increment, decrement, removeItem, clear, totals } = useCartStore();
  const list = useMemo(() => Object.values(items), [items]);
  const t = totals();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold">Your Cart ({t.itemCount})</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {list.length === 0 ? (
            <div className="text-center text-gray-600 py-16">Your cart is empty.</div>
          ) : (
            list.map((it) => (
              <div key={it.key} className="flex gap-3">
                <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                  {it.image && (
                    <Image src={it.image} alt={it.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 line-clamp-2">{it.name}</div>
                      <div className="text-xs text-gray-500">{it.size ? `Size ${it.size.toUpperCase()}` : ''} {it.color ? `• ${it.color}` : ''}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(it.key)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => decrement(it.key)}>
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{it.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => increment(it.key)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="font-semibold text-emerald-600">{Math.round(it.price).toLocaleString()} SAR</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">{Math.round(t.subtotal).toLocaleString()} SAR</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={clear}>Clear</Button>
            <a href="/cart" className="w-full">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">View Cart</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
