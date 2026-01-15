
"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DollarSign, Utensils, Users, ShoppingBag } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

interface DashboardStats {
    totalRevenue: number;
    activeOrders: number;
    activeTables: number;
    totalOrdersToday: number;
    chartData: any[];
}

export function DashboardUI({ stats }: { stats: DashboardStats }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight glow-text text-primary">Dashboard Overview</h2>
                    <div className="text-sm text-muted-foreground">
                        {mounted ? new Date().toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : <span className="opacity-0">Loading date...</span>}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={item}>
                    <StatCard
                        title="Total Revenue"
                        value={`$${stats.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        trend="Daily Revenue"
                        trendUp={true}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title="Active Orders"
                        value={stats.activeOrders}
                        icon={ShoppingBag}
                        trend="Pending kitchen"
                        trendUp={true}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title="Active Tables"
                        value={stats.activeTables}
                        icon={Users}
                        trend="Occupied tables"
                        trendUp={true}
                    />
                </motion.div>
                <motion.div variants={item}>
                    <StatCard
                        title="Total Orders"
                        value={stats.totalOrdersToday}
                        icon={Utensils}
                        trend="Orders today"
                        trendUp={true}
                    />
                </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <motion.div variants={item} className="col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>Daily revenue for the current week.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                                            cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="hsl(var(--primary))"
                                            radius={[4, 4, 0, 0]}
                                            animationDuration={1500}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={item} className="col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest actions from your restaurant.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Placeholder for activity feed - could be real logs later */}
                                <p className="text-sm text-muted-foreground">No recent activity.</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
