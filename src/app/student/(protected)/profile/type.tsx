export type StudentProfileResponse = {
  user_uuid: string;
  full_name: string;
  role: string;
  email: string;
  phone: string;
  sessions: string;
  points: string;
  preparing_for: string;
  dob: string;
  city: string;
  about_me: string;
  skills: string[];
  /** Google avatar, if the account was created via OAuth. */
  picture?: string;
  /** Durable object key — round-tripped on save so edits never drop the photo. */
  profile_picture_key?: string | null;
  /** Presigned R2 URL; expires after 24h, so re-fetch rather than caching it. */
  profile_picture_url?: string;
};
