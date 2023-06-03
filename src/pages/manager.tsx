import { type NextPage } from 'next';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SpotifyPlaylists from '~/components/SpotifyPlaylists';
import { api } from '~/utils/api';

const Manager: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  const tokens = api.spotify.spotifyToken.useQuery().data;
  const auth_header = api.spotify.refreshToken.useQuery().data;
  useEffect(() => {
    if (!data || !data.user || !data.user.id) {
      router.push('/').catch((e: unknown) => console.error(e));
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
              onClick={() => {
                signOut()
                  .then(() => {
                    router.push('/').catch((e: unknown) => console.error(e));
                  })
                  .catch((err) => console.error(err));
              }}
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="h-200 mx-5 text-center">
          {!!tokens &&
          tokens.access_token &&
          tokens.refresh_token &&
          auth_header ? (
            <SpotifyPlaylists
              access_token={tokens.access_token}
              refresh_token={tokens.refresh_token}
              auth_header={auth_header}
            />
          ) : null}
        </div>
      </main>
    </>
  );
};

export default Manager;
