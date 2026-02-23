"use client";

import { motion } from "framer-motion";
import { Palette, Layers, MonitorSmartphone, Eye } from "lucide-react";

const services = [
    {
        icon: <Palette size={24} className="text-[#d2b48c]" />,
        title: "Brand Identity",
        desc: "Logos, color systems, and brand guidelines that establish a lasting visual presence.",
    },
    {
        icon: <Layers size={24} className="text-[#d2b48c]" />,
        title: "Editorial Design",
        desc: "Magazine layouts, book covers, and print publications with refined typography.",
    },
    {
        icon: <MonitorSmartphone size={24} className="text-[#d2b48c]" />,
        title: "Digital Design",
        desc: "Web and app interfaces built with attention to user experience and visual detail.",
    },
    {
        icon: <Eye size={24} className="text-[#d2b48c]" />,
        title: "Art Direction",
        desc: "Creative vision and visual storytelling for campaigns and brand narratives.",
    },
];

export default function AboutSection() {
    return (
        <section id="about" className="py-12 w-full bg-black min-h-screen flex justify-center items-center">
            <div className="w-full max-w-6xl mx-auto px-8 md:px-16 lg:px-24 flex flex-col">

                <div className="w-full flex justify-center pt-8 pb-12">
                    <div className="flex flex-col items-center text-center max-w-4xl gap-8">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight text-center w-full"
                        >
                            Design with <span className="italic text-[#d2b48c]">intention</span>
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-col gap-6 text-center items-center w-full"
                        >
                            <p className="text-[#888] text-lg font-light leading-relaxed text-center">
                                I am a graphic designer passionate about creating visual identities that resonate. With a
                                foundation in traditional design principles and an eye for contemporary aesthetics, I approach
                                every project as a unique storytelling opportunity.
                            </p>
                            <p className="text-[#888] text-lg font-light leading-relaxed text-center">
                                My process begins with understanding the essence of a brand and ends with crafted
                                visuals that communicate clearly and beautifully. From print to pixel, I believe great
                                design is invisible in its complexity but unforgettable in its impact.
                            </p>
                            {/* <div className="h-10"></div> */}
                        </motion.div>
                    </div>
                </div>

                {/* <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 },
                        },
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full "
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0 },
                            }}
                            transition={{ duration: 0.6 }}
                            className="bg-[#080808] border border-[#1a1a1a] rounded-xl px-20 py-10 hover:border-[#333] transition-colors group text-left flex flex-col pl-8 items-start "
                        >
                            <div className="h-5 w-10 lg:pl-36"></div>
                            <div className="mb-6 p-4 bg-[#111] rounded-lg group-hover:scale-110 transition-transform duration-300 ">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-medium text-white mb-3">{service.title}</h3>
                            <p className="text-[#666] text-sm leading-relaxed">{service.desc}</p>
                            <div className="h-5 w-10"></div>
                        </motion.div>
                    ))}
                </motion.div> */}
            </div>
        </section>
    );
}
