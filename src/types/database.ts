export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      blocks: {
        Row: { blocked_id: string; blocker_id: string; created_at: string };
        Insert: { blocked_id: string; blocker_id: string; created_at?: string };
        Update: { blocked_id?: string; blocker_id?: string; created_at?: string };
        Relationships: [
          { foreignKeyName: "blocks_blocked_id_fkey"; columns: ["blocked_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "blocks_blocker_id_fkey"; columns: ["blocker_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      comments: {
        Row: { author_id: string; body: string; created_at: string; id: string; journal_id: string; moderation_status: string };
        Insert: { author_id: string; body: string; created_at?: string; id?: string; journal_id: string; moderation_status?: string };
        Update: { author_id?: string; body?: string; created_at?: string; id?: string; journal_id?: string; moderation_status?: string };
        Relationships: [
          { foreignKeyName: "comments_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "comments_journal_id_fkey"; columns: ["journal_id"]; isOneToOne: false; referencedRelation: "journals"; referencedColumns: ["id"] },
        ];
      };
      films: {
        Row: { backdrop_path: string | null; created_at: string; id: string; original_language: string | null; original_title: string; overview: string | null; poster_path: string | null; release_date: string | null; title: string; tmdb_id: number; updated_at: string };
        Insert: { backdrop_path?: string | null; created_at?: string; id?: string; original_language?: string | null; original_title: string; overview?: string | null; poster_path?: string | null; release_date?: string | null; title: string; tmdb_id: number; updated_at?: string };
        Update: { backdrop_path?: string | null; created_at?: string; id?: string; original_language?: string | null; original_title?: string; overview?: string | null; poster_path?: string | null; release_date?: string | null; title?: string; tmdb_id?: number; updated_at?: string };
        Relationships: [];
      };
      follows: {
        Row: { created_at: string; follower_id: string; following_id: string };
        Insert: { created_at?: string; follower_id: string; following_id: string };
        Update: { created_at?: string; follower_id?: string; following_id?: string };
        Relationships: [
          { foreignKeyName: "follows_follower_id_fkey"; columns: ["follower_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "follows_following_id_fkey"; columns: ["following_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      journal_images: {
        Row: { created_at: string; height: number; id: string; journal_id: string; sort_order: number; storage_path: string; width: number };
        Insert: { created_at?: string; height: number; id?: string; journal_id: string; sort_order: number; storage_path: string; width: number };
        Update: { created_at?: string; height?: number; id?: string; journal_id?: string; sort_order?: number; storage_path?: string; width?: number };
        Relationships: [
          { foreignKeyName: "journal_images_journal_id_fkey"; columns: ["journal_id"]; isOneToOne: false; referencedRelation: "journals"; referencedColumns: ["id"] },
        ];
      };
      journal_likes: {
        Row: { created_at: string; journal_id: string; user_id: string };
        Insert: { created_at?: string; journal_id: string; user_id: string };
        Update: { created_at?: string; journal_id?: string; user_id?: string };
        Relationships: [
          { foreignKeyName: "journal_likes_journal_id_fkey"; columns: ["journal_id"]; isOneToOne: false; referencedRelation: "journals"; referencedColumns: ["id"] },
          { foreignKeyName: "journal_likes_user_id_fkey"; columns: ["user_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
      journals: {
        Row: { author_id: string; body: string | null; created_at: string; film_id: string; id: string; is_spoiler: boolean; moderation_status: string; mood: string; rating: number | null; reaction: string; updated_at: string; visibility: string; watched_on: string };
        Insert: { author_id: string; body?: string | null; created_at?: string; film_id: string; id?: string; is_spoiler?: boolean; moderation_status?: string; mood: string; rating?: number | null; reaction: string; updated_at?: string; visibility?: string; watched_on: string };
        Update: { author_id?: string; body?: string | null; created_at?: string; film_id?: string; id?: string; is_spoiler?: boolean; moderation_status?: string; mood?: string; rating?: number | null; reaction?: string; updated_at?: string; visibility?: string; watched_on?: string };
        Relationships: [
          { foreignKeyName: "journals_author_id_fkey"; columns: ["author_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "journals_film_id_fkey"; columns: ["film_id"]; isOneToOne: false; referencedRelation: "films"; referencedColumns: ["id"] },
        ];
      };
      profiles: {
        Row: { avatar_path: string | null; bio: string | null; created_at: string; display_name: string; id: string; updated_at: string; username: string | null };
        Insert: { avatar_path?: string | null; bio?: string | null; created_at?: string; display_name: string; id: string; updated_at?: string; username?: string | null };
        Update: { avatar_path?: string | null; bio?: string | null; created_at?: string; display_name?: string; id?: string; updated_at?: string; username?: string | null };
        Relationships: [];
      };
      reports: {
        Row: { created_at: string; details: string | null; id: string; reason: string; reporter_id: string; resolved_at: string | null; status: string; target_id: string; target_type: string };
        Insert: { created_at?: string; details?: string | null; id?: string; reason: string; reporter_id: string; resolved_at?: string | null; status?: string; target_id: string; target_type: string };
        Update: { created_at?: string; details?: string | null; id?: string; reason?: string; reporter_id?: string; resolved_at?: string | null; status?: string; target_id?: string; target_type?: string };
        Relationships: [
          { foreignKeyName: "reports_reporter_id_fkey"; columns: ["reporter_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      get_journal_feed: {
        Args: { feed_kind: string; cursor_created_at?: string | null; cursor_id?: string | null; page_size?: number };
        Returns: {
          id: string; author_id: string; author_username: string | null; author_display_name: string; author_avatar_path: string | null;
          film_title: string; film_original_title: string; film_poster_path: string | null; watched_on: string; mood: string; rating: number | null;
          reaction: string; is_spoiler: boolean; visibility: string; created_at: string; cover_storage_path: string | null; like_count: number; comment_count: number;
        }[];
      };
      users_are_blocked: {
        Args: { first_user_id: string; second_user_id: string };
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type PublicSchema = Database["public"];

export type Tables<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Row"];

export type TablesInsert<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][TableName]["Update"];
