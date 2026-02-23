"use client";

import { useState, useEffect } from "react";
import { addProject, uploadImage, getProjects, deleteProject, type Project } from "@/lib/projects";
import { Plus, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetchProjects();
        }
    }, [isLoggedIn]);

    const fetchProjects = async () => {
        setLoadingProjects(true);
        const data = await getProjects();
        setProjects(data);
        setLoadingProjects(false);
    };

    const handleDeleteProject = async (id: string | undefined) => {
        if (!id) return;
        if (confirm("Are you sure you want to delete this project?")) {
            const success = await deleteProject(id);
            if (success) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert("Failed to delete project");
            }
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "Snowman" && password === "FarhanSnow1234") {
            setIsLoggedIn(true);
            setLoginError("");
        } else {
            setLoginError("Invalid username or password");
        }
    };

    const handleAddProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !thumbnailFile) {
            alert("Please provide title, description, and thumbnail.");
            return;
        }

        setUploading(true);
        setSuccessMsg("");

        try {
            // Setup minimal paths based on time to avoid collisions
            const timeStr = new Date().getTime();

            const thumbUrl = await uploadImage(thumbnailFile, `projects/${timeStr}_thumb_${thumbnailFile.name}`);
            if (!thumbUrl) throw new Error("Thumbnail upload failed");

            const imageUrls = [];
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const url = await uploadImage(file, `projects/${timeStr}_img${i}_${file.name}`);
                if (url) imageUrls.push(url);
            }

            await addProject({
                title,
                description,
                thumbnailUrl: thumbUrl,
                imageUrls,
            });

            setSuccessMsg("Project added successfully!");
            setTitle("");
            setDescription("");
            setThumbnailFile(null);
            setImageFiles([]);
            fetchProjects();
        } catch (err) {
            console.error(err);
            alert("Error adding project. Check console.");
        } finally {
            setUploading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#111] p-8 rounded-xl border border-[#333] shadow-2xl">
                    <h2 className="text-3xl font-serif text-white mb-6 text-center">Admin Login</h2>
                    {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}

                    <div className="mb-4">
                        <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-[#d2b48c] transition-colors"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-[#d2b48c] transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#d2b48c] text-black font-medium py-3 rounded-lg hover:bg-white transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-serif">Hello, <span className="text-[#d2b48c]">Snowman</span></h1>
                    <button onClick={() => setIsLoggedIn(false)} className="text-[#888] hover:text-white transition-colors">
                        Logout
                    </button>
                </div>

                <div className="bg-[#111] border border-[#333] rounded-xl p-8 shadow-xl">
                    <h2 className="text-2xl font-serif mb-6 border-b border-[#333] pb-4">Add New Project</h2>

                    {successMsg && <div className="bg-green-900/30 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6">{successMsg}</div>}

                    <form onSubmit={handleAddProject}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-[#d2b48c]"
                                    placeholder="e.g. Noir Coffee Co."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Thumbnail (Cover)</label>
                                <div className="w-full bg-[#1a1a1a] p-2 rounded-lg border border-[#333] flex items-center justify-between">
                                    <span className="text-sm truncate px-2 text-[#aaa]">
                                        {thumbnailFile ? thumbnailFile.name : "Select a file..."}
                                    </span>
                                    <label className="bg-[#333] cursor-pointer hover:bg-[#444] px-4 py-1.5 rounded-md text-sm transition-colors">
                                        Browse
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-[#d2b48c] min-h-[120px]"
                                placeholder="Brief project category or description..."
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Additional Project Images</label>
                            <div className="w-full bg-[#1a1a1a] p-4 rounded-lg border border-[#333] border-dashed text-center">
                                <p className="text-[#888] text-sm mb-4">You can add multiple photos for the project details page.</p>

                                <div className="flex flex-wrap gap-4 items-center justify-center">
                                    {imageFiles.map((file, idx) => (
                                        <div key={idx} className="bg-[#222] px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                            <ImageIcon size={14} className="text-[#d2b48c]" />
                                            <span className="max-w-[100px] truncate">{file.name}</span>
                                            <button type="button" onClick={() => setImageFiles(files => files.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300 ml-2">×</button>
                                        </div>
                                    ))}

                                    <label className="flex items-center gap-2 bg-[#d2b48c]/10 text-[#d2b48c] px-4 py-2 rounded-full cursor-pointer hover:bg-[#d2b48c]/20 transition-colors text-sm font-medium">
                                        <Plus size={16} /> Add Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-white text-black font-medium py-4 rounded-lg hover:bg-[#d2b48c] hover:text-white transition-colors flex justify-center items-center gap-2"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Publishing...
                                </>
                            ) : (
                                "Publish Project"
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-12 bg-[#111] border border-[#333] rounded-xl p-8 shadow-xl">
                    <h2 className="text-2xl font-serif mb-6 border-b border-[#333] pb-4">Manage Projects</h2>
                    {loadingProjects ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-[#d2b48c]" size={32} />
                        </div>
                    ) : projects.length === 0 ? (
                        <p className="text-[#888] text-center py-8">No projects uploaded yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-[#1a1a1a] rounded-lg border border-[#333] overflow-hidden group">
                                    <div className="aspect-video relative overflow-hidden bg-[#222]">
                                        <img
                                            src={project.thumbnailUrl}
                                            alt={project.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-serif text-lg text-white mb-2 truncate">{project.title}</h3>
                                        <button
                                            onClick={() => handleDeleteProject(project.id)}
                                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
