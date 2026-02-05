import React from "react";
import { cn } from "@/lib/utils";

interface LaptopFrameProps {
    children: React.ReactNode;
    className?: string;
}

export function LaptopFrame({ children, className }: LaptopFrameProps) {
    return (
        <div className={cn("relative mx-auto w-full max-w-[800px]", className)}>
            {/* 
              Ultra Realistic MacBook Pro Design 
              - Space Grey Metallic Finish
              - Authentic Bezel Ratios
              - Dynamic Reflection Layer
            */}

            {/* Lidd / Screen Container */}
            <div className="relative bg-[#0d0d0d] rounded-[20px] shadow-[0_0_0_2px_#3a3a3a,0_0_0_1px_#000] overflow-hidden aspect-[16/10] ring-1 ring-white/10">

                {/* Metallic Shell Gradient (Lid Edges) */}
                <div className="absolute inset-0 rounded-[18px] border-[4px] border-[#252525] pointer-events-none z-50">
                    {/* Inner Bezel Line */}
                    <div className="absolute inset-0 border border-black/50 rounded-[14px]"></div>
                </div>

                {/* Camera Notch */}
                <div className="absolute top-0 inset-x-0 h-4 z-[60] flex justify-center pointer-events-none">
                    <div className="w-32 h-4 bg-[#0d0d0d] rounded-b-[10px] flex items-center justify-center border-b border-l border-r border-[#1a1a1a]">
                        <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 bg-[#111] rounded-full ring-1 ring-white/5" />
                            <div className="w-1 h-1 bg-[#222] rounded-full opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Screen Content Area */}
                <div className="absolute inset-2 bg-black rounded-[6px] overflow-hidden flex flex-col">
                    {/* Glossy Reflection Overlay - Simulates glass texturing */}
                    <div className="absolute inset-0 z-[60] bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent pointer-events-none mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none transform skew-x-12" />

                    {/* The Screen Content */}
                    <div className="flex-1 relative overflow-hidden bg-black text-white">
                        {children}
                    </div>
                </div>
            </div>

            {/* Hinge Mechanism */}
            <div className="h-3 bg-[#1a1a1a] mx-[2%] rounded-b-lg relative z-10 shadow-inner flex items-center justify-center border-t border-black/50">
                <div className="w-full h-full bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]" />
            </div>

            {/* Bottom Case (Base) */}
            <div className="relative bg-[#e3e3e3] h-3 w-[104%] -ml-[2%] rounded-b-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center border-t border-[#9ca3af] bg-gradient-to-b from-[#b8b8b8] to-[#999999]">
                {/* Thumb Groove */}
                <div className="w-32 h-1.5 bg-[#888] rounded-b-md opacity-40 absolute top-0 shadow-inner" />
            </div>
        </div>
    );
}
