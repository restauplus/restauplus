"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    // Fetch Restaurant Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('restaurant_id, role, full_name, status')
        .eq('id', user.id)
        .single();

    if (!profile?.restaurant_id) {
        throw new Error("No restaurant found");
    }

    const restaurantId = profile.restaurant_id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    // Parallel Data Fetching - EVERYTHING at once
    const [
        { count: activeOrdersCount },
        { data: pendingOrders },
        { count: totalOrdersToday },
        { count: totalOrdersAllTime },
        { data: todayRevenueOrders },
        { data: allTimeRevenueOrders },
        { data: weeklyOrders },
        { data: topSellingData },
        { data: monthlyOrders },
        { data: yearlyOrders },
        { data: recentOrders },
        { data: restaurant }
    ] = await Promise.all([
        // 1. Active Orders Count
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurantId)
            .neq('status', 'served')
            .neq('status', 'cancelled')
            .neq('status', 'paid'),

        // 2. Pending Orders (for Pending Income)
        supabase
            .from('orders')
            .select('total_amount, status')
            .eq('restaurant_id', restaurantId)
            .in('status', ['pending', 'preparing', 'ready', 'served']),

        // 3. Total Orders Today
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurantId)
            .gte('created_at', today.toISOString())
            .neq('status', 'cancelled'),

        // 4. Total Orders All Time
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('restaurant_id', restaurantId)
            .neq('status', 'cancelled'),

        // 5. Daily Revenue Orders
        supabase
            .from('orders')
            .select('total_amount')
            .eq('restaurant_id', restaurantId)
            .eq('status', 'paid')
            .gte('created_at', today.toISOString()),

        // 6. Total Revenue (All Time)
        supabase
            .from('orders')
            .select('total_amount')
            .eq('restaurant_id', restaurantId)
            .eq('status', 'paid'),

        // 7. Weekly Orders (Chart)
        supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('restaurant_id', restaurantId)
            .eq('status', 'paid')
            .gte('created_at', sevenDaysAgo.toISOString()),

        // 8. Top Selling Items
        supabase
            .from('order_items')
            .select('quantity, menu_items(name, price)')
            .eq('restaurant_id', restaurantId),

        // 9. Monthly Orders
        supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('restaurant_id', restaurantId)
            .eq('status', 'paid')
            .gte('created_at', startOfMonth.toISOString()),

        // 10. Yearly Orders
        supabase
            .from('orders')
            .select('total_amount, created_at')
            .eq('restaurant_id', restaurantId)
            .eq('status', 'paid')
            .gte('created_at', startOfYear.toISOString()),

        // 11. Recent Activity
        supabase
            .from('orders')
            .select('customer_phone, table_number, created_at, status')
            .eq('restaurant_id', restaurantId)
            .order('created_at', { ascending: false })
            .limit(5),

        // 12. Restaurant Details (Currency)
        supabase
            .from('restaurants')
            .select('currency')
            .eq('id', restaurantId)
            .single()
    ]);

    // Processing Data (Synchronous & Fast)
    const pendingIncomeValue = pendingOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;
    const dailyRevenue = todayRevenueOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;
    const totalRevenue = allTimeRevenueOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

    // Weekly Chart Data Processing
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartDataMap = new Map();
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        chartDataMap.set(days[d.getDay()], { total: 0, count: 0 });
    }
    weeklyOrders?.forEach(order => {
        const dayName = days[new Date(order.created_at).getDay()];
        if (chartDataMap.has(dayName)) {
            const current = chartDataMap.get(dayName);
            chartDataMap.set(dayName, {
                total: current.total + (Number(order.total_amount) || 0),
                count: current.count + 1
            });
        }
    });
    const chartData = Array.from(chartDataMap).map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count
    }));

    // Top Selling Processing
    const itemCounts: Record<string, { count: number, price: number }> = {};
    (topSellingData as any[])?.forEach(item => {
        const menuItem = Array.isArray(item.menu_items) ? item.menu_items[0] : item.menu_items;
        const name = menuItem?.name || 'Unknown';
        const price = Number(menuItem?.price) || 0;
        if (!itemCounts[name]) itemCounts[name] = { count: 0, price };
        itemCounts[name].count += item.quantity;
    });
    const topSelling = Object.entries(itemCounts)
        .map(([name, data]) => ({
            name,
            count: data.count,
            revenue: data.count * data.price
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const weeklyTotalRevenue = chartData.reduce((acc, day) => acc + day.total, 0);

    // Monthly Chart Data Processing
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthlyChartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        return { name: day.toString(), total: 0, date: new Date(today.getFullYear(), today.getMonth(), day).toISOString() };
    });
    monthlyOrders?.forEach(order => {
        const day = new Date(order.created_at).getDate();
        if (monthlyChartData[day - 1]) monthlyChartData[day - 1].total += (Number(order.total_amount) || 0);
    });
    const monthlyTotalRevenue = monthlyOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

    // Yearly Chart Data Processing
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const yearlyChartData = monthNames.map(name => ({ name, total: 0 }));
    yearlyOrders?.forEach(order => {
        const monthIndex = new Date(order.created_at).getMonth();
        if (yearlyChartData[monthIndex]) yearlyChartData[monthIndex].total += (Number(order.total_amount) || 0);
    });
    const yearlyTotalRevenue = yearlyOrders?.reduce((acc, order) => acc + (Number(order.total_amount) || 0), 0) || 0;

    // Calendar Data
    const calendarData = monthlyChartData.map(day => ({
        date: day.date,
        profit: day.total,
        count: monthlyOrders?.filter(o => new Date(o.created_at).getDate() === parseInt(day.name)).length || 0
    }));

    const currencyCode = restaurant?.currency || 'USD';
    const currencySymbol = currencyCode === 'QAR' ? 'QR' : currencyCode === 'MAD' ? 'DH' : '$';

    return {
        currency: currencySymbol,
        totalRevenue,
        dailyRevenue,
        weeklyTotalRevenue,
        monthlyTotalRevenue,
        yearlyTotalRevenue,
        activeOrders: activeOrdersCount || 0,
        activeTables: 0, // Placeholder as per original
        pendingIncome: pendingIncomeValue,
        totalOrdersToday: totalOrdersToday || 0,
        totalOrdersAllTime: totalOrdersAllTime || 0,
        chartData,
        monthlyChartData,
        yearlyChartData,
        calendarData,
        topSelling,
        recentActivity: recentOrders?.map(order => ({
            title: `New order from ${order.customer_phone || 'Guest'}`,
            subtitle: `Table ${order.table_number || 'Express'} • ${order.status}`,
            time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })) || []
    };
}
