// Match BE response structure
export type Expert = {
  id: number;
  user_uuid: string;
  full_name: string;
  expertise: string;
  fees_per_session: number;
  city: string;
  user: User;
  experience_years: number;
  dob: string;
  rating: number;
  total_sessions: number;
  verification_status: string;
  student_mentored: number;
  is_available: boolean;
  about_me?: string;
  profile_picture_url?: string;
};

export type User = {
  id: number;
  user_uuid: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  picture: string;
  role: string;
};
