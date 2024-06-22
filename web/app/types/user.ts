import { Session } from "next-auth";

export type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  provider: string;
  providerAccountId: string;
  ab_test_group: boolean;
  created_at: string;
  updated_at: string;
};

export interface ExtendedSession extends Session {
  user: {
    name?: string;
    email?: string;
    image?: string;
    ab?: boolean;
  };
}
