import { redirectToAuthCodeFlow, getAccessToken } from './authCode';
import { almagify } from './almagify';

const clientId = '2530caf9b51a43839f562d972477f96d';
const params = new URLSearchParams(window.location.search);
const code = params.get('code');

const almagifyBtn = document.getElementById('almagify-btn');
const trackList = document.getElementById('list');

if (!code) {
  redirectToAuthCodeFlow(clientId);
} else {
  const accessToken = await getAccessToken(clientId, code);

  almagifyBtn.addEventListener('click', async () => {
    let playlist = await fetchTracks(accessToken);
    const uris = urifier(playlist);
    removeSongs(accessToken, uris);
    const newUris = await almagify(accessToken);
    addSongs(accessToken, newUris);
    playlist = await fetchTracks(accessToken);
    populateSongs(playlist, accessToken);
  });
}

async function populateSongs(playlist) {
  trackList.innerHTML = '';

  const songs = playlist.items;
  if (songs[0]) {
    songs.forEach((song) => {
      let newSong = document.createElement('li');
      newSong.textContent = `${song.track.name} by ${song.track.album.artists[0].name}. URI: ${song.track.uri}`;
      trackList.appendChild(newSong);
    });
  }

  trackList.innerHTML += `Total songs in playlist: ${playlist.total}`;
}

async function fetchTracks(token) {
  const result = await fetch(
    'https://api.spotify.com/v1/playlists/6y34Ay7dWznZf8utRAhbko/tracks',
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return await result.json();
}

// async function (token, playlist) {
//   songs = playlist.items;

//   while (songs[0]) {
//     deleteSong(token, songs[0]);
//     playlist = await fetchTracks(token);
//     songs = playlist.items;
//   }
//   populateSongs(playlist);
// }

async function removeSongs(token, uris) {
  const res = await fetch(
    'https://api.spotify.com/v1/playlists/6y34Ay7dWznZf8utRAhbko/tracks',
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracks: uris
        // [
        //   { uri: 'spotify:track:26BlpGNVcVFAfq5UUv3oEb' },
        //   { uri: 'spotify:track:26BlpGNVcVFAfq5UUv3oEb' },
        // ],
      })

      // {"tracks":[{"uri":"spotify:track:26BlpGNVcVFAfq5UUv3oEb"}]}
    }
  );
}

async function addSongs(token, uris) {
  const res = await fetch(
    'https://api.spotify.com/v1/playlists/6y34Ay7dWznZf8utRAhbko/tracks',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: uris
      })
    }
  );
  let playlist = await fetchTracks(token);
  populateSongs(playlist);
}

function urifier(playlist) {
  // console.log(playlist.items[0].track.uri);
  const songs = playlist.items;

  const uriArr = [];

  songs.forEach((song) => {
    // console.log(song.track.uri);
    uriArr.push({ uri: `${song.track.uri}` });
  });
  return uriArr;
}

// https://open.spotify.com/track/5TqGFc7FMRYzWgKXOkf62a?si=badedb6772a24452

// function populateUI(profile) {
//   document.getElementById('displayName').innerText = profile.display_name;
//   if (profile.images[0]) {
//     const profileImage = new Image(200, 200);
//     profileImage.src = profile.images[0].url;
//     document.getElementById('avatar').appendChild(profileImage);
//     document.getElementById('imgUrl').innerText = profile.images[0].url;
//   }
//   document.getElementById('id').innerText = profile.id;
//   document.getElementById('email').innerText = profile.email;
//   document.getElementById('uri').innerText = profile.uri;
//   document
//     .getElementById('uri')
//     .setAttribute('href', profile.external_urls.spotify);
//   document.getElementById('url').innerText = profile.href;
//   document.getElementById('url').setAttribute('href', profile.href);
// }

// https://open.spotify.com/track/4bOm66xzErSsqKn7Wv4Nfa?si=2c12ea2da93148fe
// https://open.spotify.com/track/4LPLOozTsUpkJqIvUqvELN?si=c4ee570210eb4c2b
// https://open.spotify.com/track/5enIaXUzYS4FHcwqPBCujc?si=907663443a774ab5
// https://open.spotify.com/track/3jK6mKpZLZSIPZRNCYIm3Q?si=28c51ba5221c447d
// https://open.spotify.com/track/3ctDczPeNAVPsVhWapQUug?si=7d5f4e3fb25e4710

// https://open.spotify.com/playlist/6y34Ay7dWznZf8utRAhbko?si=d7d22b7396d24d37

// { "tracks": [{ "uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh" },{ "uri": "spotify:track:1301WleyT98MSxVHPZCA6M" }] }
