const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');

let movies = document.querySelector('.movies');
let searchInput = document.querySelector('.input');
const divTitle = document.querySelector('.highlight__title');
const divMovie = document.querySelector('.highlight__video');
const divRating = document.querySelector('.highlight__rating');
const divGenre = document.querySelector('.highlight__genres');
const divLaunch = document.querySelector('.highlight__launch');
const divDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');

let modalHidden = document.querySelector('.modal');
let modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title')
const modalImage = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenre = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');
const modalBody = document.querySelector('.modal__body');

const btnTheme = document.querySelector('.btn-theme');
const root = document.querySelector(":root");

let a = 0, b = 6;

btnNext.addEventListener('click', (e) => {
    e.stopPropagation();
    a += 6;
    b += 6;

    if (b > 18) a = 0, b = 6;

    movies.innerHTML = "";
    if (!searchInput.value) loadMovies();
    if (searchInput.value) searchMovies();
});


btnPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    a -= 6;
    b -= 6;

    if (a < 0) a = 12, b = 18;

    movies.innerHTML = "";
    if (!searchInput.value) loadMovies();
    if (searchInput.value) searchMovies();
});

async function loadMovies() {

    try {
        const response = await api.get('/3/discover/movie?language=pt-BR&include_adult=false');

        for (let i = a; i < b; i++) {
            let divMovie = document.createElement('div');
            const divMovieInfo = document.createElement('div');
            const movieTitle = document.createElement('span');
            const movieRating = document.createElement('span');
            const imgStar = document.createElement('img');

            divMovieInfo.classList.add('movie__info');
            movieTitle.classList.add('movie__title');
            movieRating.classList.add('movie__rating');
            imgStar.src = "./assets/estrela.svg";

            divMovie.classList.add('movie');
            divMovie.style.backgroundImage = `url("${response.data.results[i].poster_path}")`;
            divMovie.id = response.data.results[i].id;

            movies.appendChild(divMovie);
            divMovie.appendChild(divMovieInfo);
            divMovieInfo.append(movieTitle, movieRating);
            movieTitle.textContent = response.data.results[i].title;
            movieRating.textContent = response.data.results[i].vote_average;
            movieRating.appendChild(imgStar);
        }

    } catch (error) {
        console.log(error);
    }
};

searchInput.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;

    searchMovies();
    movies.innerHTML = "";
});

async function searchMovies() {

    try {
        const response = await api.get('/3/search/movie?language=pt-BR&include_adult=false&query=' + searchInput.value);

        for (let i = a; i < b; i++) {
            let divMovie = document.createElement('div');
            const divMovieInfo = document.createElement('div');
            const movieTitle = document.createElement('span');
            const movieRating = document.createElement('span');
            const imgStar = document.createElement('img');

            divMovieInfo.classList.add('movie__info');
            movieTitle.classList.add('movie__title');
            movieRating.classList.add('movie__rating');
            imgStar.src = "./assets/estrela.svg";

            divMovie.classList.add('movie');
            divMovie.style.backgroundImage = `url("${response.data.results[i].poster_path}")`;

            movies.appendChild(divMovie);
            divMovie.appendChild(divMovieInfo);
            divMovieInfo.append(movieTitle, movieRating);
            movieTitle.textContent = response.data.results[i].title;
            movieRating.textContent = response.data.results[i].vote_average;
            movieRating.appendChild(imgStar);
        }

    } catch (error) {
        console.log(error);
    }
};

async function movieOfTheDay() {

    try {
        const response = await api.get('/3/movie/436969?language=pt-BR');
        const responseVideo = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

        const linkVideo = await responseVideo.json();

        divMovie.style.backgroundImage = `url("${response.data.backdrop_path}")`;
        divTitle.textContent = response.data.title;
        divRating.textContent = response.data.vote_average.toFixed(1);
        divGenre.textContent = `${response.data.genres[0].name}, ${response.data.genres[1].name}, ${response.data.genres[2].name} `;
        divLaunch.textContent = new Date(response.data.release_date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
        divDescription.textContent = response.data.overview;
        highlightVideoLink.href = ` https://www.youtube.com/watch?v=${linkVideo.results[1].key} `;

    } catch (error) {
        console.log(error);
    }
};

movies.addEventListener('click', (event) => {
    modalHidden.classList.toggle("hidden");
    modalMovie(event.target.id);

});

modalBody.addEventListener('click', () => {
    modalHidden.classList.add("hidden");
});

async function modalMovie(id) {

    try {
        const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

        modalTitle.textContent = response.data.title;
        modalImage.src = response.data.backdrop_path;
        modalDescription.textContent = response.data.overview;
        modalGenre.textContent = `${response.data.genres[0].name}, ${response.data.genres[1].name}, ${response.data.genres[2].name} `;
        modalAverage.textContent = response.data.vote_average.toFixed(1);

        const modalGenreColor = response.data.genres;
        modalGenreColor.forEach(modalGenre => {
            const genre = document.createElement("span");
            genre.classList.add("modal__genres");
            genre.textContent = modalGenre.name;
            modalGenre.appendChild(genre);
        });

    } catch (error) {
        console.log(error);
    }

};

function applyCurrentTheme() {
    const currentTheme = localStorage.getItem('theme')

    if (!currentTheme || currentTheme === 'light') {
        btnTheme.src = 'assets/light-mode.svg';
        root.style.setProperty("--background", "#fff");
        root.style.setProperty("--input-color", "#979797");
        root.style.setProperty("--text-color", "#1b2028");
        root.style.setProperty("--bg-secondary", "#ededed");
        root.style.setProperty("--rating-color", "#f1c40f");
        root.style.setProperty("--bg-modal", "#ededed");

        btnNext.src = 'assets/arrow-right-dark.svg';
        btnPrev.src = 'assets/arrow-left-dark.svg';
        modalClose.src = './assets/close-dark.svg';

        return;
    };

    btnTheme.src = 'assets/dark-mode.svg';

    root.style.setProperty("--background", "#000000");
    root.style.setProperty("--input-color", "#3E434D");
    root.style.setProperty("--text-color", "#ffffff");
    root.style.setProperty("--bg-secondary", "#2D3440");
    root.style.setProperty("--rating-color", "grey");
    root.style.setProperty("--bg-modal", "black");

    btnNext.src = 'assets/arrow-right-light.svg';
    btnPrev.src = 'assets/arrow-left-light.svg';
    modalClose.src = './assets/close.svg';
};

btnTheme.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme");

    if (!currentTheme || currentTheme === "light") {
        localStorage.setItem("theme", "dark");
        applyCurrentTheme();
        return;
    };

    localStorage.setItem("theme", "light");
    applyCurrentTheme();
});

loadMovies();
movieOfTheDay();
applyCurrentTheme();