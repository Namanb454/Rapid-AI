export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          id: string
          created_at: string
          user_id: string
          video_url: string
          title: string | null
          description: string | null
          duration: string
          status: string
          font_name: string | null
          base_font_color: string | null
          highlight_word_color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          video_url: string
          title?: string | null
          description?: string | null
          duration: string
          status: string
          font_name?: string | null
          base_font_color?: string | null
          highlight_word_color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          video_url?: string
          title?: string | null
          description?: string | null
          duration?: string
          status?: string
          font_name?: string | null
          base_font_color?: string | null
          highlight_word_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

