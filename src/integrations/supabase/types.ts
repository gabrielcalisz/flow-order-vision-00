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
      orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_city: string
          customer_cpf: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string
          customer_state: string
          customer_zip_code: string
          estimated_delivery_date: string | null
          free_shipping: boolean
          id: string
          product_image_url: string | null
          product_name: string
          product_price: number
          product_quantity: number
          shipping_price: number
          tracking_code: string
          tracking_company: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_city: string
          customer_cpf: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string
          customer_state: string
          customer_zip_code: string
          estimated_delivery_date?: string | null
          free_shipping?: boolean
          id?: string
          product_image_url?: string | null
          product_name: string
          product_price?: number
          product_quantity?: number
          shipping_price?: number
          tracking_code: string
          tracking_company: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_city?: string
          customer_cpf?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_phone?: string
          customer_state?: string
          customer_zip_code?: string
          estimated_delivery_date?: string | null
          free_shipping?: boolean
          id?: string
          product_image_url?: string | null
          product_name?: string
          product_price?: number
          product_quantity?: number
          shipping_price?: number
          tracking_code?: string
          tracking_company?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      tracking_steps: {
        Row: {
          created_at: string
          delivery_city: string | null
          destination_city: string | null
          id: string
          order_id: string
          origin_city: string | null
          status_type: Database["public"]["Enums"]["tracking_status_type"]
        }
        Insert: {
          created_at?: string
          delivery_city?: string | null
          destination_city?: string | null
          id?: string
          order_id: string
          origin_city?: string | null
          status_type: Database["public"]["Enums"]["tracking_status_type"]
        }
        Update: {
          created_at?: string
          delivery_city?: string | null
          destination_city?: string | null
          id?: string
          order_id?: string
          origin_city?: string | null
          status_type?: Database["public"]["Enums"]["tracking_status_type"]
        }
        Relationships: [
          {
            foreignKeyName: "tracking_steps_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
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
      tracking_status_type:
        | "processed"
        | "forwarded"
        | "inTransit"
        | "cancelled"
        | "outForDelivery"
        | "delivered"
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
    Enums: {
      tracking_status_type: [
        "processed",
        "forwarded",
        "inTransit",
        "cancelled",
        "outForDelivery",
        "delivered",
      ],
    },
  },
} as const
