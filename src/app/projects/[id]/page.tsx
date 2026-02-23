"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProjectDetails, Project } from "@/lib/projects";
import ImageSlider from "@/components/ImageSlider";
import Footer from "@/components/Footer";

function formatDate(dateString?: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default function ProjectDetails() {
    const { id } = useParams() as { id: string };
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProject() {
            if (id.startsWith("mock")) {
                const mockProjects = [
                    {
                        id: "mock1",
                        title: "Noir Coffee Co.",
                        description:
                            "A comprehensive branding exercise to redefine the image of a luxury coffee company. The project encompassed a full visual overhaul, from the core logo mark to packaging design, menu layouts, and environmental graphics for their flagship store.\n\nOur approach began with an extensive discovery phase, studying the heritage of artisan coffee culture and the emerging trends in premium food and beverage branding. We wanted to capture the richness and depth of the product itself in every visual touchpoint.\n\nThe final identity system uses a refined serif typeface paired with warm, earthy tones that evoke the aroma and experience of freshly brewed coffee. Custom illustrations and a bespoke icon set were developed to give the brand a distinctive, hand-crafted feel that stands apart in a crowded market.",
                        thumbnailUrl:
                            "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop",
                        imageUrls: [
                            "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
                        ],
                        createdAt: "2025-03-15T10:00:00Z",
                    },
                    {
                        id: "mock2",
                        title: "Vogue Noir Editorial",
                        description:
                            "High-end editorial design layout for a leading monochrome fashion magazine. This project involved creating a complete issue layout with a focus on dramatic typography, bold imagery, and sophisticated grid systems.\n\nThe design language was developed to complement the high-contrast photography style the publication is known for. Every spread was crafted to tell a visual story, balancing white space with powerful images and carefully set type.\n\nFrom cover design through to the feature well and department pages, the layout system provides a flexible yet cohesive framework that elevates the editorial content.",
                        thumbnailUrl:
                            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop",
                        imageUrls: [
                            "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=1200&auto=format&fit=crop",
                        ],
                        createdAt: "2025-05-22T10:00:00Z",
                    },
                    {
                        id: "mock3",
                        title: "Apex Finance App",
                        description:
                            "User Interface design for a next-generation mobile investment platform. The goal was to make complex financial data accessible, beautiful, and actionable for a new generation of investors.\n\nThe design process involved extensive user research and iterative prototyping to ensure that the interface simplifies the inherently complex world of personal finance. We developed a clean, data-rich UI that uses color coding, clear iconography, and intuitive navigation patterns.\n\nThe result is a polished mobile experience that empowers users to manage their portfolios, track market trends, and execute trades with confidence and clarity.",
                        thumbnailUrl:
                            "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop",
                        imageUrls: [
                            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
                        ],
                        createdAt: "2025-08-10T10:00:00Z",
                    },
                ];

                const mockData = mockProjects.find((p) => p.id === id);
                if (mockData) {
                    setProject(mockData);
                    setLoading(false);
                    return;
                }
            }

            const data = await getProjectDetails(id);
            if (data) {
                setProject(data);
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
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-serif text-white">Project Not Found</h1>
                <Link
                    href="/"
                    className="text-[#d2b48c] text-sm uppercase tracking-widest hover:text-white transition-colors"
                >
                    Return Home
                </Link>
            </div>
        );
    }

    const allImages = [project.thumbnailUrl, ...(project.imageUrls || [])];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            {/* Top Bar with Back Button */}
            <div className="fixed top-0 right-0 z-50 p-6 md:p-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1a1a1a]/80 backdrop-blur-md border border-[#2a2a2a] text-[#a0a0a0] hover:text-[#d2b48c] hover:border-[#d2b48c]/30 transition-all duration-300 text-sm uppercase tracking-widest"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                </Link>
            </div>

            <main className="flex-grow pt-20 md:pt-28 pb-24 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                    {/* ===== Section 1: Thumbnail + Title ===== */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-16 md:mb-20"
                    >
                        {/* Thumbnail */}
                        <div className="w-full md:w-5/12 flex-shrink-0">
                            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#111] border border-[#1a1a1a]">
                                <Image
                                    src={project.thumbnailUrl}
                                    alt={`${project.title} thumbnail`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Title + Date */}
                        <div className="w-full md:w-7/12 flex flex-col justify-center md:py-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-balance mb-4"
                            >
                                {project.title}
                            </motion.h1>

                            {project.createdAt && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="text-xs uppercase tracking-[0.2em] text-[#666]"
                                >
                                    Uploaded {formatDate(project.createdAt)}
                                </motion.p>
                            )}

                            {/* Decorative line */}
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="w-16 h-[1px] bg-[#d2b48c]/40 mt-6 origin-left"
                            />
                        </div>
                    </motion.div>

                    {/* ===== Section 2: Horizontal Image Slider ===== */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-16 md:mb-24"
                    >
                        <span className="block text-xs uppercase tracking-[0.2em] text-[#555] mb-6">
                            Project Gallery
                        </span>
                        <ImageSlider images={allImages} title={project.title} />
                    </motion.div>

                    {/* ===== Section 3: Description ===== */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="block text-xs uppercase tracking-[0.2em] text-[#555] mb-6">
                            About This Project
                        </span>

                        <div className="flex flex-col gap-6">
                            {project.description.split("\n").filter(Boolean).map((paragraph, idx) => (
                                <motion.p
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="text-[#999] text-base md:text-lg font-light leading-relaxed"
                                >
                                    {paragraph}
                                </motion.p>
                            ))}
                        </div>

                        {/* Decorative bottom line */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="w-full h-[1px] bg-[#1a1a1a] mt-16 origin-left"
                        />
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
