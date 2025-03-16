import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Spinner from "./components/spinner";
import { useEffect, useState } from "react";

const API_BSE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TBMD_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [movielist, setMovieslist] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  // Fetch movies function
  const fetchMovies = async (query = '') => {
    setisLoading(true);
    setErrorMsg('');
    try {
      const endpoint = query ? `${API_BSE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BSE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }
      const data = await response.json();
      if(data.Response === 'False'){
        setErrorMsg(data.Error || 'Failed to Fetch Movies');
        setMovieslist ([]);
        return;
      }
      setMovieslist(data.results || []);  // Assuming the movie results are under "results"
    } catch (error) {
      console.error(`Error To Fetching Movies: ${error}`);
      setErrorMsg("Error to Fetch the movies. Please try again later");
    } finally {
      setisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero" />
            <h1>Find the <span className="text-gradient">Best Movies</span> Which you want to Enjoy</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies">
            <h2 className="mt-[20px]">Popular Movies</h2>
           {isLoading ? (
            <Spinner/>
           ): errorMsg ? (
            <p className=" text-red-700 ">
              {errorMsg}
            </p>
           ): (
           <ul>
            {movielist.map((movie) =>(
             <MovieCard key={movie.id} movie={movie}/>
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
