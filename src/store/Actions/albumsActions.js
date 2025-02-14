import {
  RESET_FOCUS_AND_DISPLAY_NUMBER,
  SET_ALBUMS,
  SET_DISPLAYED_ALBUMS,
  SET_ALBUM_FOCUS_FROM_STORAGE,
  SET_NUMBER_OF_ALBUMS_TO_DISPLAY,
} from "../Types";
import { sessionStore } from "../../utils/storage";
import { SESSION_STORAGE_KEYS } from "../../constants";
import {
  filterArrOfObjectsByKey,
  formatDateStringToYear,
  resizeITunesImageURL,
} from "../../helpers/helpers";

const initAlbums = () => {
  return (dispatch) => {
    dispatch(setAlbumFocusFromStorage());
    dispatch(setNumberOfAlbumsToDisplay());
  };
};

/**
 * Updates and formats array of objects from api request
 * to be more easily used in components.
 *
 * @param {data} array an array of objects
 */
const parseAlbums = (data) => {
  const albumKey = "collectionId";

/**
 * Check that all the objects in the data have a collectionId.
 */
  const getCollectionsInData = data.filter((obj) =>
    Object.keys(obj).includes(albumKey)
  );

/**
 * As the iTunes API has no way of specifing music type aka songs, albums etc
 * This makes sure that only albums from the api are stored.
 */
  const albumsFilteredByUniqueCollection = filterArrOfObjectsByKey(
    getCollectionsInData,
    albumKey
  );

  return (dispatch) => {
    const parsedData = albumsFilteredByUniqueCollection.map((album) => {
      return {
        url: `/album/${album.collectionId}`,
        image: resizeITunesImageURL(album.artworkUrl100, 180),
        heading: album.collectionName,
        text: album.artistName,
        detail: formatDateStringToYear(album.releaseDate),
      };
    });
    dispatch(setAlbums(parsedData));
  };
};

const resetFocusAndDisplayNumber = () => {
  sessionStore.removeItem(SESSION_STORAGE_KEYS.albumsToDisplay);
  sessionStore.removeItem(SESSION_STORAGE_KEYS.album);
  return {
    type: RESET_FOCUS_AND_DISPLAY_NUMBER,
    payload: {},
  };
};

const setAlbums = (data) => {
  return {
    type: SET_ALBUMS,
    payload: {
      data,
    },
  };
};

const setDisplayedAlbums = (data) => {
  return {
    type: SET_DISPLAYED_ALBUMS,
    payload: {
      data,
    },
  };
};

/**
 * Checks session storage for a value stored of how many albums were last displayed.
 * If a value exists, send it on to be stored in reducer, and remove from session storage.
 */
const setNumberOfAlbumsToDisplay = () => {
  const sessionNumberOfAlbumsToDisplay = sessionStore.getItem(
    SESSION_STORAGE_KEYS.albumsToDisplay
  );

  if (sessionNumberOfAlbumsToDisplay) {
    const data = Number(sessionNumberOfAlbumsToDisplay);
    sessionStore.removeItem(SESSION_STORAGE_KEYS.albumsToDisplay);
    return {
      type: SET_NUMBER_OF_ALBUMS_TO_DISPLAY,
      payload: {
        data,
      },
    };
  }

  return {
    type: SET_NUMBER_OF_ALBUMS_TO_DISPLAY,
    payload: {},
  };
};

/**
 * Checks session storage for the index of the last focused album.
 * If a value exists, send it on to be stored in reducer, and remove from session storage.
 */
const setAlbumFocusFromStorage = () => {
  const sessionAlbumToFocus = sessionStore.getItem(SESSION_STORAGE_KEYS.album);
  if (sessionAlbumToFocus) {
    const data = Number(sessionAlbumToFocus);
    sessionStore.removeItem(SESSION_STORAGE_KEYS.album);
    return {
      type: SET_ALBUM_FOCUS_FROM_STORAGE,
      payload: {
        data,
      },
    };
  }

  return {
    type: SET_ALBUM_FOCUS_FROM_STORAGE,
    payload: {},
  };
};

const albumsActions = {
  initAlbums,
  parseAlbums,
  resetFocusAndDisplayNumber,
  setAlbums,
  setAlbumFocusFromStorage,
  setDisplayedAlbums,
  setNumberOfAlbumsToDisplay,
};

export default albumsActions;
