import { type NextPage } from 'next';
import Head from 'next/head';
import { signIn, useSession } from 'next-auth/react';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  //   const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>TransPlaylist</title>
        <meta
          name="description"
          content="A web based tool that transfers playlists between platforms"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#00e46b] to-[#000000]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            TransPlaylist
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-8">
            <Image
              height={100}
              width={100}
              src="/img/Spotify.svg"
              alt="Spotify Logo"
            />
            <div className="flex max-w-xs rounded-xl align-middle">
              <Image
                className="collapse sm:visible"
                height={100}
                width={100}
                src="/img/arrow.svg"
                alt="Some Arrow"
              />
            </div>
            <Image
              className="mt-4"
              height={100}
              width={100}
              src="/img/Youtube.png"
              alt="YouTube Logo"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!!sessionData && !!sessionData.user) {
      router.push('/manager').catch((err: unknown) => console.log(err));
    }
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => {
          void signIn();
        }}
      >
        Sign In
      </button>
    </div>
  );
};
