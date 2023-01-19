import imagesApiService from './js/fetchimages';
import LoadMoreButton from './js/load-more-btn';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

// load more button
const loadMoreBtn = new LoadMoreButton({
  selector: '[data-action="load-more"]',
  hidden: true,
});

// infinite me button
const infiniteBtn = new LoadMoreButton({
  selector: '[data-action="infinite"]',
  hidden: true,
});

//options for observer for infinite scroll
const options = {
  root: null,
  rootMargin: '150px',
  threshold: 0,
};

const images = new imagesApiService();

let observer = new IntersectionObserver(infiniteImages, options);

// lightboxGallery
const lightboxGallery = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionDelay: 100,
});

// listeners
refs.form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', moreImages);
infiniteBtn.refs.button.addEventListener('click', infiniteImagesInit);

function onSearch(evt) {
  evt.preventDefault();
  images.query = refs.form.input.value;

  if (!images.query) {
    return;
  }

  loadMoreBtn.show();
  infiniteBtn.show();
  loadMoreBtn.disableScroll();
  infiniteBtn.disable();
  clearImagesContainer();
  images.resetPage();
  fetchImages();
}

async function fetchImages() {
  try {
    const imagesFromFetch = await images.fetchImages();
    appendImagesMarkup(imagesFromFetch);
    lightboxGallery.refresh();
    totalHitsChanged(imagesFromFetch.totalHits);
  } catch (error) {
    console.log(error);
  }
}

function clearImagesContainer() {
  refs.gallery.innerHTML = '';
}

function appendImagesMarkup(imagesObj) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    imagesObj.hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
    <div class="photo-card">
      <a class="photo-card__link link" href="${largeImageURL}"> 
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
      </a>
    </div>`;
        }
      )
      .join('')
  );
}

function totalHitsChanged(newTotalHits) {
  const totalHits = newTotalHits;
  if (totalHits === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    loadMoreBtn.hide();
    infiniteBtn.hide();
    return;
  }

  if (images.page === 2) {
    Notify.success(`Hooray! We found ${totalHits} images`);
  }

  if (images.totalPages === images.page - 1) {
    if (images.page !== 2) {
      Notify.warning(
        "We're sorry, but you've reached the end of search results"
      );
    }
    loadMoreBtn.hide();
    infiniteBtn.hide();
    observer.unobserve(refs.guard);

    return;
  }

  loadMoreBtn.enableScroll();
  infiniteBtn.enable();
}

function moreImages() {
  loadMoreBtn.disableScroll();
  infiniteBtn.disable();
  fetchImages();
}

function infiniteImagesInit() {
  infiniteBtn.isPressed = true;
  loadMoreBtn.hide();
  infiniteBtn.hide();
  observer.observe(refs.guard);
}

function infiniteImages(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      moreImages();
    }
  });
}
