import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import PhotosApiService from './js/PhotoApiService';
import LoadMoreBtn from './js/LoadMoreBtn';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
};

const photosApiService = new PhotosApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

let gallery = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', onSearch);
loadMoreBtn.btnEl.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  clearGallery();

  loadMoreBtn.hide();

  photosApiService.query = e.currentTarget.searchQuery.value;
  photosApiService.resetPage();

  try {
    const photos = await photosApiService.fetchPhotos();

    if (photos.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Hooray! We found ${photos.totalHits} images.`);

    appendPhotosMarkup(createMarkup(photos.hits));

    if (photosApiService.numberOfLoadedPhotos < photosApiService.totalHits) {
      loadMoreBtn.show();
      loadMoreBtn.enable();
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    e.target.reset();
  }

  //   photosApiService
  //     .fetchPhotos()
  //     .then(data => {
  //       if (data.hits.length === 0) {
  //         Notify.failure(
  //           'Sorry, there are no images matching your search query. Please try again.'
  //         );
  //       } else {
  //         Notify.info(`Hooray! We found ${data.totalHits} images.`);

  //         appendPhotosMarkup(createMarkup(data.hits));

  //         if (!onTheEndOfCollection()) {
  //           loadMoreBtn.show();
  //           loadMoreBtn.enable();
  //         }
  //       }
  //     })
  //     .then(makeSmoothScrollEffect);

  //   e.currentTarget.reset();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

async function onLoadMore() {
  if (photosApiService.numberOfLoadedPhotos >= photosApiService.totalHits) {
    loadMoreBtn.hide();
    Notify.info("We're sorry, but you've reached the end of search results.");
    return;
  }

  loadMoreBtn.disable();

  try {
    const photos = await photosApiService.fetchPhotos();

    appendPhotosMarkup(createMarkup(photos.hits));
    loadMoreBtn.enable();

    makeSmoothScrollEffect();
  } catch (error) {
    console.log(error.message);
  }

  //   photosApiService
  //     .fetchPhotos()
  //     .then(data => {
  //       appendPhotosMarkup(createMarkup(data.hits));
  //       loadMoreBtn.enable();
  //     })
  //     .then(makeSmoothScrollEffect);
}

function makeSmoothScrollEffect() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function appendPhotosMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

function createMarkup(photos) {
  return photos.reduce(
    (
      acc,
      { largeImageURL, webformatURL, tags, likes, views, comments, downloads }
    ) =>
      acc +
      `<a class="photo-link" href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" class="photo"  alt="${tags}" height="158px" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div></a>`,
    ''
  );
}
