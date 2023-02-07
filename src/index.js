import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const URL_BASE = 'https://pixabay.com/api/';
const KEY = '33393357-f6d954601800afd866273582d';
const perPage = 40;
let page = 1;
let q = '';

let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onLoadMore() {
  page += 1;
  const url = `${URL_BASE}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  fetchPhotos(url);
}

function onFormSubmit() {
  event.preventDefault();

  refs.gallery.innerHTML = '';

  page = 1;
  q = event.target.searchQuery.value;
  const url = `${URL_BASE}?key=${KEY}&q=${q}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  fetchPhotos(url);
  event.target.reset();
}

function fetchPhotos(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.info(`Hooray! We found ${data.totalHits} images.`);
        refs.gallery.insertAdjacentHTML('beforeend', renderMarkup(data.hits));
        gallery.refresh();
        refs.loadMoreBtn.classList.remove('hidden');
      }
    })
    .finally(() => {
      const { height: cardHeight } =
        refs.gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    });
}

function renderMarkup(photos) {
  return photos.reduce(
    (acc, photo) =>
      acc +
      `<a class="photo-link" href="${photo.largeImageURL}"><div class="photo-card">
  <img src="${photo.webformatURL}" class="photo"  alt="${photo.tags}" height="158px" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${photo.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${photo.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${photo.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${photo.downloads}</span>
    </p>
  </div>
</div></a>`,
    ''
  );
}
