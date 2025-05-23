
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
          role: 'patient' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role: 'patient' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: 'patient' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      admin_settings: {
        Row: {
          id: string
          admin_user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_duration_minutes: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          slot_duration_minutes?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          slot_duration_minutes?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blocked_periods: {
        Row: {
          id: string
          admin_user_id: string
          start_datetime: string
          end_datetime: string
          reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          admin_user_id: string
          start_datetime: string
          end_datetime: string
          reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string
          start_datetime?: string
          end_datetime?: string
          reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_user_id: string
          admin_user_id: string
          start_datetime: string
          end_datetime: string
          reason_for_visit: string | null
          status: 'booked' | 'cancelled_by_patient' | 'cancelled_by_admin' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_user_id: string
          admin_user_id: string
          start_datetime: string
          end_datetime: string
          reason_for_visit?: string | null
          status: 'booked' | 'cancelled_by_patient' | 'cancelled_by_admin' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_user_id?: string
          admin_user_id?: string
          start_datetime?: string
          end_datetime?: string
          reason_for_visit?: string | null
          status?: 'booked' | 'cancelled_by_patient' | 'cancelled_by_admin' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
