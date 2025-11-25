import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/global.css";
import "../../styles/schedule.css";
import "../../styles/global.css";
import "../../styles/schedule.css";

const API_URL =
  "https://app-cinereserve-backend-cabmcgejecgjgcdu.swedencentral-01.azurewebsites.net";

type Show = {
  id: number;
  movieID: number;
  movie: string;
  theaterID: number;
  theater: string;
  auditoriumID: number;
  auditorium: string;
  date: string;
  startTime: string;
  endTime: string;
  adultPrice: number;
  childPrice: number;
  occupancy: number;
  capacity: number;
};

export default function ScheduleManagementPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("All Movies");
  const [selectedTheater, setSelectedTheater] = useState("All Theaters");
  const [selectedDate, setSelectedDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  const [shows, setShows] = useState<Show[]>([]);

  const [formData, setFormData] = useState({
    movie: "",
    theater: "",
    auditorium: "",
    date: "",
    startTime: "",
    endTime: "",
    adultPrice: "" as number | string,
    childPrice: "" as number | string,
  });

  const handleAdd = () => {
    setEditingShow(null);
    setFormData({
      movie: "",
      theater: "",
      auditorium: "",
      date: "",
      startTime: "",
      endTime: "",
      adultPrice: "" as number | string,
      childPrice: "" as number | string,
    });
    setShowForm(true);
  };

  const handleEdit = (show: Show) => {
    setEditingShow(show);

    setFormData({
      movie: show.movieID.toString(), // Store ID, not the movies name
      theater: show.theaterID.toString(),
      auditorium: show.auditoriumID.toString(),

      date: show.date.split("T")[0], //backend returns"2025-11-10T22:00:00.000Z" convert ISO to yyyy-mm-dd
      startTime: show.startTime,
      endTime: show.endTime,

      adultPrice: show.adultPrice,
      childPrice: show.childPrice,
    });

    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this showtime?")) {
      alert("Deleted show ID " + id); //Replace it with a real delete API call
    }
  };

  const [movieTitles, setMovieTitles] = useState<Record<number, string>>({});
  const [movies, setMovies] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [auditoriums, setAuditoriums] = useState<any[]>([]);

  const fetchShows = async () => {
    try {
      const res = await fetch(`${API_URL}/api/movies/showtimes/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // empty- get all showtimes
      });

      const data = await res.json();

      // Convert backend to front end UI format
      const formatted = data.map((item: any) => ({
        id: item.showtimeID,
        movie: movieTitles[item.movieID] || `Movie #${item.movieID}`, // mapped ID insted of movieTitle but need to check API
        theaterID: item.theaterID,
        theater: item.theaterName,
        auditoriumID: item.auditoriumID,
        auditorium: item.auditoriumName,
        date: item.date,
        startTime: item.time, //update as per API response
        endTime: item.endTime || "",
        adultPrice: Number(item.adultPrice),
        childPrice: Number(item.childPrice),
        occupancy: Number(item.totalSeats) - Number(item.availableSeats),
        capacity: Number(item.totalSeats),
      }));

      setShows(formatted);
    } catch (err) {
      console.error("Fetch shows error:", err);
    }
  };

  const fetchMovieTitles = async () => {
    //backend does NOT send movie title in showtimes,this maps titles using IDs
    try {
      const res = await fetch(`${API_URL}/api/movies`);
      const data = await res.json();

      // Create dictionary { movieID: title }
      const lookup: Record<number, string> = {};
      data.forEach((m: any) => {
        lookup[m.movieID] = m.title;
      });

      setMovieTitles(lookup);
    } catch (err) {
      console.error("Fetch movie titles error:", err);
    }
  };

  const fetchMovies = async () => {
  try {
    const res = await fetch(`${API_URL}/api/movies`);//API from movies list
    const data = await res.json();

    const filtered = data.map((m: any) => ({
      movieID: m.movieID,
      title: m.title,
    }));

    setMovies(filtered);
  } catch (err) {
    console.error("Fetch movies error:", err);
  }
};


  const fetchTheaters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/theaters`);
      const data = await res.json();
      setTheaters(data);//set theaters state, used in theater dropdown,
    } catch (err) {
      console.error("Fetch theaters error:", err);
    }
  };

  const fetchAuditoriums = async (theaterID: number) => {
    try {
      const res = await fetch(
        `${API_URL}/api/theaters/${theaterID}/auditoriums`
      );
      const data = await res.json();
      setAuditoriums(data);
    } catch (err) {
      console.error("Fetch auditoriums error:", err);
    }
  };

  // pull shows when page open
  useEffect(() => {
    fetchMovies();
    fetchTheaters();
    fetchMovieTitles();
    fetchShows();
  }, []);
  useEffect(() => {
    if (Object.keys(movieTitles).length > 0) {
      fetchShows();
    }
  }, [movieTitles]);

  return (
    <div className="schedule-container">
      <div className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </div>
      <h2 className="page-title">Show Schedule Management</h2>
      <p className="page-subtitle">
        Manage movie showtimes, pricing, and schedules
      </p>

      <div className="schedule-filter-bar">
        <input
          type="text"
          placeholder="Search movie or theater..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />

        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          className="filter-select"
        >
          <option>All Movies</option>
          {movies.map((m) => (
            <option key={m.movieID} value={m.movieID}>
              {m.title}
            </option>
          ))}
        </select>

        <select
          value={selectedTheater}
          onChange={(e) => setSelectedTheater(e.target.value)}
          className="filter-select"
        >
          <option>All Theaters</option>
          <option>Cinema Nova Oulu</option>
        </select>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="filter-input"
        />

        <button className="btn-primary" onClick={handleAdd}>
          ➕ Add Showtime
        </button>
      </div>

      <div className="schedule-table">
        <div className="table-header">
          <span>Movie</span>
          <span>Theater & Auditorium</span>
          <span>Date</span>
          <span>Time</span>
          <span>Pricing</span>
          <span>Occupancy</span>
          <span>Actions</span>
        </div>

        {shows.map((s) => (
          <div key={s.id} className="table-row">
            <span>
              <strong>{s.movie}</strong>
              <br />
              <small>🎬 Oulu</small>
            </span>
            <span>
              {s.theater}
              <br />
              {s.auditorium}
            </span>
            <span>{s.date}</span>
            <span>
              {s.startTime} <br />
              <small>End: {s.endTime}</small>
            </span>
            <span>
              Adult: €{s.adultPrice}
              <br />
              Child: €{s.childPrice}
            </span>
            <span>
              {s.occupancy} / {s.capacity}
              <br />
              <small>{Math.round((s.occupancy / s.capacity) * 100)}%</small>
            </span>
            <div className="actions">
              <button className="btn-edit" onClick={() => handleEdit(s)}>
                ✏️
              </button>
              <button className="btn-delete" onClick={() => handleDelete(s.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingShow ? "Edit Showtime" : "Add New Showtime"}</h3>

            <div className="form-section">
              <h4>Movie & Venue</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Movie *</label>
                  <select
                    value={formData.movie}
                    onChange={(e) =>
                      setFormData({ ...formData, movie: e.target.value })
                    }
                  >
                    <option value="">Select movie</option>
                    <option value="Dune: Part Two">Dune: Part Two</option>
                    <option value="Poor Things">Poor Things</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Theater *</label>
                  <select
                    value={formData.theater}
                    onChange={(e) =>
                      setFormData({ ...formData, theater: e.target.value })
                    }
                  >
                    <option value="">Select theater</option>
                    {theaters.map((t) => (
                      <option key={t.theaterID} value={t.theaterID}>
                        {t.theaterName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Auditorium *</label>
                  <select
                    value={formData.auditorium}
                    onChange={(e) =>
                      setFormData({ ...formData, auditorium: e.target.value })
                    }
                  >
                    <option value="">Select auditorium</option>
                    {auditoriums.map((a) => (
                      <option key={a.auditoriumID} value={a.auditoriumID}>
                        {a.auditoriumName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Schedule</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Ticket Pricing</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label>Adult Price (€) *</label>
                  <input
                    type="number"
                    value={formData.adultPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, adultPrice: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Child Price (€) *</label>
                  <input
                    type="number"
                    value={formData.childPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, childPrice: e.target.value })
                    }
                  />
                </div>
              </div>
              <p className="price-warning">
                ⚠️ Price changes will not affect existing bookings.
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setShowForm(false)}
              >
                Save Showtime
              </button>
              <button className="btn-cancel" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
