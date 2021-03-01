const axios = require("axios");

const getAuth = async () => {
  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET,
    },
  };

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      headers
    );
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

module.exports.getReleases = async () => {
  const token = await getAuth();
  const albums = await getAlbums(token);
  const singles = await getSingles(token);
  const releases = [
    {
      type: "albums",
      releases: albums,
    },
    {
      type: "singles",
      releases: singles,
    },
  ];
  return releases;
};

const extractAlbumData = (data) => {
  let album = {
    artist: data.artists[0].name,
    title: data.name,
    image: data.images[1].url,
    url: data.external_urls.spotify,
    uri: data.uri,
    tracks: [],
  };
  return album;
};

const extractTrackData = (data, albumName) => {
  let track = {
    artist: data.artists[0].name,
    title: data.name,
    image: data.album.images[1].url,
    url: data.external_urls.spotify,
    uri: data.uri,
    preview: data.preview_url,
  };
  if (albumName) track.album = albumName;
  return track;
};

const addTracksToAlbum = (songArray, uri) => {
  let albumTracks = songArray.filter((item) => item.album.includes(uri));
  return albumTracks;
};

const getAlbums = async (token) => {
  const data = await getPlaylistItems(token, process.env.ALBUM_URL, []);
  let albums = data.map((obj) => extractAlbumData(obj.track.album));
  let tracks = data.map((obj) =>
    extractTrackData(obj.track, obj.track.album.uri)
  );
  let filteredAlbums = [
    ...new Map(albums.map((obj) => [JSON.stringify(obj), obj])).values(),
  ];
  filteredAlbums.map(
    (item) => (item.tracks = addTracksToAlbum(tracks, item.uri))
  );
  return filteredAlbums;
};

const getSingles = async (token) => {
  const data = await getPlaylistItems(token, process.env.SINGLES_URL, []);
  let tracks = data.map((obj) => extractTrackData(obj.track));
  let filteredTracks = [
    ...new Map(tracks.map((obj) => [JSON.stringify(obj), obj])).values(),
  ];
  return filteredTracks;
};

async function getPlaylistItems(token, url, data) {
  let options = {
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const dataArray = data;
  await axios(options)
    .then((response) => {
      dataArray.push(...response.data.items);
      if (response.data.next) {
        return getPlaylistItems(token, response.data.next, dataArray);
      }
    })
    .catch((error) => {
      console.log("error: " + error);
    });
  return dataArray;
}
