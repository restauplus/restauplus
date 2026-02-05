"use client";

import { useLanguage } from "@/context/language-context";

export function OrdersHeader() {
    const { t } = useLanguage();

    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-1">{t('ordersPage.title')}</h2>
            <p className="text-sm text-slate-400">{t('ordersPage.subtitle')}</p>
        </div>
    );
}
