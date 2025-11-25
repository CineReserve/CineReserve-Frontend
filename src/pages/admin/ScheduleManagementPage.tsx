import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/schedule.css";
import "../../styles/global.css";

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this showtime?")) return;

    try {
      const res = await fetch(`${API_URL}/api/movies/showtime/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      alert(data.message || "Deleted.");

      fetchShows(); // refresh table
    } catch (err) {
      console.error("Delete showtime error:", err);
      alert("Failed to delete showtime.");
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
        movieID: item.movieID,
        movie: movieTitles[item.movieID] || `Movie #${item.movieID}`, // mapped ID insted of movieTitle but need to check API
        theaterID: item.theaterID,
        theater: item.theaterName,
        auditoriumID: item.auditoriumID,
        auditorium: item.auditoriumName,
        date: item.date.split("T")[0], //backend sends "2025-11-10T22:00:00.000Z"
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
      const res = await fetch(`${API_URL}/api/movies`); //API from movies list
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
      setTheaters(data); //set theaters state, used in theater dropdown,
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

  const addShowtime = async () => {
    try {
      const payload = {
        movieID: Number(formData.movie),
        theaterID: Number(formData.theater),
        auditoriumID: Number(formData.auditorium),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        adultPrice: Number(formData.adultPrice),
        childPrice: Number(formData.childPrice),
      };

      const res = await fetch(`${API_URL}/api/movies/showtimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.result === true) {
        alert("Showtime created successfully");
        setShowForm(false);
        fetchShows(); // refresh table
      } else {
        alert("Failed to create showtime");
      }
    } catch (err) {
      console.error("Add showtime error:", err);
      alert("Error creating showtime");
    }
  };
  const editShowtime = async () => {
    if (!editingShow) return;

    const payload = {
      movieID: Number(formData.movie),
      theaterID: Number(formData.theater),
      auditoriumID: Number(formData.auditorium),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      adultPrice: Number(formData.adultPrice),
      childPrice: Number(formData.childPrice),
    };

    try {
      const res = await fetch(
        `${API_URL}/api/movies/showtime/${editingShow.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      alert(result.message || "Showtime updated!");

      setShowForm(false);
      fetchShows(); // refresh table
    } catch (err) {
      console.error("Edit showtime error:", err);
      alert("Failed to update showtime.");
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
  useEffect(() => {
    if (formData.theater && !editingShow) {
      fetchAuditoriums(Number(formData.theater));
      setFormData((prev) => ({ ...prev, auditorium: "" }));
    }
  }, [formData.theater, editingShow]);

  useEffect(() => {
    if (editingShow) {
      // Load auditoriums for theater used in this showtime
      fetchAuditoriums(editingShow.theaterID);
    }
  }, [editingShow]);

  //To make filters work, need to filter the show list BEFORE rendering it
  const filteredShows = shows.filter((s) => {
    //search filter-Search bar
    const matchSearch =
      s.movie.toLowerCase().includes(search.toLowerCase()) ||
      s.theater.toLowerCase().includes(search.toLowerCase());
    //movie filter
    const matchMovie =
      selectedMovie === "All Movies" ||
      selectedMovie === "" ||
      s.movieID === Number(selectedMovie);
    //theater filter
    const matchTheater =
      selectedTheater === "All Theaters" ||
      selectedTheater === "" ||
      s.theaterID === Number(selectedTheater);
    //date filter
    const matchDate = selectedDate === "" || s.date.startsWith(selectedDate);
    //check all filters
    return matchSearch && matchMovie && matchTheater && matchDate;
  });

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
          <option value="">All Theaters</option>
          {theaters.map((t) => (
            <option key={t.theaterID} value={t.theaterID}>
              {t.theaterName}
            </option>
          ))}
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

        {filteredShows.map((s) => (
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
                    onChange={
                      (e) => setFormData({ ...formData, movie: e.target.value }) // still store ID as string
                    }
                  >
                    <option value="">Select movie</option>
                    {movies.map((m) => (
                      <option key={m.movieID} value={m.movieID}>
                        {m.title}
                      </option>
                    ))}
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
                onClick={() => {
                  if (editingShow) {
                    editShowtime();
                  } else {
                    addShowtime();
                  }
                }}
              >
                Save Showtime
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowForm(false); // close modal
                  setEditingShow(null); // stop edit mode
                  setAuditoriums([]); // reset auditoriums
                  setFormData({
                    movie: "",
                    theater: "",
                    auditorium: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    adultPrice: "",
                    childPrice: "",
                  }); // reset form
                }}
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
