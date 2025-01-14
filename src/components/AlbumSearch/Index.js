import React, { useEffect, useState } from "react";
import SearchForm from "../SearchForm/Index";
import useAlbums from "../../hooks/useAlbums";
import useSearchQuery from "../../hooks/useSearchQuery";
import useError from "../../hooks/useError";
import useFetch from "../../hooks/useFetch";
import { useHistory, useLocation } from "react-router-dom";

import EN from "../../EN.json";

const AlbumSearch = () => {
  const [url, setUrl] = useState("");

  const { parseAlbums, resetFocusAndDisplayNumber } = useAlbums();
  const { setSearchQuery } = useSearchQuery();
  const { fetchError, fetchedData, fetchLoading } = useFetch(url);
  const { setError } = useError();

  const history = useHistory();
  const { search: searchParam } = useLocation();
  const setUrlSearchQuery = (searchQuery) => {
    setUrl(`/search?term=${searchQuery}&media=music`)
    setSearchQuery(searchQuery);
  };

  const handleSearch = ({ searchQuery }) => {
    resetFocusAndDisplayNumber();
    setUrlSearchQuery(searchQuery);
    history.replace(`/?search=${searchQuery}`);
  };

  useEffect(() => {
    if (!fetchedData.results && searchParam) {
      const URLSearchQuery = new URLSearchParams(searchParam).get("search");
      URLSearchQuery && setUrlSearchQuery(URLSearchQuery);
    }
  })

  useEffect(() => {
    if (!fetchLoading && fetchedData.results) {
      parseAlbums(fetchedData.results);
    }
    if (!fetchLoading && fetchError) {
      setError(fetchError);
    }
  }, [fetchError, fetchedData, fetchLoading, parseAlbums, setError]);

  return (
      <SearchForm
        handleSearch={handleSearch}
        loading={fetchLoading}
        placeholder={EN.SEARCH_ALBUMS}
      />
  );
};

AlbumSearch.propTypes = {};

export default AlbumSearch;
