import { supabase } from "./supabase";

export interface Project {
    id?: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    imageUrls: string[];
    createdAt?: string;
}

export const getProjects = async (): Promise<Project[]> => {
    try {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw error;

        // Map snake_case to camelCase
        return (data || []).map((row: Record<string, string | string[]>) => ({
            id: row.id as string,
            title: row.title as string,
            description: row.description as string,
            thumbnailUrl: row.thumbnail_url as string,
            imageUrls: (row.image_urls as string[]) || [],
            createdAt: row.created_at as string,
        })) as Project[];
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const getProjectDetails = async (id: string): Promise<Project | null> => {
    try {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        if (!data) return null;

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            thumbnailUrl: data.thumbnail_url,
            imageUrls: data.image_urls || [],
            createdAt: data.created_at,
        };
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
};

export const addProject = async (project: Omit<Project, "id" | "createdAt" | "imageUrls"> & { imageUrls: string[] }): Promise<string | null> => {
    try {
        const { data, error } = await supabase
            .from("projects")
            .insert([
                {
                    title: project.title,
                    description: project.description,
                    thumbnail_url: project.thumbnailUrl,
                    image_urls: project.imageUrls,
                },
            ])
            .select()
            .single();

        if (error) throw error;
        return data.id;
    } catch (error) {
        console.error("Error adding project:", error);
        return null;
    }
};

export const uploadImage = async (file: File, path: string): Promise<string | null> => {
    try {
        const { data, error } = await supabase.storage
            .from("portfolio") // We'll create a bucket named "portfolio"
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from("portfolio")
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
};

export const deleteProject = async (id: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error deleting project:", error);
        return false;
    }
};
