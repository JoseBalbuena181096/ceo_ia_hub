export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    department: string | null
                    is_admin: boolean
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    department?: string | null
                    is_admin?: boolean
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    department?: string | null
                    is_admin?: boolean
                    updated_at?: string | null
                }
            }
            prompts: {
                Row: {
                    id: string
                    title: string
                    content: string
                    category: string
                    tags: string[] | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    category: string
                    tags?: string[] | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    category?: string
                    tags?: string[] | null
                    created_by?: string | null
                    created_at?: string
                }
            }
            prompt_categories: {
                Row: {
                    id: string
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    created_at?: string
                }
            }
            videos: {
                Row: {
                    id: string
                    title: string
                    url: string
                    category: string
                    duration: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    url: string
                    category?: string
                    duration?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    url?: string
                    category?: string
                    duration?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
