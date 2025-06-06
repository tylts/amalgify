export async function almagify(token) {
  // TODO: Build two sets of 10 tracks from list 1 and list 2

  // let playlist1 = fetchFromPlaylist1(token);

  let playlist1 = await fetchFromPlaylist(
    'https://api.spotify.com/v1/playlists/1iQbsTFCLjRXa6q5NtDjOe/tracks',
    token
  );

  let playlist2 = await fetchFromPlaylist(
    'https://api.spotify.com/v1/playlists/2M33mOGJeSPXkeOqUcKh3H/tracks',
    token
  );

  console.log(playlist1);
  console.log(playlist2);

  // let playlist2 = fetchFromPlaylist2(token);

  // TODO: Combine them in an A B pattern
}

async function fetchFromPlaylist(url, token) {
  list = [];

  const playlistPromise = await fetch(`${url}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const playlistObj = await playlistPromise.json();

  const songs = playlistObj.items;

  songs.forEach((element) => {
    list.push(element.track.uri);
  });

  // if playlist has over 100 songs, iterate through playlistObj and each next url from spotify API, and then add them to list array
  if (playlistObj.total > 100) {
    let currPlaylistObj = playlistObj;
    for (let i = 1; i <= Math.floor(playlistObj.total / 100); i++) {
      currPlaylistObj = await fetchTracks(token, currPlaylistObj.next);
      currPlaylistObj.items.forEach((element) => {
        list.push(element.track.uri);
      });
    }
  }

  return list;
}

async function fetchTracks(token, listURL) {
  const result = await fetch(`${listURL}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}
