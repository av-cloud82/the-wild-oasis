import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, response }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch {
        return false;
      }
    },

    async jwt({ token, user }) {
      // Если пользователь залогинился (это момент входа)
      if (user && !token.guestId) {
        // Идем в базу данных ОДИН РАЗ
        const guest = await getGuest(user.email);

        // Записываем данные в токен (в «рюкзак»)
        token.guestId = guest.id;
      }
      // Если пользователь уже залогинен, мы просто возвращаем существующий токен
      return token;
    },

    async session({ session, token }) {
      // Перекладываем данные из токена в сессию (на «витрину»)
      // Никаких запросов к базе здесь больше нет!
      session.user.guestId = token.guestId;
      session.user.role = token.role;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
