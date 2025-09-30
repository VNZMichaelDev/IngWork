import { createSupabaseBrowserClient } from "./supabase/client";
import { UserRole } from "./types";

export interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
  full_name?: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  // Engineer specific fields
  specialty?: string;
  experience_years?: number;
  availability?: string;
  hourly_rate?: number;
  company?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

// Client-side auth functions
export const authClient = {
  async signUp(email: string, password: string, role: UserRole) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getUser() {
    const supabase = createSupabaseBrowserClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async getProfile(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
    const supabase = createSupabaseBrowserClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return { profile, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    return { data, error };
  },

  async createProfile(profile: Omit<Profile, "created_at" | "updated_at">) {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    return { data, error };
  },
};

// Eliminamos authServer por ahora - solo usamos authClient
