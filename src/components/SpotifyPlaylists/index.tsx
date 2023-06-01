import { type AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

import useSpotifyQuery from '~/lib/hooks/useSpotifyQuery';

interface SpotifyPlaylistProps {
  access_token: string;
  refresh_token: string;
  auth_header: string;
}

type SpotifyPlaylistImage = {
  url: string;
  height: number | null;
  width: number | null;
};

type SpotifyPlaylist = {
  collaborative: boolean;
  description: string;
  external_urls: unknown;
  href: string;
  id: string;
  images: SpotifyPlaylistImage[];
  name: string;
  owner: {
    external_urls: unknown;
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string;
  };
  public: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
  primary_color: unknown;
};

type SpotifyPlaylistResponse = {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: SpotifyPlaylist[];
};

const SpotifyPlaylists: React.FC<SpotifyPlaylistProps> = ({
  access_token,
  refresh_token,
  auth_header,
}) => {
  const [spotifyPlaylists, setSpotifyPlaylists] = useState<SpotifyPlaylist[]>(
    []
  );
  const spotifyAPI = useSpotifyQuery(access_token, refresh_token, auth_header);

  useEffect(() => {
    const getData = async () => {
      const data: AxiosResponse<SpotifyPlaylistResponse> = await spotifyAPI.get(
        '/me/playlists'
      );
      setSpotifyPlaylists(data.data.items);
    };
    void getData();
  }, [spotifyAPI]);

  return (
    <div>
      {!!spotifyPlaylists &&
        spotifyPlaylists.map((playlist) => (
          <div key={`playlist-${playlist.id}`}>
            <p>{`${playlist.name} - total songs: ${playlist.tracks.total}`}</p>
          </div>
        ))}
    </div>
  );
};

export default SpotifyPlaylists;
