import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    status: "Not Watched",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  // Get all movies
  const fetchMovies = async () => {
    try {
      const res = await api.get("/movies");
      setMovies(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update Movie
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const res = await api.put(`/movies/${editingId}`, {
          ...form,
          rating: Number(form.rating),
        });

        setMovies(
          movies.map((movie) =>
            movie._id === editingId ? res.data : movie
          )
        );

        setEditingId(null);
      } else {
        const res = await api.post("/movies", {
          ...form,
          rating: Number(form.rating),
        });

        setMovies([...movies, res.data]);
      }

      setForm({
        title: "",
        genre: "",
        rating: "",
        status: "Not Watched",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //Delete Movie

  const deleteMovie = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this movie?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await api.delete(`/movies/${id}`);

    setMovies(
      movies.filter((movie) => movie._id !== id)
    );
  } catch (error) {
    console.log(error);
  }
};

  // Edit Movie
  const editMovie = (id) => {
    const movie = movies.find(
      (movie) => movie._id === id
    );

    setForm({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      status: movie.status,
    });

    setEditingId(id);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      title: "",
      genre: "",
      rating: "",
      status: "Not Watched",
    });
  };

  // Search + Genre Filter
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      genreFilter === "" ||
      movie.genre.toLowerCase() ===
        genreFilter.toLowerCase();

    return matchesSearch && matchesGenre;
  });

  return (
    

  

    <div className="app">

      {/* Header */}

      <header className="header">
        <div>
          <h1>🎬 Movie Watchlist</h1>
          <p>Track, rate and manage your favorite movies.</p>
        </div>

        <div className="movie-count">
          <span>{movies.length}</span>
          <small>Movies</small>
        </div>
      </header>

      {/* Add / Edit Form */}
      <section className="form-card">
        <h2>
          {editingId
            ? "✏️ Edit Movie"
            : "🎬 Add New Movie"}
        </h2>

        <form onSubmit={handleSubmit} className="movie-form">

          <input
            type="text"
            name="title"
            placeholder="Movie Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="genre"
            placeholder="Genre"
            value={form.genre}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="rating"
            placeholder="Rating (1-5)"
            value={form.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Not Watched">
              Not Watched
            </option>

            <option value="Watched">
              Watched
            </option>
          </select>

          <button
            type="submit"
            className="primary-btn"
          >
            {editingId
              ? "💾 Update Movie"
              : "🎬 Add New Movie"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={cancelEdit}
            >
              ❌ Cancel
            </button>
          )}
        </form>
      </section>

      {/* Search and Filter */}
      <section className="filter-section">

        <input
          type="text"
          placeholder="🔍 Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={genreFilter}
          onChange={(e) =>
            setGenreFilter(e.target.value)
          }
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Comedy">Comedy</option>
          <option value="Drama">Drama</option>
          <option value="Romance">Romance</option>
          <option value="Thriller">Thriller</option>
        </select>

      </section>

      {/* Movie List */}
      <section className="movie-section">

        <h2>🎥 Your Movies</h2>

        {filteredMovies.length === 0 ? (
          <div className="empty">
  <div style={{ fontSize: "60px", marginBottom: "10px" }}>🎬</div>

  <h3>No Movies Yet</h3>

  <p>
    Add your first movie and start building your watchlist.
  </p>
</div>
        ) : (
          <div className="movie-grid">

            {filteredMovies.map((movie) => (
              <div
                className="movie-card"
                key={movie._id}
              >

                <div className="movie-icon">
                  🎬
                </div>

                <h3>{movie.title}</h3>

                <span className="genre">
                  {movie.genre}
                </span>

                <p className="rating">
                  ⭐ {movie.rating} / 5
                </p>

                <span
                  className={
                    movie.status === "Watched"
                      ? "status watched"
                      : "status not-watched"
                  }
                >
                  {movie.status}
                </span>

                <div className="actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editMovie(movie._id)
                    }
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteMovie(movie._id)
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </div>
    
  );
}

export default App;