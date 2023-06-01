'use client';

import axios, { type AxiosResponse } from 'axios';

import { api } from '~/utils/api';

interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

const useSpotifyRefreshToken = (auth_header: string) => {
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  const updateToken = api.spotify.updateToken.useMutation();
  const refreshAccessToken = async (
    tok: string
  ): Promise<string | undefined> => {
    try {
      const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        tokenEndpoint,
        {
          grant_type: 'refresh_token',
          refresh_token: tok,
        },
        {
          headers: {
            Authorization: auth_header,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      updateToken.mutate({ accessTok: response.data.access_token });
      return response.data.access_token;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  };

  return refreshAccessToken;
};

export default useSpotifyRefreshToken;
