"use server";

import { createClient } from "@/lib/supabase/server";

interface BookingData {
  businessId: string;
  serviceId: string;
  scheduledAt: string;
  durationMinutes: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export async function createBooking(
  data: BookingData
): Promise<{ success: boolean; appointmentId?: string; error?: string }> {
  if (!data.name || !data.email || !data.phone) {
    return { success: false, error: "Naam, email en telefoon zijn verplicht" };
  }

  if (!data.scheduledAt) {
    return { success: false, error: "Kies een datum en tijd" };
  }

  const supabase = await createClient();

  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .insert({
      business_id: data.businessId,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
    })
    .select("id")
    .single();

  if (customerError || !customer) {
    return {
      success: false,
      error: "Kon klant niet aanmaken: " + (customerError?.message ?? "onbekende fout"),
    };
  }

  const { data: appointment, error: apptError } = await supabase
    .from("appointments")
    .insert({
      business_id: data.businessId,
      service_id: data.serviceId,
      customer_id: customer.id,
      scheduled_at: data.scheduledAt,
      duration_minutes: data.durationMinutes,
      status: "pending",
      notes: data.notes?.trim() || null,
    })
    .select("id")
    .single();

  if (apptError || !appointment) {
    return {
      success: false,
      error: "Kon afspraak niet inplannen: " + (apptError?.message ?? "onbekende fout"),
    };
  }

  return { success: true, appointmentId: appointment.id };
}
