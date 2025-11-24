import React, { useState, useEffect } from "react";
import "../../styles/home.css";


export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [city, setCity] = useState("Oulu");
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch movies from backend
    fetch("YOUR_API_URL/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data));
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  const nowShowing = filteredMovies.filter(
    (m) => m.status === "Now Showing"
  );

  const upcoming = filteredMovies.filter(
    (m) => m.status === "Upcoming"
  );

  return (
    <div className="home-container">

      {/* HEADER */}
      <h1 className="cinema-title">NORTH STAR CINEMAS</h1>
      <p className="cinema-sub">Experience Cinema Like Never Before</p>

      {/* SEARCH BAR */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CITY SELECTOR */}
      <div className="city-row">
        <span className="section-title">NOW SHOWING</span>
        <select
          className="city-dropdown"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option>Oulu</option>
          <option>Turku</option>
          <option>Helsinki</option>
        </select>
      </div>

      {/* NOW SHOWING MOVIES */}
      <div className="movie-grid">
        {nowShowing.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.posterUrl} className="movie-img" />

            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-genre">{movie.genre}</p>

            <button className="book-btn">BOOK NOW</button>
          </div>
        ))}
      </div>

      {/* UPCOMING SECTION */}
      <h2 className="section-title">Upcoming</h2>
      <div className="movie-grid">
        {upcoming.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img src={movie.posterUrl} className="movie-img" />

            <h3 className="movie-title">{movie.title}</h3>
            <p className="release">Release: {movie.releaseDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
