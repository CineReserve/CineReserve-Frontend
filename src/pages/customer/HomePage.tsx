import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/homeModern.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage() {
  interface Movie {
    movieID: number;
    title: string;
    genre: string;
    language: string;
    durationMinutes?: number;
    duration?: number;
    posterUrl: string;
    trailerUrl?: string;
  }

  const [movies, setMovies] = useState<Movie[]>([]);
  const [city, setCity] = useState("Oulu");
  const navigate = useNavigate();

  const cityMap: any = {
    Oulu: 1,
    Helsinki: 2,
    Turku: 4,
  };

  useEffect(() => {
    fetch(`${API_URL}/api/movies/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "Now Showing",
        cityID: cityMap[city],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMovies(data);
        } else {
          setMovies([]);
        }
      })
      .catch((err) => {
        console.error("Movie Fetch Error:", err);
        setMovies([]);
      });
  }, [city]);

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

      {movies.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No movies available</p>
      ) : (
        movies.map((movie) => (
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
                ⏱ {movie.durationMinutes ?? movie.duration} min •{" "}
                {movie.language}
              </p>

              <div className="movie-actions">
                <button
                  className="book-btn"
                  onClick={() =>
                    navigate("/booking", {
                      state: {
                        movieID: movie.movieID,
                        movie: {
                          movieID: movie.movieID,
                          title: movie.title,
                          genre: movie.genre,
                          duration: movie.durationMinutes,
                          posterUrl: movie.posterUrl,
                        },
                      },
                    })
                  }
                >
                  Book Now →
                </button>

                <button
                  className="trailer-btn"
                  onClick={() => window.open(movie.trailerUrl, "_blank")}
                >
                  ▶ Watch Trailer
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
