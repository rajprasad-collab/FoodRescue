import { supabase } from "./supabase";

export interface Donation {
  id: string;
  donor_id: string;
  food_type: string;
  quantity: number;
  prepared_at: string;
  expiry_at: string;
  demand_score: number;
  donor_priority: number;
  location: string;
  status: string;
  priority_score: number;
  urgency: string;
  assigned_center_id: string | null;
  created_at: string;
}

export async function getDonations(): Promise<Donation[]> {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("priority_score", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getAvailableDonations(): Promise<Donation[]> {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("status", "AVAILABLE")
    .order("priority_score", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}