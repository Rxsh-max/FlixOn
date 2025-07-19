import { useState, useEffect } from "react";
import AnimatedSearch from "./components/AnimatedSearch";
import Loader from "./components/Loader";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "../appwrite";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerms, setSearchTerms] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerms, setDebounceSearchTerms] = useState("");
  const  [trendingMovies , setTrendingMovies] = useState([])

  useDebounce(() => setDebounceSearchTerms(searchTerms), 1000, [searchTerms]);
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch Movies");
      }
      
      const data = await response.json();
      

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching Movies: ${error}`);
      setErrorMessage("Error fetching Movies. Please try again Later");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async() => {
    try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
      
    } catch (error) {

      console.error(`Error fetching Trending movies : ${error}`)
      
    }
  }

  useEffect(() => {
    fetchMovies(debounceSearchTerms);
  }, [debounceSearchTerms]);

  useEffect(()=>{
    loadTrendingMovies()
  },[])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies </span>You'll Enjoy
              Without the Hassle
            </h1>
            <AnimatedSearch
              searchTerms={searchTerms}
              setSearchTerms={setSearchTerms}
            />
          </header>
            {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie,index)=>(
                    <li key={movie.$id}>
                      <p>{index+1}</p>
                      <img src={movie.poster_url} alt={movie.title}/>
                    </li>
))}
                </ul>
              </section>
            ) }
          <section className="all-movies">
            <h2 >All Movies</h2>
            {isLoading ? (
              <Loader />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="text-white">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
