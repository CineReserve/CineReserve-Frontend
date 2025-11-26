import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homeModern.css";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [city, setCity] = useState("Oulu");

  // === ENABLE THIS WHEN BACKEND IS READY ===
  /*
  useEffect(() => {
    fetch(
      "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net/api/movies/search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Now Showing",
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Movie Fetch Error:", err));
  }, []);
  */

  // === TEMP DEMO DATA (REMOVE AFTER BACKEND) ===
  const demoMovies = [
    {
      movieID: 1,
      title: "Dune: Part Two",
      genre: "Sci-Fi, Adventure",
      durationMinutes: 166,
      language: "English",
      posterUrl: "https://m.media-amazon.com/images/M/MV5BM2Y3Njc4ZmUt.jpg",
    },
  ];

  const movieList = movies.length > 0 ? movies : demoMovies;
  const navigate = useNavigate();


  return (
    <div className="home-page">

      {/* Staff Login Button */}
      <button
        className="login-btn"
        onClick={() => (window.location.href = "/login")}
      >
        Staff Login
      </button>

      {/* Header */}
      <div className="header">
        <h1 className="title">NORTH STAR CINEMAS</h1>
        <p className="subtitle">Experience Cinema Like Never Before</p>

        {/* City Selector */}
        <div className="city-select-container">
          <span className="location-icon">📍</span>
          <select
            className="city-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option>Oulu</option>
            <option>Helsinki</option>
            <option>Turku</option>
          </select>
        </div>
      </div>

      {/* NOW SHOWING */}
      <h2 className="section-title">NOW SHOWING</h2>

      {movieList.length === 0 && (
        <p style={{ opacity: 0.6 }}>Loading movies...</p>
      )}

      {/* Movie Cards */}
      {movieList.map((movie) => (
        <div key={movie.movieID} className="movie-card">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-poster"
          />

          <div className="movie-info">
            <h3 className="movie-name">{movie.title}</h3>

            <p className="movie-genre">{movie.genre}</p>

            <p className="movie-details">
              ⏱ {movie.durationMinutes} min • {movie.language}
            </p>

            <button
              className="book-btn"
              onClick={() => navigate(`/booking?movieID=${movie.movieID}`)}

            >
              Book Now →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
