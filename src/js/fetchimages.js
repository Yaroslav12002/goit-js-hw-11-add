import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '32896608-edee66498739c605f99988f2c';
const IMAGESPERPAGE = 40;

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = 0;
  }

  async fetchImages() {
    // return axios(
    //   `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${IMAGESPERPAGE}`
    // )
    //   .then(response => {
    //     if (response.status !== 200) {
    //       throw new Error(response.status);
    //     }
    //     return response.data;
    //   })
    //   .then(response => {
    //     this.calcTotalPages(response);
    //     this.incrementPage();
    //     return response;
    //   });
    const imagesResponse = await axios(
      `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${IMAGESPERPAGE}`
    );
    if (imagesResponse.status !== 200) {
      throw new Error(imagesResponse.status);
    }
    this.calcTotalPages(imagesResponse.data);
    this.incrementPage();
    return imagesResponse.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  calcTotalPages(imagesObj) {
    if (this.page === 1) {
      this.totalPages = Math.ceil(imagesObj.totalHits / IMAGESPERPAGE);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
