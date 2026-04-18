// render once the html is done parsing
document.addEventListener("DOMContentLoaded", showComics);

// loop through every comic object and renders a card for each one
function showComics() {
  const container = document.getElementById("comic-container");
  const template = document.querySelector(".comic");

  container.innerHTML = "";

  for (let i = 0; i < comics.length; i++) {
    const card = template.cloneNode(true);
    fillCard(card, comics[i]);
    container.appendChild(card);
  }
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
  card.querySelector(".comic-publisher").textContent = comic.publisher;

  const stars = card.querySelectorAll(".star");
  const ratingValue = card.querySelector(".rating-value");

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

  // clicking the summary toggles the "expanded" class, which CSS uses to show/hide details
  card.querySelector(".comic-summary").addEventListener("click", function () {
    card.classList.toggle("expanded");
  });
}
