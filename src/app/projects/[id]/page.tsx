"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProjectDetails, Project } from "@/lib/projects";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProjectDetails() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

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

            // Fetch from Firebase
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
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-serif mb-4">Project Not Found</h1>
                <Link href="/#portfolio" className="text-[#d2b48c] border-b border-transparent hover:border-[#d2b48c] transition-colors">
                    Return to Portfolio
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-6 md:px-12">
                <div className="container mx-auto">
                    {/* Back Button */}
                    <Link href="/#portfolio" className="inline-flex items-center gap-2 text-[#888] hover:text-[#d2b48c] mb-12 transition-colors uppercase tracking-widest text-sm">
                        <ArrowLeft size={16} /> Back to Work
                    </Link>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-16 md:mb-24"
                    >
                        <h1 className="text-5xl md:text-7xl font-serif mb-8 text-balance leading-tight">{project.title}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#999] text-lg font-light leading-relaxed max-w-4xl">
                            <div>
                                <p>{project.description}</p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <span className="block text-xs uppercase tracking-[0.2em] text-[#555] mb-2">Role / Category</span>
                                    <span className="text-[#d2b48c]">{project.title.includes("App") ? "UI/UX Design" : "Art Direction"}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Images Gallery */}
                    <div className="flex flex-col gap-12 md:gap-24">
                        {/* Thumbnail Header Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="w-full relative aspect-[16/9] md:aspect-[2/1] rounded-xl overflow-hidden bg-[#111]"
                        >
                            <Image
                                src={project.thumbnailUrl}
                                alt={`${project.title} Cover`}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                        </motion.div>

                        {/* Additional Images */}
                        {project.imageUrls && project.imageUrls.map((imgUrl, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="w-full relative aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden bg-[#111]"
                            >
                                <Image
                                    src={imgUrl}
                                    alt={`${project.title} Detail ${idx + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-1000"
                                    sizes="100vw"
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom Nav */}
                    <div className="mt-32 pt-16 border-t border-[#1a1a1a] flex justify-between items-center bg-[#0a0a0a]">
                        <span className="text-[#555] uppercase tracking-widest text-sm">Next Project</span>
                        <Link href="/#portfolio" className="text-2xl font-serif text-white hover:text-[#d2b48c] transition-colors">
                            Explore More <ArrowLeft size={20} className="inline-block transform rotate-135" />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
