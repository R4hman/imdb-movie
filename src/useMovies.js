import { useEffect, useState } from "react";

export const key = "bc011bc2";

export const useMovies = (query) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // const controller = new AbortController();
    async function getMovie() {
      try {
        setIsLoading(true);
        setError(null);
        if (!query) {
          //   setMovies(tempMovieData);
          setMovies([]);
          return;
        }
        const data = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&s=${query}`
          // { signal: controller.signal }
        );
        if (!data.ok)
          throw new Error("Something went wrong with fetching movies");
        const res = await data.json();
        // console.log("res", res);
        // console.log("response", res.Response);
        if (res.Response === "False") {
          console.log("yes it is");
          throw new Error("Movie not found");
        }

        setMovies(res.Search);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
        console.log("error", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    // handleCloseMovie();

    // coxlu fetch getmeyin qarsini almaq ucun 1 saniye gec cagirmaq
    const setTimer = setTimeout(() => {
      getMovie();
    }, 1000);

    //abort ilede etmek mumkundur
    // return function () {
    //   controller.abort();
    // };

    // her fetchden once evvelkini silmek
    return function () {
      clearTimeout(setTimer);
    };
  }, [query]);

  return {
    movies,
    isLoading,
    error,
  };
};
