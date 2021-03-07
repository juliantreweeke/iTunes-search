import { SET_ALBUM } from "../Types";
import {
  formatDateStringToYear,
  resizeITunesImageURL,
  millisecondsToMinutes,
} from "../../helpers/helpers";

const parseAlbum = (data) => {
  return (dispatch) => {
    const [album, ...trackList] = data;

    const parsedTrackList = trackList.map((track) => {
      return {
        title: track.artistName,
        text: track.trackName,
        detail: millisecondsToMinutes(track.trackTimeMillis),
        image: track.artworkUrl100
      };
    });

    const parsedData = {
      detail: formatDateStringToYear(album.releaseDate),
      title: album.collectionName,
      text: album.artistName,
      image: resizeITunesImageURL(album.artworkUrl100, 500),
      url: album.artistViewUrl,
      trackList: parsedTrackList,
    };
    dispatch(setAlbum(parsedData));
  };
};

const setAlbum = (data) => {
  return {
    type: SET_ALBUM,
    payload: {
      data,
    },
  };
};

const albumActions = {
  parseAlbum,
  setAlbum,
};

export default albumActions;
