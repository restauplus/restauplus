"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

// Define proper interface for Location
interface Location {
    latitude: number;
    longitude: number;
}

export function WorldGlobe({ locations = [] }: { locations?: Location[] }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        // Cobe expects markers in a specific format
        const markers = locations.length > 0 ? locations.map((loc) => ({
            location: [loc.latitude, loc.longitude] as [number, number],
            size: 0.05
        })) : [
            { location: [37.7595, -122.4367] as [number, number], size: 0.03 }
        ];

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: markers,
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.005; // Slower spin
            },
        });

        return () => {
            globe.destroy();
        };
    }, [locations]);

    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            />
        </div>
    );
}
