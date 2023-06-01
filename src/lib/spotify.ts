import axios from 'axios';

const spotifyAPI = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

export default spotifyAPI;
