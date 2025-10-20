export interface User {
  id: number;
  name: string;
  email: string;
  profile: {
    name: string;
    bio: string;
    location: string;
    birth_date: string;
    age: number;
    profile_picture_url?: string;
  };
}