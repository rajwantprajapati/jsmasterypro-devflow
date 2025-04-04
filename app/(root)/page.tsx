import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();

  console.log(session);

  return (
    <>
      <h1 className="h1-bold">Hey there! This is a Next.js app.</h1>

      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";

          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      ></form>
    </>
  );
};

export default Home;
