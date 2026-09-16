import React, { useState } from 'react';
import { ShoppingBag, CheckCircle2, Clock, MapPin, Check, Sparkles, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TalabatCardItem {
  id?: string;
  title?: string;
  titleAr?: string;
  price?: number;
  currency?: string;
  vendorName?: string;
  vendorNameAr?: string;
  deliveryTimeMinutes?: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

export interface TalabatProtocolCardProps {
  data: {
    action?: 'catalog' | 'order' | 'quote';
    vendorName?: string;
    itemName?: string;
    price?: number;
    currency?: string;
    estimatedDeliveryMinutes?: number;
    status?: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
    orderId?: string;
    deliveryAddress?: string;
    imageUrl?: string;
    items?: TalabatCardItem[];
  };
}

export const TalabatProtocolCard: React.FC<TalabatProtocolCardProps> = ({ data }) => {
  const [orderConfirmed, setOrderConfirmed] = useState(data.status === 'ACCEPTED' || Boolean(data.orderId));
  const [isExecuting, setIsExecuting] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState(data.orderId || `TB-${Math.floor(100000 + Math.random() * 900000)}`);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const handleConfirmOrder = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setOrderConfirmed(true);
    }, 600);
  };

  const primaryItem = data.items && data.items.length > 0 ? data.items[0] : null;
  const vendorTitle = data.vendorName || primaryItem?.vendorNameAr || primaryItem?.vendorName || 'طلبات مارت / مطعم معتمد';
  const itemTitle = data.itemName || primaryItem?.titleAr || primaryItem?.title || 'طلب وجبة عبر بروتوكول طلبات';
  const priceVal = data.price || primaryItem?.price || 145;
  const currencyVal = data.currency || primaryItem?.currency || 'EGP';
  const deliveryMins = data.estimatedDeliveryMinutes || primaryItem?.deliveryTimeMinutes || 25;
  const itemImage = data.imageUrl || primaryItem?.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full max-w-xl my-3 rounded-2xl bg-[#0c0c10] border border-white/[0.08] overflow-hidden shadow-xl text-right select-none"
      dir="rtl"
    >
      {/* Header Bar */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-orange-400 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white font-sans">بروتوكول طلبات الذكي</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-zinc-800 text-orange-300 border border-white/10">
                Talabat MCP
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-sans block mt-0.5">
              استدعاء مباشر وموثق لقوائم الطعام وتنفيذ الطلبات
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
          <Clock className="w-3.5 h-3.5 text-orange-400" />
          <span>{deliveryMins} دقيقة</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-3.5">
        {/* Item Card Banner */}
        <div className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <img
            src={itemImage}
            alt={itemTitle}
            className="size-18 sm:size-20 rounded-xl object-cover bg-zinc-900 border border-white/10 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-orange-400 truncate">
                {vendorTitle}
              </span>
              <span className="text-sm font-black text-white font-mono shrink-0">
                {priceVal * selectedQuantity} {currencyVal}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white font-sans mt-0.5 leading-snug line-clamp-1">
              {itemTitle}
            </h4>
            <p className="text-xs text-zinc-400 font-sans line-clamp-2 mt-1 leading-relaxed">
              {primaryItem?.description || 'وجبة طازجة جاهزة للإعداد والتوصيل الفوري إلى موقعك عبر أسطول طلبات.'}
            </p>
          </div>
        </div>

        {/* Additional Multi-Items List (if catalog action) */}
        {data.items && data.items.length > 1 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-semibold text-zinc-400 block font-sans">
              أصناف أخرى متوفرة في نفس الفرع:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.items.slice(1, 3).map((it, idx) => (
                <div
                  key={it.id || idx}
                  className="p-2 rounded-lg bg-black/30 border border-white/[0.05] flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-300 font-sans truncate">{it.titleAr || it.title}</span>
                  <span className="font-mono text-orange-300 font-bold shrink-0">{it.price} {it.currency || 'EGP'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Status Confirmation Alert */}
        <AnimatePresence>
          {orderConfirmed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-sans space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تم تأكيد الطلب بنجاح عبر بروتوكول طلبات!</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  مقبول • قيد التحضير
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-300 pt-1 border-t border-emerald-500/20">
                <span>رقم الطلب المباشر: <strong className="font-mono text-white">{generatedOrderId}</strong></span>
                <span>التوصيل المقدر: <strong className="font-mono text-emerald-300">{deliveryMins} دقيقة</strong></span>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-sans">الكمية:</span>
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="size-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 font-mono text-xs font-bold text-white">{selectedQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="size-6 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isExecuting}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold font-sans transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>جارٍ إرسال الطلب عبر MCP...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تأكيد الطلب الفوري عبر Talabat MCP</span>
                  </>
                )}
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-black/40 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-zinc-400 font-sans">
        <span className="font-mono text-zinc-400">
          Delivery Hero • Talabat Partner Protocol v2.0.2
        </span>
        <span className="text-emerald-400/90 flex items-center gap-1 font-sans">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          متصل ومصادق تلقائياً
        </span>
      </div>
    </motion.div>
  );
};
