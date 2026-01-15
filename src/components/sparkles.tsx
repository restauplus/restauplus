
"use client";

import React, { useId } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Implementing a custom Sparkles using Canvas for better performance and matching the user's request more closely without extra heavy tsparticles dependency if possible, but the user snippet implies a specific interface.
// Let's build a custom one that matches the prop interface provided: density, speed, size, direction, opacitySpeed, color, className.

interface SparklesProps {
    className?: string;
    size?: number;
    minSize?: number | null;
    density?: number;
    speed?: number;
    minSpeed?: number | null;
    opacity?: number;
    direction?: "top" | "bottom" | "left" | "right";
    opacitySpeed?: number;
    minOpacity?: number | null;
    color?: string;
    background?: string;
}

export const Sparkles = ({
    className,
    size = 1.2,
    minSize = null,
    density = 800,
    speed = 1.5,
    minSpeed = null,
    opacity = 1,
    direction = "top",
    opacitySpeed = 3,
    minOpacity = null,
    color = "#FFFFFF",
    background = "transparent",
}: SparklesProps) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const id = useId();

    return (
        <div className={cn("h-full w-full", className)}>
            {isReady && (
                <canvas
                    id={id}
                    className="h-full w-full opacity-0 animate-fade-in"
                    ref={(canvas) => {
                        if (!canvas) return;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;

                        let animationId: number;
                        const particles: Particle[] = [];

                        const dpr = window.devicePixelRatio || 1;
                        const rect = canvas.getBoundingClientRect();

                        canvas.width = rect.width * dpr;
                        canvas.height = rect.height * dpr;
                        ctx.scale(dpr, dpr);

                        class Particle {
                            x: number;
                            y: number;
                            size: number;
                            speedX: number;
                            speedY: number;
                            opacity: number;
                            opacitySpeed: number;
                            color: string;

                            constructor() {
                                this.x = Math.random() * rect.width;
                                this.y = Math.random() * rect.height;
                                this.size = Math.random() * (size - (minSize || 0.5)) + (minSize || 0.5);
                                this.speedX = 0;
                                this.speedY = Math.random() * (speed - (minSpeed || 0.5)) + (minSpeed || 0.5);
                                if (direction === "top") this.speedY *= -1;
                                this.opacity = Math.random();
                                this.opacitySpeed = Math.random() * (opacitySpeed - (minOpacity || 0.5)) + (minOpacity || 0.5);
                                this.color = color;
                            }

                            update() {
                                this.y += this.speedY;
                                if (this.y < 0) this.y = rect.height;
                                if (this.y > rect.height) this.y = 0;

                                this.opacity += Math.sin(Date.now() * 0.001 * this.opacitySpeed) * 0.02;
                                if (this.opacity < 0) this.opacity = 0;
                                if (this.opacity > 1) this.opacity = 1;
                            }

                            draw() {
                                ctx!.globalAlpha = this.opacity;
                                ctx!.fillStyle = this.color;
                                ctx!.beginPath();
                                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                                ctx!.fill();
                            }
                        }

                        for (let i = 0; i < density / 10; i++) {
                            particles.push(new Particle());
                        }

                        const animate = () => {
                            ctx!.clearRect(0, 0, rect.width, rect.height);
                            particles.forEach(p => {
                                p.update();
                                p.draw();
                            });
                            animationId = requestAnimationFrame(animate);
                        };

                        animate();

                        return () => cancelAnimationFrame(animationId);
                    }}
                />
            )}
        </div>
    );
};
