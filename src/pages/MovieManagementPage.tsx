import React, { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/movie.css";
import { useNavigate } from "react-router-dom";

export default function MovieManagementPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [movies, setMovies] = useState([
    {
      movieID: 1,
      title: "Inception",
      genre: "Sci-Fi",
      language: "English",
      duration: 148,
      releaseDate: "2010-07-16",
      director: "Christopher Nolan",
      posterUrl: "http://image.com/poster.jpg",
      trailerUrl: "http://youtube.com/abc",
      status: "Now Showing",
    },
    {
      movieID: 2,
      title: "Poor Things",
      genre: "Comedy",
      language: "English",
      duration: 141,
      releaseDate: "2024-01-12",
      director: "Yorgos Lanthimos",
      posterUrl: "",
      trailerUrl: "",
      status: "Now Showing",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    language: "",
    duration: "",
    releaseDate: "",
    director: "",
    posterUrl: "",
    trailerUrl: "",
    status: "Now Showing",
  });

  // Filtered Movies
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(search.toLowerCase()) ||
      movie.director.toLowerCase().includes(search.toLowerCase());
    const matchesGenre =
      genreFilter === "All Genres" || movie.genre === genreFilter;
    const matchesStatus =
      statusFilter === "All Status" || movie.status === statusFilter;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const handleAdd = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      genre: "",
      language: "",
      duration: "",
      releaseDate: "",
      director: "",
      posterUrl: "",
      trailerUrl: "",
      status: "Now Showing",
    });
    setShowModal(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({ ...movie });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.genre || !formData.language) {
      alert("Please fill in all required fields!");
      return;
    }

    if (editingMovie) {
      setMovies(
        movies.map((m) =>
          m.movieID === editingMovie.movieID ? { ...formData } : m
        )
      );
    } else {
      const newMovie = {
        ...formData,
        movieID: Date.now(),
      };
      setMovies([...movies, newMovie]);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter((m) => m.movieID !== id));
    }
  };

  return (
    <div className="movie-management-container">
      <section className="movie-section">
        <button
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <h2 className="page-title">Movie Management</h2>
        <p className="page-subtitle">
          Manage movie listings, descriptions, and showtimes
        </p>

        {/* Search & Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by title or director..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="dropdown"
          >
            <option>All Genres</option>
            <option>Sci-Fi</option>
            <option>Drama</option>
            <option>Comedy</option>
            <option>Action</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dropdown"
          >
            <option>All Status</option>
            <option>Now Showing</option>
            <option>Upcoming</option>
            <option>Ended</option>
          </select>

          <button className="btn-primary" onClick={handleAdd}>
            ➕ Add Movie
          </button>
        </div>

        {/* Movie List */}
        <div className="movie-list-header">
          <span>Title</span>
          <span>Genre</span>
          <span>Duration</span>
          <span>Director</span>
          <span>Release Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="movie-list scrollable-list">
          {filteredMovies.map((movie) => (
            <div key={movie.movieID} className="movie-row">
              <span>
                <strong>{movie.title}</strong>
                <br />
                <small>{movie.language}</small>
              </span>
              <span>{movie.genre}</span>
              <span>{movie.duration} min</span>
              <span>{movie.director}</span>
              <span>{movie.releaseDate}</span>
              <span className={`status-badge ${
                movie.status === "Now Showing"
                  ? "active"
                  : movie.status === "Upcoming"
                  ? "upcoming"
                  : "ended"
              }`}>
                {movie.status}
              </span>
              <div className="movie-actions">
                <button className="btn-edit" onClick={() => handleEdit(movie)}>
                  ✏️
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(movie.movieID)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingMovie ? "Edit Movie" : "Add New Movie"}</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Movie Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Genre *</label>
                <input
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Language *</label>
                <input
                  value={formData.language}
                  onChange={(e) =>
                    setFormData({ ...formData, language: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Release Date *</label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, releaseDate: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Director *</label>
                <input
                  value={formData.director}
                  onChange={(e) =>
                    setFormData({ ...formData, director: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Poster URL</label>
                <input
                  type="url"
                  value={formData.posterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, posterUrl: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Trailer URL</label>
                <input
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, trailerUrl: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="Now Showing">Now Showing</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ended">Ended</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleSave}>
                Save Movie
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
