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
      admin_online_status: {
        Row: {
          admin_user_id: string
          created_at: string
          id: string
          is_online: boolean
          last_seen: string
          updated_at: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string
          id?: string
          is_online?: boolean
          last_seen?: string
          updated_at?: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string
          id?: string
          is_online?: boolean
          last_seen?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_course_objectives: {
        Row: {
          course_id: string
          created_at: string
          id: string
          objective_text: string
          order_index: number
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          objective_text: string
          order_index: number
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          objective_text?: string
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_course_objectives_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "ai_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_courses: {
        Row: {
          created_at: string
          current_lesson: number
          description: string | null
          grade_level: string
          id: string
          name: string
          total_lessons: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_lesson?: number
          description?: string | null
          grade_level: string
          id?: string
          name: string
          total_lessons?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_lesson?: number
          description?: string | null
          grade_level?: string
          id?: string
          name?: string
          total_lessons?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_lesson_parts: {
        Row: {
          content: string
          course_id: string
          created_at: string
          id: string
          lesson_number: number
          part_number: number
          title: string
        }
        Insert: {
          content: string
          course_id: string
          created_at?: string
          id?: string
          lesson_number: number
          part_number: number
          title: string
        }
        Update: {
          content?: string
          course_id?: string
          created_at?: string
          id?: string
          lesson_number?: number
          part_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_lesson_parts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "ai_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_questions: {
        Row: {
          assessment_id: string | null
          correct_answer: string | null
          created_at: string
          explanation: string | null
          id: string
          options: Json | null
          order_index: number
          points: number | null
          question_text: string
          question_type: string
        }
        Insert: {
          assessment_id?: string | null
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          points?: number | null
          question_text: string
          question_type?: string
        }
        Update: {
          assessment_id?: string | null
          correct_answer?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number
          points?: number | null
          question_text?: string
          question_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_responses: {
        Row: {
          assessment_id: string | null
          created_at: string
          id: string
          is_correct: boolean | null
          points_earned: number | null
          question_id: string | null
          time_spent_seconds: number | null
          user_answer: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id?: string | null
          time_spent_seconds?: number | null
          user_answer?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id?: string | null
          time_spent_seconds?: number | null
          user_answer?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "assessment_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_results: {
        Row: {
          assessment_id: string | null
          completed_at: string
          feedback: string | null
          id: string
          max_score: number
          percentage: number | null
          time_taken_seconds: number | null
          total_score: number
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          completed_at?: string
          feedback?: string | null
          id?: string
          max_score?: number
          percentage?: number | null
          time_taken_seconds?: number | null
          total_score?: number
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          completed_at?: string
          feedback?: string | null
          id?: string
          max_score?: number
          percentage?: number | null
          time_taken_seconds?: number | null
          total_score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_results_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          status: string | null
          subject: string
          title: string
          total_questions: number
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          status?: string | null
          subject: string
          title: string
          total_questions?: number
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          status?: string | null
          subject?: string
          title?: string
          total_questions?: number
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          subject: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          subject?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          subject?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          deleted: boolean
          email: string
          id: string
          is_from_admin: boolean
          message: string
          message_type: string
          name: string
          phone: string | null
          reply_to_message_id: string | null
          session_id: string | null
          status: string
          subject: string
          thread_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          deleted?: boolean
          email: string
          id?: string
          is_from_admin?: boolean
          message: string
          message_type?: string
          name: string
          phone?: string | null
          reply_to_message_id?: string | null
          session_id?: string | null
          status?: string
          subject: string
          thread_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          deleted?: boolean
          email?: string
          id?: string
          is_from_admin?: boolean
          message?: string
          message_type?: string
          name?: string
          phone?: string | null
          reply_to_message_id?: string | null
          session_id?: string | null
          status?: string
          subject?: string
          thread_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "contact_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      course_content: {
        Row: {
          content_text: string | null
          content_type: string
          content_url: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_downloadable: boolean | null
          order_index: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content_text?: string | null
          content_type: string
          content_url?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_downloadable?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content_text?: string | null
          content_type?: string
          content_url?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_downloadable?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_content_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completion_date: string | null
          course_id: string | null
          enrollment_date: string
          id: string
          is_active: boolean | null
          progress_percentage: number | null
          user_id: string | null
        }
        Insert: {
          completion_date?: string | null
          course_id?: string | null
          enrollment_date?: string
          id?: string
          is_active?: boolean | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Update: {
          completion_date?: string | null
          course_id?: string | null
          enrollment_date?: string
          id?: string
          is_active?: boolean | null
          progress_percentage?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_grades: {
        Row: {
          assignment_title: string
          course_id: string
          created_at: string
          feedback: string | null
          grade: number
          graded_at: string
          id: string
          max_grade: number
          student_id: string
        }
        Insert: {
          assignment_title: string
          course_id: string
          created_at?: string
          feedback?: string | null
          grade: number
          graded_at?: string
          id?: string
          max_grade?: number
          student_id: string
        }
        Update: {
          assignment_title?: string
          course_id?: string
          created_at?: string
          feedback?: string | null
          grade?: number
          graded_at?: string
          id?: string
          max_grade?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_grades_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          is_free: boolean | null
          materials_count: number | null
          price: number | null
          rating: number | null
          students_count: number | null
          subject: string
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          materials_count?: number | null
          price?: number | null
          rating?: number | null
          students_count?: number | null
          subject: string
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          materials_count?: number | null
          price?: number | null
          rating?: number | null
          students_count?: number | null
          subject?: string
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_progress: {
        Row: {
          created_at: string
          id: string
          last_studied_at: string | null
          progress_percentage: number | null
          subject: string
          topic: string
          total_study_time_minutes: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          last_studied_at?: string | null
          progress_percentage?: number | null
          subject: string
          topic: string
          total_study_time_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          last_studied_at?: string | null
          progress_percentage?: number | null
          subject?: string
          topic?: string
          total_study_time_minutes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_favorite: boolean | null
          subject: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          subject?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          subject?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      password_reset_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp?: string
          used?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client_name: string
          completion_date: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_featured: boolean
          project_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_name: string
          completion_date?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          project_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          completion_date?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean
          project_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          features: string[]
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          features?: string[]
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_ai: boolean
          session_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_ai?: boolean
          session_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_ai?: boolean
          session_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      teacher_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          specialization: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          specialization?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          specialization?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          client_company: string | null
          client_name: string
          client_position: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          client_company?: string | null
          client_name: string
          client_position?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          client_company?: string | null
          client_name?: string
          client_position?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_read?: boolean
          message: string
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_messaging_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          session_token: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          session_token: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          session_token?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_user_messaging_session: {
        Args: { user_uuid: string }
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
