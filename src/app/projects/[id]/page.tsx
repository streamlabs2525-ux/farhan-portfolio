"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProjectDetails, Project } from "@/lib/projects";

export default function ProjectDetails() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [uploadDate, setUploadDate] = useState("FEBRUARY 23, 2026");

    useEffect(() => {
        async function fetchProject() {
            // Allow fallback mock check if ID matches (for the mock ones we added)
            if (id.startsWith("mock")) {
                const mockProjects = [
                    {
                        id: "mock1",
                        title: "Noir Coffee Co.",
                        description: "A comprehensive branding exercise to redefine the image of a luxury coffee company.",
                        thumbnailUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop",
                        imageUrls: [
                            "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=1200&auto=format&fit=crop"
                        ],
                    },
                    {
                        id: "mock2",
                        title: "Vogue Noir Editorial",
                        description: "High-end editorial design layout for leading monochrome fashion magazine.",
                        thumbnailUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
                        imageUrls: [
                            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop"
                        ],
                    },
                    {
                        id: "mock3",
                        title: "Apex Finance App",
                        description: "User Interface design for next generation mobile investment platform.",
                        thumbnailUrl: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop",
                        imageUrls: [
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                        ],
                    },
                ];

                const mockData = mockProjects.find(p => p.id === id);
                if (mockData) {
                    setProject(mockData);
                    setLoading(false);
                    return;
                }
            }

            // Fetch from Firebase / Supabase
            const data = await getProjectDetails(id);
            if (data) {
                setProject(data);
                if (data.createdAt) {
                    try {
                        let dateObj;
                        if ((data.createdAt as any).seconds) {
                            dateObj = new Date((data.createdAt as any).seconds * 1000);
                        } else {
                            dateObj = new Date(data.createdAt);
                        }
                        const formatted = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                        if (formatted !== 'Invalid Date') {
                            setUploadDate(formatted.toUpperCase());
                        }
                    } catch (e) {
                        // Ignore
                    }
                }
            }
            setLoading(false);
        }
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#d2b48c]">
                <Loader2 className="animate-spin w-12 h-12" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6">
                <h1 className="text-4xl font-serif mb-4">Project Not Found</h1>
                <Link href="/#portfolio" className="text-[#d2b48c] border-b border-transparent hover:border-[#d2b48c] transition-colors">
                    Return to Portfolio
                </Link>
            </div>
        );
    }

    const allGalleryImages = [...(project.imageUrls || []), project.thumbnailUrl];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev === allGalleryImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? allGalleryImages.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-transparent text-[#ededed] p-6 py-8 md:p-12 font-sans font-light">
            {/* Top Back Arrow (Golden) */}
            <Link href="/#portfolio" className="inline-block text-[#d2b48c] mb-16 hover:opacity-80 transition-opacity">
                <ArrowLeft size={28} strokeWidth={1.5} />
            </Link>

            <div className="max-w-7xl mx-auto flex flex-col gap-20">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Left Side: Long Vertical Banner Space (30px) */}
                    <div className="w-[300px] flex-shrink-0 hidden md:flex flex-col">
                        <div className="w-full h-full min-h-[500px] bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder for the user's banner. It spans from beside the thumbnail to the bottom of the gallery */}
                            <div className="text-[#444] text-xs uppercase tracking-[0.2em] -rotate-90 whitespace-nowrap absolute">
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Header and Gallery */}
                    <div className="flex-1 flex flex-col gap-20 w-full min-w-0">
                        {/* Top Section: Thumbnail and Title */}
                        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
                            {/* Thumbnail */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="w-full lg:w-[45%] xl:w-[40%] aspect-[16/9] rounded-xl overflow-hidden bg-[#111] relative shadow-lg"
                            >
                                <Image
                                    src={project.thumbnailUrl}
                                    alt={`${project.title} Thumbnail`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </motion.div>

                            {/* Title Area */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="w-full lg:w-[55%] xl:w-[60%] flex flex-col justify-start pt-2 lg:pt-6"
                            >
                                <h1 className="text-3xl md:text-4xl lg:text-5xl mb-8 text-white tracking-tight leading-tight">
                                    {project.title}
                                </h1>
                                <div className="h-[15px]"></div>
                                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666] mt-4">
                                    {uploadDate}
                                </p>
                            </motion.div>
                        </div>

                        {/* Project Gallery Section */}
                        {allGalleryImages.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="flex flex-col gap-6"
                            >
                                <h3 className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666]">
                                    PROJECT GALLERY
                                </h3>

                                <div className="relative w-full aspect-[4/3] lg:aspect-[21/9] bg-[#0e0e0e] rounded-xl overflow-hidden group border border-[#1a1a1a]">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentImageIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={allGalleryImages[currentImageIndex]}
                                                alt={`${project.title} Gallery Image ${currentImageIndex + 1}`}
                                                fill
                                                className="object-contain"
                                                sizes="100vw"
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Left/Right Controls */}
                                    {allGalleryImages.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#111]/80 text-[#ccc] flex items-center justify-center translate-x-[-20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#222] hover:text-white z-10 hover:scale-105 backdrop-blur-sm border border-[#333]"
                                            >
                                                <ChevronLeft size={24} strokeWidth={1.5} />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#111]/80 text-[#ccc] flex items-center justify-center translate-x-[20px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#222] hover:text-white z-10 hover:scale-105 backdrop-blur-sm border border-[#333]"
                                            >
                                                <ChevronRight size={24} strokeWidth={1.5} />
                                            </button>
                                        </>
                                    )}

                                    {/* Dot Indicators */}
                                    {allGalleryImages.length > 1 && (
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 transition-opacity duration-300 opacity-60 group-hover:opacity-100">
                                            {allGalleryImages.map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`h-[3px] rounded-full transition-all duration-300 ${idx === currentImageIndex ? "bg-[#d2b48c] w-8 shadow-[0_0_8px_rgba(210,180,140,0.5)]" : "bg-white/30 w-4"}`}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Fraction Indicator */}
                                    <div className="absolute bottom-6 right-6 text-[10px] text-[#888] tracking-[0.3em] z-10 font-mono">
                                        {currentImageIndex + 1} / {allGalleryImages.length}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Lower Section: Second Banner and About Project */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                    {/* Left Side: Second Long Vertical Banner Space (30px) */}
                    <div className="w-[100px] flex-shrink-0 hidden md:flex flex-col">
                        <div className="w-full h-full min-h-[300px] bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
                            {/* Placeholder for the second banner beside the description text */}
                            <div className="text-[#444] text-xs uppercase tracking-[0.2em] -rotate-90 whitespace-nowrap absolute">
                            </div>
                        </div>
                    </div>

                    {/* Right Side: About Project Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex-1 flex flex-col gap-6 pb-32 max-w-4xl min-w-0"
                    >
                        <h3 className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#666]">
                            ABOUT THIS PROJECT
                        </h3>
                        <div className="text-[#a0a0a0] leading-[1.8] text-base md:text-lg whitespace-pre-line font-light">
                            {project.description}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
