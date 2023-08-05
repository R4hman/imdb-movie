import "./App.css";

import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const key = "bc011bc2";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // console.log("movies", movies);

  const handleQuery = (val) => {
    if (val.length < 3) {
      setMovies([]);
      return;
    }
    setQuery(val);
  };

  const handleSelectMovie = (id) => {
    setSelectedId((curr) => (curr === id ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  const handleAddWatchedMovie = (movie) => {
    setWatched((watched) => [...watched, movie]);
    setSelectedId(null);
  };

  const handleRemoveMovie = (id) => {
    setWatched((watched) => watched.filter((m) => m.imdbID !== id));
  };

  useEffect(() => {
    // const controller = new AbortController();
    async function getMovie() {
      try {
        setIsLoading(true);
        setError(null);
        if (!query) {
          setMovies(tempMovieData);
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

    handleCloseMovie();

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

  return (
    <div>
      <Header handleQuery={handleQuery} />
      <Main
        handleCloseMovie={handleCloseMovie}
        movies={movies}
        watched={watched}
        handleSelectMovie={handleSelectMovie}
        selectedId={selectedId}
        handleAddWatchedMovie={handleAddWatchedMovie}
        isLoading={isLoading}
        error={error}
        handleRemoveMovie={handleRemoveMovie}
      />
    </div>
  );
}

function Header({ handleQuery }) {
  return (
    <div className="header">
      <Logo />
      <SearchInput handleQuery={handleQuery} />
      <FoundResults />
    </div>
  );
}

function Logo() {
  return <div className="logo">🍿usePopcorn</div>;
}

function SearchInput({ handleQuery }) {
  return (
    <input
      onChange={(e) => handleQuery(e.target.value)}
      className="search-input"
      type="text"
    />
  );
}
function FoundResults() {
  return (
    <div className="found-result" placeholder="Search Movie">
      Found x results
    </div>
  );
}

function Main({
  handleCloseMovie,
  movies,
  watched,
  handleSelectMovie,
  selectedId,

  handleRemoveMovie,

  isLoading,
  error,
  handleAddWatchedMovie,
}) {
  return (
    <div className="main">
      <MoviesList
        movies={movies}
        handleSelectMovie={handleSelectMovie}
        error={error}
        isLoading={isLoading}
      />

      <SingleMovieContainer
        handleRemoveMovie={handleRemoveMovie}
        handleCloseMovie={handleCloseMovie}
        selectedId={selectedId}
        watched={watched}
        handleAddWatchedMovie={handleAddWatchedMovie}
      />
    </div>
  );
}

function Loader() {
  return (
    <p style={{ color: "white", fontSize: "25px", textAlign: "center" }}>
      Loading...
    </p>
  );
}

function ErrorMessage({ message }) {
  return (
    <p style={{ color: "red", fontSize: "25px", textAlign: "center" }}>
      {message}
    </p>
  );
}

function MoviesList({ movies, handleSelectMovie, error, isLoading }) {
  const data = movies.length > 0 ? movies : tempMovieData;

  const { Title, Year } = data;

  return (
    <Box>
      {isLoading && <Loader />}

      {!isLoading && !error && (
        <ul>
          {data.map((mov) => (
            <li
              onClick={() => handleSelectMovie(mov.imdbID)}
              className="movies-list"
              key={mov.imdbID}
            >
              <img className="movie-img" src={mov.Poster} alt={mov.Title} />
              <div className="movie-info">
                <h2 className="movie-title">{mov.Title}</h2>
                <p>{mov.Year}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <ErrorMessage message={error} />}
    </Box>
  );
}

function SingleMovieContainer({
  selectedId,
  watched,

  handleRemoveMovie,

  handleCloseMovie,
  handleAddWatchedMovie,
}) {
  return (
    <Box>
      {selectedId ? (
        <SingleMovieDetails
          selectedId={selectedId}
          handleCloseMovie={handleCloseMovie}
          handleAddWatchedMovie={handleAddWatchedMovie}
          watched={watched}
        />
      ) : (
        <>
          <WatchedMoviesInfo watched={watched} />
          <WatchedMovieContainer
            watched={watched}
            handleRemoveMovie={handleRemoveMovie}
          />
        </>
      )}
    </Box>
  );
}

function WatchedMoviesInfo({ watched }) {
  const averageUserRating = watched
    .map((m) => m.userRating)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

  const averageImdbRating = watched
    .map((m) => m.imdbRating)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

  const averageTimeWatched = watched
    .map((m) => m.Runtime)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

  watched.map((m) => console.log(m.imdbRating));

  return (
    <div className="watched-movies">
      <h2>Movies You Watched</h2>
      <p className="infos">
        <span className="movie-count">#️⃣ {watched.length}</span>
        <span> ⭐ {averageUserRating.toFixed(2)}</span>
        <span> ⭐ {averageImdbRating.toFixed(2)}</span>
        <span> ⏳ {averageTimeWatched.toFixed(0)} min </span>
      </p>
    </div>
  );
}

function WatchedMovieContainer({ watched, handleRemoveMovie }) {
  return (
    <div style={{ padding: "2rem" }}>
      {watched.map((m) => {
        console.log(m);
        return (
          <li className="movies-list" key={m.imdbID}>
            <img className="movie-img" src={m.Poster} alt={m.Title} />
            <div className="movie-info">
              <h2 className="movie-title">{m.Title}</h2>
              <p>
                <span>{m.Year}</span>
                <span>⭐{m.userRating}</span>
                <span>⭐{m.imdbRating}</span>
              </p>
            </div>
            <button
              onClick={() => handleRemoveMovie(m.imdbID)}
              className="remove-btn"
            >
              &times;
            </button>
          </li>
        );
      })}
    </div>
  );
}

// function ToggleBtn({ isOpen, setIsOpen }) {
//   return (
//     <button onClick={() => setIsOpen((curr) => !curr)} className="toggle-btn">
//       {isOpen ? "–" : "+"}
//     </button>
//   );
// }

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="movies-lists">
      <button onClick={() => setIsOpen((curr) => !curr)} className="toggle-btn">
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function SingleMovieDetails({
  selectedId,
  watched,

  handleCloseMovie,
  handleAddWatchedMovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map((m) => m.imdbID).includes(selectedId);

  const watchedMovieRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title,
    Poster,
    Genre,
    Runtime,
    Released,
    Plot,
    Actors,
    Director,
    Year,
    imdbRating,
  } = movie;

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      userRating,
      Title,
      Poster,
      Genre,
      Released,
      Plot,
      Actors,
      Director,
      Runtime: Number(Runtime.split(" ")[0]),
      Year,
      imdbRating: Number(imdbRating),
    };
    handleAddWatchedMovie(newWatchedMovie);
  };

  useEffect(() => {
    const callback = function (e) {
      if (e.code === "Escape") {
        handleCloseMovie();
        console.log("closing");
      }
    };

    document.addEventListener("keydown", callback);

    return function () {
      document.removeEventListener("keydown", callback);
    };
  }, [handleCloseMovie]);

  useEffect(() => {
    if (!Title) return;
    document.title = `Movie | ${Title}`;

    return function () {
      document.title = "usePopcorn";
    };
  }, [Title]);

  useEffect(() => {
    try {
      async function getSingleMovie() {
        setIsLoading(true);

        const data = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );

        const res = await data.json();
        if (res.Response === "False") {
          setMovie({});
          return;
        }
        setMovie(res);
        setIsLoading(false);
      }

      getSingleMovie();
    } catch (error) {
      setIsLoading(false);
    }
  }, [selectedId]);

  return (
    <div className="movie-details">
      <button className="back-btn" onClick={handleCloseMovie}>
        ←
      </button>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="movie-details-top">
            <div className="movie-detail-img">
              <img
                src={movie.Poster}
                // src="https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg"
                alt=""
              />
            </div>
            <div>
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              {/* <p>Short, Drama, Mystery</p> */}
              <p>⭐{movie.imdbRating} Imdb Rating</p>
            </div>
          </div>
          <div className="movie-details-middle">
            {isWatched ? (
              <p style={{ color: "white", fontSize: "20px" }}>
                You have rated this movie {watchedMovieRating} ⭐
              </p>
            ) : (
              <>
                <StarRating
                  onSetRating={setUserRating}
                  maxRating={10}
                  key={movie.imdbID}
                />

                {userRating > 0 && (
                  <button className="add-to-list" onClick={handleAdd}>
                    + Add to list
                  </button>
                )}
              </>
            )}
          </div>
          <div className="movie-details-bottom">
            <p>{movie.Plot}</p>
            <p>{movie.Actors}</p>
            <p>{movie.Director}</p>
          </div>
        </>
      )}
    </div>
  );
}
