import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Chat: { chatId: number, otherUserName: string };
  CreateProfile: { isEdit?: boolean };
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Matches: undefined;
  Chats: undefined;
  Profile: undefined;
};

export type NavigationProp = StackNavigationProp<RootStackParamList>;

export type UserPicture = {
  id: number;
  picture_url: string;
};

export type Profile = {
  id: number;
  user_id: number;
  name: string;
  bio: string | null;
  location: string | null;
  age: number | null;
  birth_date: string | null;
  profile_picture_url: string | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  profile: Profile | null;
  pictures: UserPicture[];
};