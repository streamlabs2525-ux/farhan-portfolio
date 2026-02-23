"use client";

import { motion } from "framer-motion";
import { Mail, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function ContactSection() {
    return (
        <section id="contact" className="py-12 w-full md:py-16 bg-[#0a0a0a] min-h-[70vh] flex items-center justify-center text-center">
            <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 relative z-10">

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center"
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-[#a0a0a0] mb-8">Contact</span>
                    <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">
                        Let{"'"}s create something <br />
                        <span className="italic text-[#d2b48c]">together</span>
                    </h2>
                    <div className="w-full h-10 "></div>
                    <p className="text-[#888] text-lg font-light max-w-xl mx-auto mb-16 leading-relaxed">
                        Have a project in mind or want to collaborate? I would love to hear from you.
                        Drop me a line and let us bring your vision to life.
                    </p>
                    <div className="w-full h-5 "></div>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="mailto:mdfarhantanvir7@gmail.com"
                        className="h-10 w-100 justify-center flex items-center gap-3 bg-[#d2b48c] text-black px-10 py-4 rounded-full font-medium hover:bg-black hover:text-white transition-all duration-300"
                    >
                        <div></div>
                        <Mail size={20} />
                        Get in Touch
                        <div></div>
                    </motion.a>
                    <div className="w-full h-5 "></div>

                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-6 md:gap-12 mt-24 text-xs md:text-sm text-[#666] uppercase tracking-widest font-medium"
                >
                    {[
                        { name: "Instagram", icon: <Instagram size={20} />, url: "https://www.instagram.com/farhantanvir._/" },
                        { name: "Facebook", icon: <Facebook size={20} />, url: "https://www.facebook.com/farhantanvir123" },
                        { name: "X", icon: <Twitter size={20} />, url: "https://x.com/Farhan_tanvir10" },
                        { name: "LinkedIn", icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/farhan-tanvir-0718bb2a7" } // Add LinkedIn link here if you have one!
                    ].map((social) => (
                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#d2b48c] transition-colors duration-300">
                            {social.icon}
                        </a>
                    ))}
                </motion.div>

            </div>
        </section >
    );
}
