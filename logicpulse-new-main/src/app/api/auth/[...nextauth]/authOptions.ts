import { LOGIN_URL } from "@/lib/apiEndPoints";
import myAxios from "@/lib/axios.config";
import { AuthOptions, ISODateString, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export interface CustomUser extends User {
  unique_id: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  phone: string | null;
  skype: string | null;
  whats_app: string | null;
  age: string | null;
  gender: string | null;
  dob: string | null;
  country: string | null;
  province: string | null;
  city: string | null;
  details: string | null;
  language: string | null;
  time_zone: string | null;
  role: string | null;
  profile_image: string | null;
  email_verified_at: string | null;
  isVerified: string | null;
  status: string | null;
  notification: string | null;
  rate: string | null;
  domain_id: string | null;
  token?: string | null;
}

export interface CustomSession {
  token?: string | null;
  expires: ISODateString;
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Ensure type safety by casting user to CustomUser
        const customUser = user as CustomUser;
        token.token = customUser.token;
      }
      return token;
    },

    async session({ session, token }: { session: CustomSession; token: JWT }) {
      session.token = token.token as string;
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const res = await myAxios.post(LOGIN_URL, credentials);

          const response = res.data;
          if (response.user.token) {
            const user: CustomUser = {
              ...response.user,
              token: response.user.token,
            };
            return user;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
    }),
  ],
};
