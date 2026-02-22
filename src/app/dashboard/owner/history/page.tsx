"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, Printer, History as HistoryIcon, FileText, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
    const supabase = createClient();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currencySymbol, setCurrencySymbol] = useState("$");
    const [restaurantInfo, setRestaurantInfo] = useState<any>(null);

    const getCurrencySymbol = (code: string) => {
        if (code === 'QAR') return 'QR';
        if (code === 'MAD') return 'DH';
        return '$';
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase.from('profiles').select('restaurant_id').eq('id', user.id).single();
        if (!profile?.restaurant_id) return;

        const { data: restaurant } = await supabase.from('restaurants').select('*').eq('id', profile.restaurant_id).single();
        if (restaurant) {
            setRestaurantInfo(restaurant);
            if (restaurant.currency) {
                setCurrencySymbol(getCurrencySymbol(restaurant.currency));
            }
        }

        const { data } = await supabase
            .from('orders')
            .select(`
                *,
                tables ( number ),
                order_items (
                    quantity,
                    notes,
                    price_at_time,
                    menu_items ( name, price )
                )
            `)
            .eq('restaurant_id', profile.restaurant_id)
            .order('created_at', { ascending: false });

        if (data) setOrders(data);
        setLoading(false);
    };

    const filtered = orders.filter(o =>
        o.customer_phone?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.includes(search)
    );

    const parseItemDetails = (notes: string | undefined | null) => {
        if (!notes) return { note: '', variants: [] };
        try {
            const parsed = JSON.parse(notes);
            if (typeof parsed === 'object' && parsed !== null) {
                return {
                    note: parsed.note || '',
                    variants: parsed.variants || []
                };
            }
        } catch (e) {
            return { note: notes, variants: [] };
        }
        return { note: notes, variants: [] };
    };

    const handlePrintInvoice = (order: any) => {
        const existingIframe = document.getElementById('record-print-frame');
        if (existingIframe) existingIframe.remove();

        const iframe = document.createElement('iframe');
        iframe.id = 'record-print-frame';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        const dateObj = new Date(order.created_at);
        const dateString = dateObj.toLocaleDateString();
        const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const receiptHTML = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Restaurant Receipt</title>
                    <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Work Sans', sans-serif;
                            margin: 0;
                            padding: 0;
                            width: 100%;
                            background: #fff;
                            color: #000;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }

                        @page { margin: 0; size: auto; }

                        .receipt-container {
                            width: 100%;
                            max-width: 100%;
                            margin: 0 auto;
                            padding: 20px 10px;
                            box-sizing: border-box;
                        }

                        /* HEADER SECTION */
                        .header {
                            text-align: center;
                            margin-bottom: 15px;
                        }
                        .logo-container img {
                            max-width: 120px;
                            height: auto;
                            display: block;
                            margin: 0 auto 10px auto;
                        }
                        .restaurant-name {
                            font-size: 24px;
                            font-weight: 900;
                            text-transform: uppercase;
                            letter-spacing: -0.5px;
                            line-height: 1.1;
                            margin-bottom: 5px;
                        }
                        .restaurant-info {
                            font-size: 11px;
                            color: #333;
                            line-height: 1.4;
                            font-weight: 500;
                            max-width: 80%;
                            margin: 0 auto;
                        }

                        /* DIVIDER */
                        .divider-thick {
                            border-top: 3px solid #000;
                            margin: 15px 0;
                        }
                        .divider-thin {
                            border-top: 1px solid #ddd;
                            margin: 10px 0;
                        }

                        /* META SECTION */
                        .meta-grid {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 15px;
                            font-size: 12px;
                            font-weight: 600;
                        }
                        .order-number {
                            font-size: 16px;
                            font-weight: 900;
                        }
                        .order-type-badge {
                            background: #000;
                            color: #fff;
                            padding: 4px 8px;
                            border-radius: 4px;
                            font-weight: 800;
                            text-transform: uppercase;
                            font-size: 11px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }

                        /* CUSTOMER INFO */
                        .customer-section {
                            margin-bottom: 20px;
                            text-align: center;
                        }
                        .customer-name {
                            font-size: 18px;
                            font-weight: 800;
                            text-transform: uppercase;
                            border: 2px solid #000;
                            display: inline-block;
                            padding: 5px 15px;
                            border-radius: 50px; /* Pill shape */
                            background: #fff;
                        }

                        /* ITEMS TABLE */
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        .items-table th {
                            text-align: left;
                            font-size: 10px;
                            text-transform: uppercase;
                            color: #666;
                            padding-bottom: 8px;
                            border-bottom: 1px solid #000;
                        }
                        .items-table td {
                            padding: 8px 0;
                            vertical-align: top;
                            font-size: 13px;
                            border-bottom: 1px dashed #eee;
                        }
                        .col-qty { width: 30px; font-weight: 800; text-align: center; }
                        .col-desc { padding-left: 10px; font-weight: 600; }
                        .col-price { text-align: right; font-family: 'Space Mono', monospace; font-weight: 700; }

                        .item-note {
                            display: block;
                            font-size: 10px;
                            color: #666;
                            font-style: italic;
                            margin-top: 2px;
                        }

                        /* TOTAL SECTION */
                        .total-section {
                            background: #f5f5f5;
                            padding: 15px;
                            border-radius: 8px;
                            margin-bottom: 20px;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .total-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-weight: 900;
                            font-size: 18px;
                        }
                        .sub-row {
                            display: flex;
                            justify-content: space-between;
                            font-size: 11px;
                            color: #666;
                            margin-bottom: 5px;
                        }

                        /* QR CODE AREA */
                        .qr-section {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .qr-code {
                            width: 80px;
                            height: 80px;
                            margin: 0 auto 10px auto;
                        }

                        /* FOOTER */
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                        }
                        .thank-you {
                            font-family: 'Space Mono', monospace;
                            font-weight: 700;
                            font-size: 14px;
                            text-transform: uppercase;
                            margin-bottom: 5px;
                        }
                        .footer-msg {
                            font-size: 10px;
                            color: #666;
                            max-width: 80%;
                            margin: 0 auto 20px auto;
                        }
                        .powered-by {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 9px;
                            font-weight: 700;
                            text-transform: uppercase;
                            opacity: 0.6;
                            gap: 5px;
                        }
                        .brand-dot {
                            width: 4px;
                            height: 4px;
                            background: #000;
                            border-radius: 50%;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">

                        <!-- HEADER -->
                        <div class="header">
                            <div class="logo-container">
                                ${restaurantInfo?.logo_url ? `<img src="${restaurantInfo.logo_url}" alt="Logo" />` : ''}
                            </div>
                            <div class="restaurant-name">${restaurantInfo?.name || 'Restaurant'}</div>
                            ${restaurantInfo?.address || restaurantInfo?.phone ? `
                                <div class="restaurant-info">
                                    ${restaurantInfo?.address ? `${restaurantInfo.address}<br/>` : ''}
                                    ${restaurantInfo?.phone ? `Tel: ${restaurantInfo.phone}` : ''}
                                </div>
                            ` : ''}
                        </div>

                        <div class="divider-thick"></div>

                        <!-- META INFO -->
                        <div class="meta-grid">
                            <div>
                                <div class="order-number">#${order.id.slice(0, 4)}</div>
                                <div style="font-weight: 400; color: #555; font-size: 10px;">${dateString} • ${timeString}</div>
                            </div>
                            <div class="order-type-badge">${(order.order_type || 'DINE IN').replace('_', ' ')}</div>
                        </div>

                        <!-- CUSTOMER NAME PILL -->
                        ${order.customer_phone ? `
                            <div class="customer-section">
                                <div class="customer-name">${order.customer_phone}</div>
                            </div>
                        ` : ''}

                        <!-- ITEMS -->
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th class="col-qty">#</th>
                                    <th class="col-desc">ITEM</th>
                                    <th class="col-price">PRICE</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.order_items.map((item: any) => {
            const { note, variants } = parseItemDetails(item.notes);

            // Construct Variants HTML
            const variantsHtml = variants.length > 0 ?
                `<div style="font-size: 9px; margin-top: 2px; color: #444;">${variants.map((v: any) =>
                    `<span style="display:inline-block; background:#eee; padding: 1px 4px; border-radius: 3px; margin-right: 2px;">
                                                ${v.groupName ? `<span style="color:#666; margin-right:2px">${v.groupName}:</span>` : '+ '}
                                                ${v.name}
                                            </span>`
                ).join('')}</div>` : '';

            // Construct Note HTML
            const noteHtml = note ?
                `<div class="item-note" style="margin-top:2px;">Note: ${note}</div>` : '';

            return `
                                        <tr>
                                            <td class="col-qty">${item.quantity}</td>
                                            <td class="col-desc">
                                                <div style="font-weight:700;">${item.menu_items?.name || 'Unknown Item'}</div>
                                                ${variantsHtml}
                                                ${noteHtml}
                                            </td>
                                            <td class="col-price">${(item.price_at_time || item.menu_items?.price || 0).toFixed(2)}</td>
                                        </tr>
                                    `;
        }).join('')}
                            </tbody>
                        </table>

                        <!-- TOTAL -->
                        <div class="total-section">
                            <div class="sub-row">
                                <span>Subtotal</span>
                                <span>${currencySymbol} ${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                            <div class="divider-thin"></div>
                            <div class="total-row">
                                <span>TOTAL</span>
                                <span>${currencySymbol} ${Number(order.total_amount).toFixed(2)}</span>
                            </div>
                        </div>

                        <!-- QR CODE (Dynamic) -->
                        ${restaurantInfo?.website ? `
                            <div class="qr-section">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(restaurantInfo.website)}" class="qr-code" alt="QR Code"/>
                                <div style="font-size: 9px; font-weight: 600;">SCAN TO VISIT US</div>
                            </div>
                        ` : ''}

                        <!-- FOOTER -->
                        <div class="footer">
                            <div class="thank-you">Thank You!</div>
                            <div class="footer-msg">We hope to serve you again soon.</div>

                            <div class="powered-by" style="display: flex; align-items: center; justify-content: center; opacity: 0.6;">
                                <span style="font-weight: 800; letter-spacing: 0.5px; margin-right: 4px;">POWERED BY</span>
                                <img src="${window.location.origin}/logo.png" style="height: 12px; filter: brightness(0);" alt="R+" />
                                <span style="font-weight: 800; letter-spacing: 0.5px; margin-left: 4px;">RESTAU PLUS</span>
                            </div>
                        </div>

                    </div>
                    <script>
                        window.onload = function() { window.print(); window.close(); }
                    </script>
                </body>
            </html>
        `;

        if (iframe.contentWindow) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(receiptHTML);
            iframe.contentWindow.document.close();
            setTimeout(() => {
                if (iframe.contentWindow) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }
            }, 500);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-black min-h-screen text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                        Order <span className="text-indigo-400">History</span>
                    </h1>
                    <p className="text-zinc-500 font-medium">Browse past orders and print professional factures.</p>
                </div>
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                    <Input
                        placeholder="Search by phone or Order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-zinc-900/40 border-white/5 focus:ring-1 focus:ring-indigo-500/50 pl-12 h-12 rounded-2xl text-md placeholder:text-zinc-600 shadow-xl backdrop-blur-md"
                    />
                </div>
            </div>

            {/* Content List */}
            <div className="relative z-10 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50 animate-pulse">
                        <HistoryIcon className="w-16 h-16 text-zinc-700 mb-4" />
                        <p className="text-xl font-bold text-zinc-600 tracking-widest uppercase">Loading Archive...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm shadow-xl">
                        <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <FileText className="w-8 h-8 text-zinc-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-400 mb-2">No Records Found</h3>
                        <p className="text-zinc-600">There are no completed orders matching your search.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filtered.map(order => (
                            <Card key={order.id} className="bg-zinc-900/40 backdrop-blur-md border border-white/5 hover:border-indigo-500/30 transition-all duration-300 overflow-hidden group">
                                <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                                    {/* Left Area: Meta */}
                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 bg-indigo-500/10 font-mono">
                                                #{order.id.slice(0, 8)}
                                            </Badge>
                                            <Badge className={cn("border-0 font-bold", order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400')}>
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                {order.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 font-bold shadow-sm">
                                                {order.customer_phone ? 'P' : '?'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg text-white leading-tight">{order.customer_phone || 'Walk-in Guest'}</span>
                                                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Area: Items Summary */}
                                    <div className="flex-1 w-full bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div className="text-sm text-zinc-300 font-medium leading-relaxed max-h-24 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                                            {order.order_items.map((i: any) => {
                                                const { variants, note } = parseItemDetails(i.notes);
                                                const variantText = variants.length > 0 ? ` (+ ${variants.map((v: any) => v.name).join(', ')})` : '';
                                                return (
                                                    <div key={i.id} className="flex flex-col">
                                                        <div className="flex items-center text-sm">
                                                            <span className="w-6 font-black text-indigo-400 bg-indigo-500/10 rounded px-1 text-center mr-2">{i.quantity}x</span>
                                                            <span className="font-semibold text-zinc-200">{i.menu_items?.name}</span>
                                                        </div>
                                                        {variantText && <div className="pl-8 text-xs text-zinc-500">{variantText}</div>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Right Area: Action & Price */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto gap-4 md:gap-3 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-normal text-zinc-500">{currencySymbol}</span>
                                            <span className="text-3xl font-black text-white tracking-tight">{Number(order.total_amount).toFixed(2)}</span>
                                        </div>
                                        <Button
                                            onClick={() => handlePrintInvoice(order)}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.2)] md:w-32 group/btn"
                                        >
                                            <Printer className="w-4 h-4 mr-2 opacity-70 group-hover/btn:opacity-100 transition-opacity" />
                                            Facture
                                        </Button>
                                    </div>

                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
