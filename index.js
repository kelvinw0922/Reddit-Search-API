import reddit from "./redditapi";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

// Form Event Listener
searchForm.addEventListener("submit", e => {
  // Reset if div result has previous data
  document.getElementById("results").innerHTML = "";
  // Put a loading spinner
  let spinner =
    '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  document.getElementById("spinner").innerHTML = spinner;
  // Get search ter,
  const searchTerm = searchInput.value;
  // Get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // Get limit
  const searchLimit = document.getElementById("limit").value;

  // Check input
  if (searchTerm === "") {
    // Show an error message
    showMessage("Please add a search term", "alert-danger");
  }

  // Clear input
  searchInput.value = "";

  // Search Reddit
  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">';
    // Loop through queries
    console.log(results);
    results.forEach(post => {
      // Check for image object
      const image = post.preview
        ? post.preview.images[0].source.url
        : "https://static1.squarespace.com/static/553faaace4b064ab2110a741/t/5553904fe4b029532a0c92b7/1431543135204/Reddit+Logo.jpg";

      const readMoreURL = directToReadMore(post);

      output += `
      <div class="card">
      <a href="${
        post.url
      }" target="_blank"><img class="card-img-top" src="${image}" alt="Card image cap"></a>
      <div class="card-body text-white bg-dark mb-3">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${truncateText(post.selftext, 100)}</p>
        <a href="${readMoreURL}" target="_blank" class="btn btn-primary">Read More</a>
        <hr>
        <div class="card-footer">
          <span class="badge badge-secondary mr-3">Subreddit: ${
            post.subreddit
          }</span>
          <span class="badge badge-dark">Score: ${post.score}</span>
        </div>
      </div>
    </div>
        `;
    });
    output += "</div>";
    document.getElementById("spinner").innerHTML = "";
    document.getElementById("results").innerHTML = output;
  });

  e.preventDefault();
});

// Show error message
function showMessage(message, className) {
  // Create div
  const div = document.createElement("div");
  // Add classes
  div.className = `alert ${className}`;
  // Append Message
  div.appendChild(document.createTextNode(message));
  // Get parent
  const searchContainer = document.getElementById("search-container");
  // Get search
  const search = document.getElementById("search");

  // Insert the message
  searchContainer.insertBefore(div, search);

  // Timeout alert
  setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Truncate Text
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened == -1) return text;
  return text.substring(0, shortened);
}

// Direct readMore to the comment section

function directToReadMore(post) {
  let newURL = "http://www.reddit.com" + post.permalink;
  return newURL;
}
