

let currentPage = 1;
let currentQuery = "";
const loader = document.getElementById("loader");
const resultsDiv = document.getElementById("movie-results");
const paginationDiv = document.getElementById("pagination");

// Debounce Function
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

// Search Function
const searchMovies = async (query, page = 1) => {
  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter a movie title!</p>";
    return;
  }
  loader.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=ce92902&s=${query}&page=${page}`
    );
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
      setupPagination(query, page, Math.ceil(data.totalResults / 10));
    } else {
      resultsDiv.innerHTML = `<p>${data.Error}</p>`;
    }
  } catch (error) {
    resultsDiv.innerHTML = "<p>Error fetching movies. Please try again later.</p>";
  } 
};

// Display Movies
const displayMovies = (movies) => {
  resultsDiv.innerHTML = movies
    .map(
      (movie) => `
      <div class="movie-card">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
        <div class="info">
          <p class="title">${movie.Title}</p>
          <p class="year">(${movie.Year})</p>
        </div>
      </div>
    `
    )
    .join("");
};

// Setup Pagination
const setupPagination = (query, currentPage, totalPages) => {
  paginationDiv.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.disabled = i === currentPage;
    button.onclick = () => searchMovies(query, i);
    paginationDiv.appendChild(button);
  }
};

// Debounced Search
const debouncedSearch = debounce(() => {
  const query = document.getElementById("search-input").value.trim();
  currentQuery = query;
  currentPage = 1;
  searchMovies(query, 1);
}, 300);
