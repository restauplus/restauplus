"use client";

import { motion } from "framer-motion";
import { Network, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrations = [
    {
        name: "Talabat",
        logo: "/integrations/talabat.png?v=2",
        description: "Leading food delivery platform in the MENA region.",
        status: "Coming Soon",
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
        name: "Snoonu",
        logo: "/integrations/snoonu.png?v=2",
        description: "The fastest delivery app in Qatar.",
        status: "Coming Soon",
        color: "bg-red-500/10 text-red-500 border-red-500/20"
    }
];

export default function IntegrationsPage() {
    return (
        <div className="flex flex-col h-full bg-black">
            {/* Header */}
            <div className="p-8 border-b border-zinc-800/50">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-4"
                    >
                        <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                            <Network className="h-6 w-6 text-teal-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">Integrations</h1>
                            <p className="text-zinc-400 mt-1">Connect your restaurant with top delivery platforms.</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {integrations.map((integration, index) => (
                            <motion.div
                                key={integration.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-3xl p-6 hover:bg-zinc-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-900/10 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-16 w-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg">
                                        <img
                                            src={integration.logo}
                                            alt={integration.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <Badge variant="outline" className={integration.color}>
                                        {integration.status}
                                    </Badge>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">
                                    {integration.name}
                                </h3>
                                <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                                    {integration.description}
                                </p>

                                <Button
                                    className="w-full h-11 bg-zinc-950 text-zinc-500 border border-zinc-800 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 transition-all group-hover:shadow-lg"
                                    disabled
                                >
                                    <span className="mr-2">Integration Soon</span>
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
