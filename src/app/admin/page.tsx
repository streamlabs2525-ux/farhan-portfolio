"use client";

import { useState, useEffect } from "react";
import { addProject, uploadImage, getProjects, deleteProject, updateProjectImages, updateProject, type Project } from "@/lib/projects";
import { Plus, Image as ImageIcon, Loader2, Trash2, Edit2, ArrowLeft, ArrowRight, X } from "lucide-react";

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
    const [uploadingProjectId, setUploadingProjectId] = useState<string | null>(null);

    // Edit State
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editThumbnailFile, setEditThumbnailFile] = useState<File | null>(null);
    const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
    const [savingEdit, setSavingEdit] = useState(false);

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

    const handleAddMoreImages = async (project: Project, files: FileList | null) => {
        if (!files || files.length === 0 || !project.id) return;

        setUploadingProjectId(project.id);
        setSuccessMsg("");

        try {
            const timeStr = new Date().getTime();
            const newUrls = [...(project.imageUrls || [])];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await uploadImage(file, `projects/${timeStr}_append${i}_${file.name}`);
                if (url) newUrls.push(url);
            }

            const success = await updateProjectImages(project.id, newUrls);
            if (success) {
                setSuccessMsg(`Added ${files.length} images to ${project.title}`);
                fetchProjects();
            } else {
                alert("Failed to save new project images.");
            }
        } catch (err) {
            console.error(err);
            alert("Error adding images.");
        } finally {
            setUploadingProjectId(null);
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

    const openEdit = (project: Project) => {
        setEditingProject(project);
        setEditTitle(project.title);
        setEditDescription(project.description);
        setEditThumbnailFile(null);
        setEditImageUrls(project.imageUrls || []);
    };

    const handleSaveEdit = async () => {
        if (!editingProject) return;
        setSavingEdit(true);
        try {
            let newThumbUrl = editingProject.thumbnailUrl;
            if (editThumbnailFile) {
                const timeStr = new Date().getTime();
                const url = await uploadImage(editThumbnailFile, `projects/${timeStr}_thumb_${editThumbnailFile.name}`);
                if (url) newThumbUrl = url;
            }

            await updateProject(editingProject.id as string, {
                title: editTitle,
                description: editDescription,
                thumbnailUrl: newThumbUrl,
                imageUrls: editImageUrls,
            });

            setSuccessMsg(`Updated project: ${editTitle}`);
            setEditingProject(null);
            fetchProjects();
        } catch (e) {
            console.error(e);
            alert("Failed to update project");
        } finally {
            setSavingEdit(false);
        }
    };

    const moveImage = (index: number, direction: 'left' | 'right') => {
        const newIdx = direction === 'left' ? index - 1 : index + 1;
        if (newIdx < 0 || newIdx >= editImageUrls.length) return;

        const newUrls = [...editImageUrls];
        const temp = newUrls[index];
        newUrls[index] = newUrls[newIdx];
        newUrls[newIdx] = temp;
        setEditImageUrls(newUrls);
    };

    const removeImage = (index: number) => {
        const newUrls = editImageUrls.filter((_, i) => i !== index);
        setEditImageUrls(newUrls);
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
                                        <h3 className="font-serif text-lg text-white mb-4 truncate">{project.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <label className={`flex items-center gap-2 text-xs transition-colors cursor-pointer ${uploadingProjectId === project.id ? 'text-[#d2b48c] opacity-50 cursor-not-allowed' : 'text-[#888] hover:text-[#d2b48c]'}`}>
                                                {uploadingProjectId === project.id ? (
                                                    <><Loader2 size={14} className="animate-spin" /> Uploading...</>
                                                ) : (
                                                    <><Plus size={14} /> Add Images</>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    disabled={uploadingProjectId === project.id}
                                                    onChange={(e) => handleAddMoreImages(project, e.target.files)}
                                                    className="hidden"
                                                />
                                            </label>

                                            <button
                                                onClick={() => openEdit(project)}
                                                className="flex items-center gap-2 text-xs text-[#888] hover:text-white transition-colors"
                                            >
                                                <Edit2 size={14} /> Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteProject(project.id)}
                                                disabled={uploadingProjectId === project.id}
                                                className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Project Modal */}
            {editingProject && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-6 z-50 overflow-y-auto">
                    <div className="bg-[#111] p-8 rounded-xl border border-[#333] max-w-3xl w-full my-8 relative">
                        <button
                            onClick={() => setEditingProject(null)}
                            className="absolute top-4 right-4 text-[#888] hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-serif mb-6 border-b border-[#333] pb-4">Edit Project</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Title</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-[#d2b48c]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Update Thumbnail</label>
                                    <div className="w-full bg-[#1a1a1a] p-2 rounded-lg border border-[#333] flex items-center justify-between">
                                        <span className="text-sm truncate px-2 text-[#aaa]">
                                            {editThumbnailFile ? editThumbnailFile.name : "Keep existing thumbnail..."}
                                        </span>
                                        <label className="bg-[#333] cursor-pointer hover:bg-[#444] px-4 py-1.5 rounded-md text-sm transition-colors">
                                            Browse
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setEditThumbnailFile(e.target.files?.[0] || null)}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full bg-[#1a1a1a] text-white p-3 rounded-lg outline-none border border-[#333] focus:border-[#d2b48c] min-h-[120px]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-[#888] mb-2 uppercase tracking-widest">Gallery Images (Sort & Remove)</label>
                                {editImageUrls.length === 0 ? (
                                    <p className="text-[#888] text-sm italic">No gallery images available.</p>
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {editImageUrls.map((url, idx) => (
                                            <div key={idx} className="bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden relative group">
                                                <div className="aspect-video relative bg-[#000]">
                                                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="p-2 flex justify-between items-center bg-[#111]">
                                                    <div className="flex gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImage(idx, 'left')}
                                                            disabled={idx === 0}
                                                            className="p-1 rounded bg-[#222] text-[#ccc] hover:bg-[#333] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ArrowLeft size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImage(idx, 'right')}
                                                            disabled={idx === editImageUrls.length - 1}
                                                            className="p-1 rounded bg-[#222] text-[#ccc] hover:bg-[#333] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="text-red-500 hover:text-red-400 p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSaveEdit}
                                disabled={savingEdit}
                                className="w-full bg-[#d2b48c] text-black font-medium py-3 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2 mt-4"
                            >
                                {savingEdit ? (
                                    <><Loader2 className="animate-spin" size={20} /> Saving Changes...</>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
