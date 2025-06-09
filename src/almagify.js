export async function almagify(token) {
  // Pull URIs from each playlist

  let playlist1 = await listify(
    'https://api.spotify.com/v1/playlists/1iQbsTFCLjRXa6q5NtDjOe/tracks',
    token
  );

  let playlist2 = await listify(
    'https://api.spotify.com/v1/playlists/2M33mOGJeSPXkeOqUcKh3H/tracks',
    token
  );

  // Pick 10 random songs from each and order them A B

  const almagifyList = [];

  for (let i = 0; i < 10; i++) {
    almagifyList.push(playlist2[Math.floor(Math.random() * playlist2.length)]);
    almagifyList.push(playlist1[Math.floor(Math.random() * playlist1.length)]);
  }

  console.log(almagifyList);
  return almagifyList;
}

async function listify(url, token) {
  list = [];

  // const playlistPromise = await fetch(`${url}`, {
  //   method: 'GET',
  //   headers: { Authorization: `Bearer ${token}` },
  // });

  const playlistObj = await fetchTracks(token, url);

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
