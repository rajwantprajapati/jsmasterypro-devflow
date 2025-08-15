import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { SignInSchema } from "./lib/validations";
import { api } from "./lib/api";
import { IUserDoc } from "./database/user.model";
import bcrypt from "bcryptjs";
import { IAccountDoc } from "./database/account.model";

import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const { data: existingAccount } = (await api.accounts.getByProvider(
            email
          )) as AccountResponse<IUserDoc>;

          if (!existingAccount) {
            return null;
          }

          const { data: existingUser } = (await api.users.getById(
            existingAccount.userId.toString()
          )) as UserResponse<IAccountDoc>;

          if (!existingUser) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            password,
            existingAccount.password!
          );

          if (isValidPassword) {
            return {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              image: existingUser.image,
            };
          }
        }
        return null;
      },
    }),
  ],
});
