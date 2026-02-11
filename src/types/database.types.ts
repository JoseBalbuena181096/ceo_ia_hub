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
                    category: 'Académico' | 'Ventas' | 'RRHH' | 'Directivo'
                    tags: string[] | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    content: string
                    category: 'Académico' | 'Ventas' | 'RRHH' | 'Directivo'
                    tags?: string[] | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    content?: string
                    category?: 'Académico' | 'Ventas' | 'RRHH' | 'Directivo'
                    tags?: string[] | null
                    created_by?: string | null
                    created_at?: string
                }
            }
            videos: {
                Row: {
                    id: string
                    title: string
                    url: string
                    category: 'Hacks' | 'Tutoriales' | 'Casos de Uso'
                    duration: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    url: string
                    category?: 'Hacks' | 'Tutoriales' | 'Casos de Uso'
                    duration?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    url?: string
                    category?: 'Hacks' | 'Tutoriales' | 'Casos de Uso'
                    duration?: string | null
                    created_at?: string
                }
            }
        }
    }
}
