// render once the html is done parsing
document.addEventListener("DOMContentLoaded", function () {
  showComics(comics);
  setupControls();
});

// loop through every comic object and renders a card for each one
// accepts an array so filtering can pass a subset instead of the full list
function showComics(list) {
  const container = document.getElementById("comic-container");

  container.innerHTML = "";

  // update the result count display
  const count = list.length;
  document.getElementById("result-count").textContent =
    count + " issue" + (count === 1 ? "" : "s");

  const template = document.querySelector(".comic");
  for (let i = 0; i < list.length; i++) {
    const card = template.cloneNode(true);
    fillCard(card, list[i]);
    container.appendChild(card);
  }
}

// reads all three controls and re-renders with the matching subset
function applyFilters() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const character = document.getElementById("character-filter").value;
  const status = document.getElementById("status-filter").value;
  const sort = document.getElementById("sort-select").value;

  let result = comics.filter(function (comic) {
    const matchesSearch =
      comic.title.toLowerCase().includes(searchTerm) ||
      comic.writer.toLowerCase().includes(searchTerm) ||
      comic.artist.toLowerCase().includes(searchTerm);
    const matchesCharacter = character === "" || comic.character === character;
    const matchesStatus = status === "" || comic.status === status;

    return matchesSearch && matchesCharacter && matchesStatus;
  });

  // sort: reorder the filtered array based on the selected option
  if (sort === "issue-asc") {
    result.sort(function (a, b) {
      return a.issue - b.issue;
    });
  } else if (sort === "issue-desc") {
    result.sort(function (a, b) {
      return b.issue - a.issue;
    });
  } else if (sort === "year-asc") {
    result.sort(function (a, b) {
      return a.releaseYear - b.releaseYear;
    });
  } else if (sort === "year-desc") {
    result.sort(function (a, b) {
      return b.releaseYear - a.releaseYear;
    });
  } else if (sort === "rating-desc") {
    result.sort(function (a, b) {
      if (a.rating === null) return 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    });
  }

  showComics(result);
}

// attach event listeners to all three controls
function setupControls() {
  document
    .getElementById("search-input")
    .addEventListener("input", applyFilters);
  document
    .getElementById("character-filter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("status-filter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("sort-select")
    .addEventListener("change", applyFilters);
}

// take one of the cloned template objects and fill it with the data from the comic object
function fillCard(card, comic) {
  card.style.display = "block";

  // make the cover image and insert it at the very top of the card
  const img = document.createElement("img");
  img.src = comic.coverImage;
  img.alt = comic.title + " #" + comic.issue + " cover";
  card.insertBefore(img, card.firstChild);

  // summary section
  card.querySelector(".comic-character-badge").textContent = comic.character;
  card.querySelector(".comic-status-badge").textContent = comic.status;
  card.querySelector(".comic-title").textContent = comic.title;
  card.querySelector(".comic-issue-label").textContent =
    "Issue #" + comic.issue;

  // detail section of the comic
  card.querySelector(".comic-writer").textContent = comic.writer;
  card.querySelector(".comic-artist").textContent = comic.artist;
  card.querySelector(".comic-year").textContent = comic.releaseYear;
  card.querySelector(".comic-genre").textContent = comic.genre;
  card.querySelector(".comic-arc").textContent = comic.arcName;

  const stars = card.querySelectorAll(".star");
  const ratingValue = card.querySelector(".rating-value");

  // if this comic was already rated, restore the stars on re-render
  if (comic.rating !== null) {
    ratingValue.textContent = comic.rating + "/10";
    stars.forEach(function (s) {
      if (parseInt(s.getAttribute("data-value")) <= comic.rating) {
        s.classList.add("active");
      }
    });
  }

  stars.forEach(function (star) {
    star.addEventListener("click", function () {
      const clicked = parseInt(star.getAttribute("data-value"));
      comic.rating = clicked;

      ratingValue.textContent = clicked + "/10";

      stars.forEach(function (s) {
        if (parseInt(s.getAttribute("data-value")) <= clicked) {
          s.classList.add("active");
        } else {
          s.classList.remove("active");
        }
      });
    });
  });

  // read / owned checkboxes — restore state from the data and wire clicks back to it
  const readBox = card.querySelector(".read-toggle");
  const ownedBox = card.querySelector(".owned-toggle");

  readBox.checked = comic.read;
  ownedBox.checked = comic.owned;

  readBox.addEventListener("change", function () {
    comic.read = readBox.checked;
  });
  ownedBox.addEventListener("change", function () {
    comic.owned = ownedBox.checked;
  });

  // stop checkbox clicks from bubbling up and collapsing the card
  readBox.addEventListener("click", function (e) {
    e.stopPropagation();
  });
  ownedBox.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // clicking the summary toggles the "expanded" class, which CSS uses to show/hide details
  card.querySelector(".comic-summary").addEventListener("click", function () {
    card.classList.toggle("expanded");
  });
}
