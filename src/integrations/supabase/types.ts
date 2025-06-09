export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      collection_images: {
        Row: {
          added_at: string
          collection_id: string
          id: string
          image_id: string
          position: number | null
        }
        Insert: {
          added_at?: string
          collection_id: string
          id?: string
          image_id: string
          position?: number | null
        }
        Update: {
          added_at?: string
          collection_id?: string
          id?: string
          image_id?: string
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "collection_images_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "popular_images"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          cover_image_id: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          metadata: Json | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          metadata?: Json | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          metadata?: Json | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collections_cover_image_id_fkey"
            columns: ["cover_image_id"]
            isOneToOne: false
            referencedRelation: "popular_images"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          created_at: string
          credits_used: number
          download_count: number | null
          error_message: string | null
          id: string
          image_url: string
          is_public: boolean | null
          like_count: number | null
          model: string
          parameters: Json | null
          processing_time_ms: number | null
          prompt: string
          safety_rating: Json | null
          status: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          created_at?: string
          credits_used?: number
          download_count?: number | null
          error_message?: string | null
          id?: string
          image_url: string
          is_public?: boolean | null
          like_count?: number | null
          model: string
          parameters?: Json | null
          processing_time_ms?: number | null
          prompt: string
          safety_rating?: Json | null
          status?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          created_at?: string
          credits_used?: number
          download_count?: number | null
          error_message?: string | null
          id?: string
          image_url?: string
          is_public?: boolean | null
          like_count?: number | null
          model?: string
          parameters?: Json | null
          processing_time_ms?: number | null
          prompt?: string
          safety_rating?: Json | null
          status?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_sessions: {
        Row: {
          failed_generations: number | null
          id: string
          metadata: Json | null
          session_end: string | null
          session_start: string
          successful_generations: number | null
          total_credits_used: number | null
          total_generations: number | null
          user_id: string | null
        }
        Insert: {
          failed_generations?: number | null
          id?: string
          metadata?: Json | null
          session_end?: string | null
          session_start?: string
          successful_generations?: number | null
          total_credits_used?: number | null
          total_generations?: number | null
          user_id?: string | null
        }
        Update: {
          failed_generations?: number | null
          id?: string
          metadata?: Json | null
          session_end?: string | null
          session_start?: string
          successful_generations?: number | null
          total_credits_used?: number | null
          total_generations?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      image_interactions: {
        Row: {
          created_at: string
          id: string
          image_id: string
          interaction_type: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_id: string
          interaction_type: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_id?: string
          interaction_type?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_interactions_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_interactions_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "popular_images"
            referencedColumns: ["id"]
          },
        ]
      }
      model_performance: {
        Row: {
          avg_processing_time: number | null
          id: string
          model_id: string
          success_rate: number | null
          total_generations: number | null
          updated_at: string | null
          user_satisfaction: number | null
        }
        Insert: {
          avg_processing_time?: number | null
          id?: string
          model_id: string
          success_rate?: number | null
          total_generations?: number | null
          updated_at?: string | null
          user_satisfaction?: number | null
        }
        Update: {
          avg_processing_time?: number | null
          id?: string
          model_id?: string
          success_rate?: number | null
          total_generations?: number | null
          updated_at?: string | null
          user_satisfaction?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          is_verified: boolean | null
          preferences: Json | null
          social_links: Json | null
          subscription_id: string | null
          updated_at: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          preferences?: Json | null
          social_links?: Json | null
          subscription_id?: string | null
          updated_at?: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          preferences?: Json | null
          social_links?: Json | null
          subscription_id?: string | null
          updated_at?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_library: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_public: boolean | null
          prompt: string
          tags: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          prompt: string
          tags?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          prompt?: string
          tags?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompt_library_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quality_assessments: {
        Row: {
          artistic_score: number | null
          assessed_by: string | null
          created_at: string | null
          id: string
          image_id: string | null
          overall_score: number | null
          technical_score: number | null
        }
        Insert: {
          artistic_score?: number | null
          assessed_by?: string | null
          created_at?: string | null
          id?: string
          image_id?: string | null
          overall_score?: number | null
          technical_score?: number | null
        }
        Update: {
          artistic_score?: number | null
          assessed_by?: string | null
          created_at?: string | null
          id?: string
          image_id?: string | null
          overall_score?: number | null
          technical_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quality_assessments_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_assessments_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "generated_images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quality_assessments_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "popular_images"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          metadata: Json | null
          plan_type: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          metadata?: Json | null
          plan_type: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          metadata?: Json | null
          plan_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_analytics: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          processed: boolean
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: unknown | null
          processed?: boolean
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          processed?: boolean
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usage_analytics_archive: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: unknown | null
          processed: boolean
          session_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address?: unknown | null
          processed: boolean
          session_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: unknown | null
          processed?: boolean
          session_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          bonus_credits: number | null
          created_at: string
          credits_remaining: number
          credits_used: number
          id: string
          lifetime_credits_used: number | null
          monthly_limit: number | null
          plan_type: string
          reset_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bonus_credits?: number | null
          created_at?: string
          credits_remaining?: number
          credits_used?: number
          id?: string
          lifetime_credits_used?: number | null
          monthly_limit?: number | null
          plan_type?: string
          reset_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bonus_credits?: number | null
          created_at?: string
          credits_remaining?: number
          credits_used?: number
          id?: string
          lifetime_credits_used?: number | null
          monthly_limit?: number | null
          plan_type?: string
          reset_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      popular_images: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          credits_used: number | null
          download_count: number | null
          error_message: string | null
          id: string | null
          image_url: string | null
          is_public: boolean | null
          like_count: number | null
          model: string | null
          parameters: Json | null
          processing_time_ms: number | null
          prompt: string | null
          safety_rating: Json | null
          status: string | null
          user_id: string | null
          username: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_images_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      deduct_credits: {
        Args: { user_id: string; credits_to_deduct: number }
        Returns: boolean
      }
      deduct_credits_v2: {
        Args: {
          user_id: string
          credits_to_deduct: number
          description?: string
          reference_id?: string
          reference_type?: string
        }
        Returns: boolean
      }
      refresh_popular_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      track_usage: {
        Args: {
          user_id: string
          event_type: string
          event_data?: Json
          session_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
