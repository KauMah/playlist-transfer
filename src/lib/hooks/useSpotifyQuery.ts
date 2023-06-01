'use client';

import spotifyAPI from '../spotify';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import useSpotifyRefreshToken from './useSpotifyRefreshToken';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const useSpotifyQuery = (
  access_token: string,
  refresh_token: string,
  auth_header: string
) => {
  const { data: session } = useSession();
  const refreshToken = useSpotifyRefreshToken(auth_header);

  useEffect(() => {
    const requestIntercept = spotifyAPI.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization'] && access_token) {
          config.headers['Authorization'] = `Bearer ${access_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = spotifyAPI.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const prev: RetryConfig | undefined = error.config;
        const resp = error.response;
        if (!!resp && resp.status === 401 && !!prev && !prev._retry) {
          prev._retry = true;
          const tok = await refreshToken(refresh_token);
          if (tok) prev.headers['Authorization'] = `Bearer ${tok}`;
          return spotifyAPI(prev);
        }
      }
    );
    return () => {
      spotifyAPI.interceptors.request.eject(requestIntercept);
      spotifyAPI.interceptors.request.eject(responseIntercept);
    };
  }, [access_token, session, refreshToken, refresh_token]);

  return spotifyAPI;
};

export default useSpotifyQuery;
