"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useLocale } from "@/i18n/LocaleProvider";

export default function CartPage() {
  const { t, locale } = useLocale();
  const { items, increment, decrement, removeItem, clear, totals } = useCartStore();
  const list = Object.values(items);
  const t_totals = totals();

  const formatPrice = (price: number) => {
    if (locale === 'ar') {
      return `${price} ${t('currency_sar')}`
    }
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const subtotal = t_totals.subtotal;
  const shipping = subtotal > 200 ? 0 : 25; // Free shipping over 200 SAR
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Link href="/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2"/>
                {t('continue_shopping')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{t('your_cart')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
          {list.length === 0 ? (
            <div className="p-8 text-center text-gray-600">{t('cart_empty')}</div>
          ) : (
            <ul className="divide-y">
              {list.map((it) => (
                <li key={it.key} className="p-4 flex gap-4">
                  <div className="relative w-20 h-28 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    {it.image && <Image src={it.image} alt={it.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{it.name}</div>
                        <div className="text-xs text-gray-500">
                          {it.size ? `${t('size')} ${it.size.toUpperCase()}` : ''} 
                          {it.size && it.color ? ' • ' : ''}
                          {it.color ? `${it.color}` : ''}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(it.key)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => decrement(it.key)}>
                          <Minus className="w-4 h-4"/>
                        </Button>
                        <span className="w-10 text-center">{it.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => increment(it.key)}>
                          <Plus className="w-4 h-4"/>
                        </Button>
                      </div>
                      <div className="font-semibold text-emerald-600">
                        {formatPrice(it.price * it.quantity)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {list.length > 0 && (
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={clear}>{t('clear_cart')}</Button>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4 h-fit">
          <h2 className="text-lg font-semibold">{t('order_summary')}</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span className="font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('shipping')}</span>
            <span className="font-semibold">
              {shipping === 0 ? (
                <span className="text-emerald-600">{t('free')}</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t('tax_vat')}</span>
            <span className="font-semibold">{formatPrice(tax)}</span>
          </div>
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="font-semibold">{t('total')}</span>
            <span className="font-bold text-emerald-600">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="block">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              {t('proceed_to_checkout')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
