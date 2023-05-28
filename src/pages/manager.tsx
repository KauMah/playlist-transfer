import { type NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Manager: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!data || !data.user || !data.user.id) {
      router
        .push("/")
        .then(() => console.log("Need auth"))
        .catch((e: unknown) => console.error(e));
    }
  }, [data, router]);
  return (
    <>
      <Head>
        <title>TransPlaylist - Manager</title>
        <meta name="description" content="TransPlaylist - Playlist Manager" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="h-100 flex w-full flex-row bg-gradient-to-b from-[#054f05] to-[#003318] p-5">
          <h1 className="text-4xl text-white">TransPlaylist</h1>
          <div className="flex w-full flex-row-reverse border-red-400">
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Manager;
