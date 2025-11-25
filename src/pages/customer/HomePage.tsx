
import React, { useState } from "react";
import "../../styles/homeModern.css";

export default function HomePage() {
  const [city, setCity] = useState("Oulu");

  const movies = [
    {
      title: "Dune: Part Two",
      genre: "Sci-Fi, Adventure",
      duration: 166,
      language: "English",
      rating: 8.9,
      poster: "https://m.media-amazon.com/images/M/MV5BM2Y3Njc4ZmUt.jpg",
      date: "2024-11-25",
      time: "18:00",
    },
  ];

  return (
    <div className="home-page">

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

      {/* Section Title */}
      <h2 className="section-title">NOW SHOWING</h2>

      {/* Movie Card */}
      <div className="movie-card">
        <img src={movies[0].poster} alt="poster" className="movie-poster" />

        {/* Rating */}
        <div className="rating-badge">⭐ {movies[0].rating}</div>

        <div className="movie-info">
          <h3 className="movie-name">{movies[0].title}</h3>
          <p className="movie-genre">{movies[0].genre}</p>

          <p className="movie-details">
            ⏱ {movies[0].duration} min &nbsp; • &nbsp; {movies[0].language}
          </p>

          <div className="datetime-box">
            📅 {movies[0].date} at {movies[0].time}
          </div>

          <button className="book-btn">Book Now →</button>
        </div>
      </div>
    </div>
  );
}
