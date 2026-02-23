"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects, Project } from "@/lib/projects";

// Fallback mock data in case Firebase is empty initially
const mockProjects: Project[] = [
    {
        id: "mock1",
        title: "Noir Coffee Co.",
        description: "Branding",
        thumbnailUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop",
        imageUrls: [],
    },
    {
        id: "mock2",
        title: "Vogue Noir Editorial",
        description: "Editorial",
        thumbnailUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
        imageUrls: [],
    },
    {
        id: "mock3",
        title: "Apex Finance App",
        description: "Digital",
        thumbnailUrl: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop",
        imageUrls: [],
    },
];

export default function PortfolioSection({ className }: { className?: string }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            const data = await getProjects();
            if (data && data.length > 0) {
                setProjects(data);
            } else {
                setProjects(mockProjects);
            }
            setLoading(false);
        }
        fetchProjects();
    }, []);

    return (
        <section id="portfolio" className={`py-24 w-full bg-[#050505] min-h-screen ${className || ""}`}>
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row items-end mb-16 gap-6">
                    <div className="w-[40px]"></div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-xs uppercase tracking-widest text-[#a0a0a0]">Portfolio</span>
                        {/* <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif mt-4 leading-tight">
                            Selected <span className="italic text-[#d2b48c]">Work</span>
                        </h2> */}
                    </motion.div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Left Side: Long Vertical Banner Space */}
                    <div className="w-[0px] flex-shrink-0 hidden md:flex flex-col">
                        <div className="w-full h-full min-h-[500px] bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder for the banner */}
                            <div className="text-[#444] text-xs uppercase tracking-[0.2em] -rotate-90 whitespace-nowrap absolute">
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Portfolio Grid */}
                    <div className="flex-1 w-full min-w-0">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse bg-[#111] aspect-[16/9] rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                            >
                                <AnimatePresence>
                                    {projects.map((project, idx) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                                            whileHover={{ y: -10 }}
                                            className="group relative justify-center flex flex-col overflow-hidden rounded-xl bg-[#0a0a0a]"
                                        >
                                            <Link href={`/projects/${project.id}`} className="absolute inset-0 z-20" />
                                            <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#1a1a1a]">
                                                <Image
                                                    src={project.thumbnailUrl}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                                            </div>

                                            <div className="absolute bottom-0 left-0 w-full p-6 z-10 flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <div>
                                                    <h3 className=" justify-center text-center text-2xl font-serif text-white mb-1 group-hover:text-[#d2b48c] transition-colors">{project.title}</h3>
                                                    <p className="text-sm text-neutral-100 capitalize">.  Click To View</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                                    <ArrowUpRight size={20} className="text-white" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
