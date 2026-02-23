"use client";

import { useEffect, useState } from "react";

export default function CursorGlow() {
    const [position, setPosition] = useState({ x: -1000, y: -1000 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        let animationFrameId: number;

        const updatePosition = (e: MouseEvent) => {
            // Use requestAnimationFrame for smoother performance
            animationFrameId = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener("mousemove", updatePosition, { passive: true });

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (!isClient) return null;

    return (
        <div
            className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
            style={{
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(210, 180, 140, 0.2), transparent 40%)`,
            }}
        />
    );
}
