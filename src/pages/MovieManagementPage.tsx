import { useEffect, useState } from "react";
import "../styles/global.css";
import "../styles/movie.css";
import { useNavigate } from "react-router-dom";

// Add this interface for TypeScript
interface Movie {
  movieID: number;
  title: string;
  genre: string;
  language: string;
  duration: number;
  releaseDate: string;
  director: string;
  cast: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  maxShowCount: number;
  status: string;
}
interface MovieForm {
  title: string;
  genre: string;
  language: string;
  duration: string; // string because form inputs return string check with Achini
  releaseDate: string;
  director: string;
  cast: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  maxShowCount: string; // from input, convert later/ check with achini
  status: string;
}

const API_URL =
  "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";

export default function MovieManagementPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All Genres");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  /// amila Code start here

  const [movies, setMovies] = useState<Movie[]>([]);
  const [formData, setFormData] = useState<MovieForm>({
    title: "",
    genre: "",
    language: "",
    duration: "",
    releaseDate: "",
    director: "",
    cast: "",
    description: "",
    posterUrl: "",
    trailerUrl: "",
    maxShowCount: "",
    status: "Now Showing",
  });

  // fetching movies from backend
  const fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/movies`);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();
      //UI fieldds mapping to backend fields
      const mappedMovies: Movie[] = data.map(
        (m: any): Movie => ({
          movieID: m.movieID,
          title: m.title,
          genre: m.genre,
          language: m.language,
          duration: m.durationMinutes, // backend main field
          releaseDate: m.releaseDate ? m.releaseDate.slice(0, 10) : "",
          director: m.director,
          cast: m.cast || "",
          description: m.description || "",
          posterUrl: m.posterUrl,
          trailerUrl: m.trailerUrl,
          maxShowCount: m.maxShowCount || 0,
          status: m.status,
        })
      );
      setMovies(mappedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Error loading movies from server.");
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

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
      cast: "",
      description: "",
      posterUrl: "",
      trailerUrl: "",
      maxShowCount: "",
      status: "Now Showing",
    } as MovieForm);
    setShowModal(true);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);

    const updated: MovieForm = {
      title: movie.title,
      genre: movie.genre,
      language: movie.language,
      duration: String(movie.duration), // number to string conversion handled by input-check with Achini
      releaseDate: movie.releaseDate,
      director: movie.director,
      cast: movie.cast,
      description: movie.description,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl,
      maxShowCount: String(movie.maxShowCount), // number to string conversion handled by input - check with Achini
      status: movie.status,
    };

    setFormData(updated);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.genre || !formData.language) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = {
      title: formData.title,
      genre: formData.genre,
      language: formData.language,
      durationMinutes: Number(formData.duration),
      releaseDate: formData.releaseDate,
      director: formData.director,
      cast: formData.cast,
      description: formData.description,
      posterUrl: formData.posterUrl,
      trailerUrl: formData.trailerUrl,
      maxShowCount: Number(formData.maxShowCount),
      status: formData.status,
    };

    try {
      let response;

      if (editingMovie) {
        response = await fetch(
          `${API_URL}/api/movies/${editingMovie.movieID}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch(`${API_URL}/api/movies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        throw new Error("Failed to save movie");
      }
      const result = await response.json();
      console.log("Save response:", result);

      // reload list
      await fetchMovies();
      setShowModal(false);
      setEditingMovie(null);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save movie.");
    }
  };

  const handleDelete = async (movieID: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) {
      return; // user cancelled
    }

    try {
      const response = await fetch(`${API_URL}/api/movies/${movieID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }

      const result = await response.json();
      console.log("Delete response:", result);

      // Reload movie list from backend
      await fetchMovies();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete movie.");
    }
  };

  return (
    <div className="movie-management-container">
      <section className="movie-section">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
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
          {filteredMovies.map((movie: Movie) => (
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
              <span
                className={`status-badge ${
                  movie.status === "Now Showing"
                    ? "active"
                    : movie.status === "Upcoming"
                    ? "upcoming"
                    : "ended"
                }`}
              >
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
