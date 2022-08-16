import Notiflix from 'notiflix';
import ImagesAPIService from './js/imagesAPIs';
import renderImages from './js/imagesRender';
import LoadMore from './js/loadMore';
import renderTotalHits from './js/renderTotalHits';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.js-articles-container'),
};

const imagesAPIs = new ImagesAPIService();
const loadMore = new LoadMore({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.form.addEventListener('submit', onSearch);
loadMore.refs.button.addEventListener('click', onMoreImages, { passive: true });


async function onSearch(e) {
  e.preventDefault();
  clearImagesContainer();
  imagesAPIs.resetPage();
  imagesAPIs.query = e.currentTarget.elements.searchQuery.value;
  const images = await imagesAPIs.fetchImages();
  if (images.totalHits === 0) {
    Notiflix.Notify.failure(`Sorry, there is no ${imagesAPIs.query}`);
    return;
  }
  showTotalPictures(images.totalHits);
  uploadingImages(images);
  lazyLoad();
  loadMore.show();
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

async function onMoreImages() {
  if (imagesAPIs.images > imagesAPIs.totalHits) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    loadMore.hide();
    return;
  }
  const images = await imagesAPIs.fetchImages();
  uploadingImages(images);
  smoothyScroll();
  lazyLoad();
}

function uploadingImages(images) {
  loadMore.disable();
  refs.imagesContainer.insertAdjacentHTML(
    'beforeend',
    renderImages(images.hits)
  );
  loadMore.enable();
  let simpleGallery = new SimpleLightbox('.articles a', {
    captionsData: 'alt',
    captionDelay: 250,

  });
}

function smoothyScroll() {
  const { height: cardHeight } = document
    .querySelector('.js-articles-container')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function showTotalPictures(totalImages) {
  refs.imagesContainer.insertAdjacentHTML(
    'beforebegin',
    renderTotalHits(totalImages)
  );
  Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
}

function lazyLoad() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach(image => {
    image.addEventListener('load', onImageLoaded, { once: true });
  });
}

function onImageLoaded(e) {
  e.target.classList.add('appear');
}
