"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section id="home" className="relative px-6 pt-32 pb-20 md:pb-32 overflow-hidden min-h-screen flex items-center">
            {/* Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[60vh] z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-[#d2b48c]/10 to-transparent" />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">

                    {/* Left: Photo + Name Block */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full md:w-5/12 flex flex-col items-center md:items-start"
                    >
                        <div className="w-full max-w-[400px] aspect-[4/5] relative rounded-lg overflow-hidden mb-8 border border-[#1a1a1a] bg-[#050505]">
                            <Image
                                src="/profile.png"
                                alt="Farhan Tanvir"
                                fill
                                className="object-cover grayscale contrast-125 brightness-75 opacity-90 transition-all duration-700 hover:grayscale-0 hover:brightness-100 hover:opacity-100"
                                sizes="(max-width: 768px) 100vw, 500px"
                                priority
                            />
                        </div>
                        <div className="text-center md:text-left md:pl-2">
                            <h3 className="font-sans text-2xl md:text-3xl tracking-[0.1em] font-light text-white mb-2 uppercase">
                                Farhan Tanvir
                            </h3>
                            <p className="text-[#888] text-xs md:text-sm uppercase tracking-[0.3em] font-medium">
                                Graphic Designer
                            </p>
                        </div>
                    </motion.div>

                    {/* Right: Intro Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="w-full md:w-7/12 md:pr-12 lg:pr-24 flex flex-col items-center md:items-start text-center md:text-left mt-8 md:mt-0"
                    >
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="text-xs md:text-sm uppercase tracking-[0.3em] text-[#d2b48c] mb-6 font-semibold"
                        >
                            Overview
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-5xl md:text-6xl lg:text-[5.5rem] font-serif leading-[1.1] mb-8"
                        >
                            Crafting visual<br />
                            <span className="italic text-[#d2b48c]">experiences</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="text-[#999] text-base md:text-xl max-w-xl font-light leading-relaxed"
                        >
                            I design brands, editorial layouts, and digital interfaces that communicate with clarity and elegance. Every pixel serves a purpose.
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
            >
                <span className="text-xs uppercase tracking-widest text-neutral-500">Selected Work</span>
                <Link href="#portfolio" className="text-neutral-500 hover:text-white transition-colors duration-300">
                    <ArrowDown className="animate-bounce" size={20} />
                </Link>
            </motion.div>
        </section>
    );
}
