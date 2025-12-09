import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/schedule.css";
import "../../styles/global.css";

const API_URL = import.meta.env.VITE_API_URL;

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

  const [selectedTheater, setSelectedTheater] = useState("");
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
    endTime: "", // Make sure this is always present
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
      endTime: "", // Keep it empty initially
      adultPrice: "" as number | string,
      childPrice: "" as number | string,
    });
    setShowForm(true);
  };

  const handleEdit = (show: Show) => {
    setEditingShow(show);

    // Check if endTime is empty and provide a default
    const calculatedEndTime =
      show.endTime || calculateDefaultEndTime(show.startTime);

    console.log("=== DIRECT FIELD DEBUGGING ===");
    console.log("show.endTime:", show.endTime);
    console.log("calculatedEndTime:", calculatedEndTime);
    console.log("typeof calculatedEndTime:", typeof calculatedEndTime);
    console.log("calculatedEndTime length:", calculatedEndTime.length);
    console.log("Is calculatedEndTime truthy?", !!calculatedEndTime);

    // Create the form data object with ALL fields explicitly
    const newFormData = {
      movie: show.movieID.toString(),
      theater: show.theaterID.toString(),
      auditorium: show.auditoriumID.toString(),
      date: show.date.split("T")[0],
      startTime: show.startTime,
      endTime: calculatedEndTime, // Make sure this is included
      adultPrice: show.adultPrice,
      childPrice: show.childPrice,
    };

    // Debug each field individually
    console.log("=== FORM DATA FIELD BY FIELD ===");
    console.log("movie:", newFormData.movie);
    console.log("theater:", newFormData.theater);
    console.log("auditorium:", newFormData.auditorium);
    console.log("date:", newFormData.date);
    console.log("startTime:", newFormData.startTime);
    console.log("endTime:", newFormData.endTime);
    console.log("adultPrice:", newFormData.adultPrice);
    console.log("childPrice:", newFormData.childPrice);

    // Check if endTime exists in the object
    console.log("endTime in object:", "endTime" in newFormData);
    console.log("Object.keys:", Object.keys(newFormData));
    console.log("Object.values:", Object.values(newFormData));
    console.log("Object.entries:", Object.entries(newFormData));

    setFormData(newFormData);
    setShowForm(true);
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this showtime?")) return;

    try {
      const res = await fetch(`${API_URL}/api/movies/showtimes/${id}`, {
        // Changed to plural "showtimes"
        method: "DELETE",
      });

      // Check if response is OK before parsing JSON
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();

      alert(data.message || "Deleted.");

      fetchShows(); // refresh table
    } catch (err) {
      console.error("Delete showtime error:", err);
      alert("Failed to delete showtime.");
    }
  };
  const handleCloseModal = () => {
    setShowForm(false);
    setEditingShow(null);
    setAuditoriums([]);
    setFormData({
      movie: "",
      theater: "",
      auditorium: "",
      date: "",
      startTime: "",
      endTime: "",
      adultPrice: "",
      childPrice: "",
    });
  };

  const [movieTitles, setMovieTitles] = useState<Record<number, string>>({});
  const [theaters, setTheaters] = useState<any[]>([]);
  const [auditoriums, setAuditoriums] = useState<any[]>([]);

  const fetchShows = async () => {
    try {
      const payload: any = {};

      // Add at least one filter as required by backend
      if (selectedTheater && selectedTheater !== "All Theaters") {
        payload.theaterID = Number(selectedTheater);
      }
      if (selectedDate) {
        payload.date = selectedDate;
      }

      // If no filters are selected, use a default one
      if (!payload.theaterID && !payload.date) {
        payload.movieID = 0;
      }

      console.log("Fetching shows with payload:", payload);

      const res = await fetch(`${API_URL}/api/movies/showtimes/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle 400 Bad Request specifically
      if (res.status === 400) {
        console.warn("No shows found or invalid request");
        setShows([]);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched shows data:", data);

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        setShows([]);
        return;
      }

      const formatted = data.map((item: any) => {
        // Handle different field names from different endpoints
        const startTime = item.startTime || item.time;
        let endTime = item.endTime;

        console.log("Processing show item:", {
          itemStartTime: item.startTime,
          itemTime: item.time,
          itemEndTime: item.endTime,
          resolvedStartTime: startTime,
          resolvedEndTime: endTime,
        });

        // If endTime is not provided, calculate it (add 2 hours as default)
        if (!endTime && startTime) {
          const [hours, minutes] = startTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0, 0);
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
          endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          console.log("Calculated end time:", endTime);
        }

        const formattedShow = {
          id: item.showtimeID,
          movieID: item.movieID,
          movie: movieTitles[item.movieID] || `Movie #${item.movieID}`,
          theaterID: item.theaterID,
          theater: item.theaterName,
          auditoriumID: item.auditoriumID,
          auditorium: item.auditoriumName,
          date: item.date.split("T")[0],
          startTime: startTime,
          endTime: endTime, // This should now have a value
          adultPrice: Number(item.adultPrice),
          childPrice: Number(item.childPrice),
          occupancy: Number(item.totalSeats) - Number(item.availableSeats),
          capacity: Number(item.totalSeats),
        };

        console.log("Formatted show:", formattedShow);
        return formattedShow;
      });
      setShows(formatted);
    } catch (err) {
      console.error("Fetch shows error:", err);
      setShows([]);
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
      // ADD VALIDATION HERE - at the beginning of addShowtime
      const validationErrors = validateShowtimeData(payload);
      if (validationErrors.length > 0) {
        alert("Validation errors:\n" + validationErrors.join("\n"));
        return;
      }

      console.log("Sending POST request with payload:", payload);

      const res = await fetch(`${API_URL}/api/movies/showtimes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error response:", errorText);
        throw new Error(
          `HTTP error! status: ${res.status}, message: ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Success response:", data);

      if (data.result === true) {
        alert("Showtime created successfully");
        setShowForm(false);
        fetchShows(); // refresh table
      } else {
        alert(
          "Failed to create showtime: " + (data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Add showtime error:", err);
      alert("Error creating showtime. Check console for details.");
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
      /*endTime: formData.endTime, // Make sure this is included!*/
      adultPrice: Number(formData.adultPrice),
      childPrice: Number(formData.childPrice),
    };

    console.log("=== EDIT DEBUG INFO ===");
    console.log("Editing show ID:", editingShow.id);
    console.log("Original data:", editingShow);
    console.log("New payload:", payload); // Check if endTime is here
    console.log("Form data:", formData); // Also log formData to see what's in it

    const validationErrors = validateShowtimeData(payload);
    if (validationErrors.length > 0) {
      alert("Validation errors:\n" + validationErrors.join("\n"));
      return;
    }

    // Validate that something actually changed
    const hasChanges =
      editingShow.movieID !== Number(formData.movie) ||
      editingShow.theaterID !== Number(formData.theater) ||
      editingShow.auditoriumID !== Number(formData.auditorium) ||
      editingShow.date !== formData.date ||
      editingShow.startTime !== formData.startTime ||
      /* editingShow.endTime !== formData.endTime ||*/
      editingShow.adultPrice !== Number(formData.adultPrice) ||
      editingShow.childPrice !== Number(formData.childPrice);

    if (!hasChanges) {
      alert("No changes detected.");
      return;
    }

    try {
      console.log("=== EDIT DEBUG INFO ===");
      console.log("Editing show ID:", editingShow.id);
      console.log("Original data:", editingShow);
      console.log("New payload:", payload);
      console.log("Changes detected:", hasChanges);

      // First, try the normal update
      const res = await fetch(
        `${API_URL}/api/movies/showtimes/${editingShow.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await res.text();
      console.log("Raw response:", responseText);

      if (!res.ok) {
        // If 500 error, try one more time after a short delay
        if (res.status === 500) {
          console.log("First attempt failed, retrying...");
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const retryRes = await fetch(
            `${API_URL}/api/movies/showtimes/${editingShow.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const retryText = await retryRes.text();
          console.log("Retry response:", retryText);

          if (!retryRes.ok) {
            throw new Error(
              `HTTP error! status: ${retryRes.status}, response: ${retryText}`
            );
          }

          const result = retryText ? JSON.parse(retryText) : {};
          handleEditSuccess(result);
          return;
        }

        throw new Error(
          `HTTP error! status: ${res.status}, response: ${responseText}`
        );
      }

      // Try to parse JSON only if response is not empty
      const result = responseText ? JSON.parse(responseText) : {};
      handleEditSuccess(result);
    } catch (err) {
      console.error("Edit showtime error:", err);
      alert(
        "Failed to update showtime. This might be due to a scheduling conflict or server issue. Please try again."
      );
    }
  };

  // Helper function for successful edit
  const handleEditSuccess = (result: any) => {
    console.log("Parsed result:", result);

    if (result.result === true) {
      alert(result.message || "Showtime updated successfully!");
      setShowForm(false);
      setEditingShow(null);
      fetchShows();
    } else {
      alert(
        result.message ||
          "Failed to update showtime. Please check for scheduling conflicts."
      );
    }
  };

  const calculateDefaultEndTime = (startTime: string) => {
    console.log("calculateDefaultEndTime called with:", startTime);
    if (!startTime) {
      console.log("startTime is empty, returning empty string");
      return "";
    }

    const [hours, minutes] = startTime.split(":").map(Number);
    console.log("Parsed hours, minutes:", hours, minutes);

    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const result = `${endDate.getHours().toString().padStart(2, "0")}:${endDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    console.log("calculateDefaultEndTime result:", result);
    return result;
  };

  const validateShowtimeData = (payload: any) => {
    const errors = [];

    // Check if end time is after start time
    // Only validate end time if provided
    if (payload.endTime && payload.startTime >= payload.endTime) {
      errors.push("End time must be after start time");
    }

    // Check if date is in the future
    const showDate = new Date(payload.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (showDate < today) {
      errors.push("Show date cannot be in the past");
    }

    // Check price validity
    if (payload.adultPrice <= 0 || payload.childPrice <= 0) {
      errors.push("Prices must be greater than 0");
    }

    // Check if all required fields are present
    if (
      !payload.movieID ||
      !payload.theaterID ||
      !payload.auditoriumID ||
      !payload.date ||
      !payload.startTime
    ) {
      errors.push(
        "Movie, theater, auditorium, date, and start time are required"
      );
    }

    return errors;
  };
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  // pull shows when page open
  useEffect(() => {
    fetchTheaters();
    fetchMovieTitles();
  }, []);
  useEffect(() => {
    if (Object.keys(movieTitles).length > 0) {
      fetchShows();
    }
  }, [movieTitles, selectedTheater, selectedDate]);
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

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  const handleSearch = async () => {
    try {
      const payload: any = {};

      if (selectedTheater && selectedTheater !== "All Theaters") {
        payload.theaterID = Number(selectedTheater);
      }
      if (selectedDate) {
        payload.date = selectedDate;
      }

      // Add at least one filter as required by backend
      if (!payload.theaterID && !payload.date) {
        payload.movieID = 0;
      }

      console.log("Searching with payload:", payload);

      const res = await fetch(`${API_URL}/api/movies/showtimes/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 400) {
        console.warn("No shows found for search criteria");
        setShows([]);
        alert("No shows found for the selected criteria");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Search results:", data);

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        setShows([]);
        return;
      }

      const formatted = data.map((item: any) => {
        // Handle different field names from different endpoints
        const startTime = item.startTime || item.time; // Use startTime if available, fallback to time
        let endTime = item.endTime;

        // If endTime is not provided, calculate it (add 2 hours as default)
        if (!endTime && startTime) {
          const [hours, minutes] = startTime.split(":").map(Number);
          const startDate = new Date();
          startDate.setHours(hours, minutes, 0, 0);
          const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
          endTime = `${endDate.getHours().toString().padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        }

        return {
          id: item.showtimeID,
          movieID: item.movieID,
          movie: movieTitles[item.movieID] || `Movie #${item.movieID}`,
          theaterID: item.theaterID,
          theater: item.theaterName,
          auditoriumID: item.auditoriumID,
          auditorium: item.auditoriumName,
          date: item.date.split("T")[0],
          startTime: startTime,
          endTime: endTime,
          adultPrice: Number(item.adultPrice),
          childPrice: Number(item.childPrice),
          occupancy: Number(item.totalSeats) - Number(item.availableSeats),
          capacity: Number(item.totalSeats),
        };
      });

      setShows(formatted);
    } catch (err) {
      console.error("Search error:", err);
      alert("Search failed");
      setShows([]);
    }
  };

  return (
    <div className="schedule-page-wrapper">
      <div
        className="back-button"
        onClick={() =>
          navigate(role === "owner" ? "/dashboard" : "/staff-dashboard")
        }
      >
        ← Back to Dashboard
      </div>
      <h2 className="page-title">Show Schedule Management</h2>
      <p className="page-subtitle">
        Manage movie showtimes, pricing, and schedules
      </p>

      <div className="schedule-filter-bar">
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
        <button className="btn-primary" onClick={handleSearch}>
          🔍 Search
        </button>

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
                    onChange={
                      (e) => setFormData({ ...formData, movie: e.target.value }) // still store ID as string
                    }
                  >
                    <option value="">Select movie</option>
                    {Object.entries(movieTitles).map(([id, title]) => (
                      <option key={id} value={id}>
                        {title}
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
                    onChange={(e) => {
                      const newStartTime = e.target.value;
                      setFormData({
                        ...formData,
                        startTime: newStartTime,
                        // Auto-set end time if empty or if start time changes significantly
                        endTime: !formData.endTime
                          ? calculateDefaultEndTime(newStartTime)
                          : formData.endTime,
                      });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label>End Time </label>
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
                  console.log("Form data before save:", formData);
                  if (editingShow) {
                    editShowtime();
                  } else {
                    addShowtime();
                  }
                }}
              >
                Save Showtime
              </button>
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
