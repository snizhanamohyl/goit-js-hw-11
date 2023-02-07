const URL_BASE = 'https://pixabay.com/api/';
const KEY = '33393357-f6d954601800afd866273582d';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
    this.numberOfLoadedPhotos = 0;
  }

  fetchPhotos() {
    const url = `${URL_BASE}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`;

    return fetch(url)
      .then(res => res.json())
      .then(data => {
        this.incrementPage();

        this.totalHits = data.totalHits;

        this.numberOfLoadedPhotos += data.hits.length;

        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
