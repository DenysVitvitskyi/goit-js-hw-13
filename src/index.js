// import '@fortawesome/fontawesome-free/js/solid';
// import '@fortawesome/fontawesome-free/js/fontawesome';
import { Notify } from 'notiflix';
import throttle from 'lodash.throttle';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.css';
import 'modern-normalize/modern-normalize.css';
import imagesTpl from './templates/image';
import './sass/main.scss';
import { fetchImages } from './js/getImages';

const refs = {
  searchWrapper: document.querySelector('.search-wrapper'),
  formSubmit: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  imageThumb: document.querySelector('#image-thumb'),
  buttonLoadMore: document.querySelector('#load-more'),
};

let page = 1;
const imagesPerPage = 40;
let numberOfPages = 0;
let currentPage = 0;
let query = '';

window.onload = function () {
  document.body.style.paddingTop = getComputedStyle(refs.searchWrapper).height;
};

Notify.init({
  distance: '5%',
  fontSize: '15px',
  width: '350px',
  showOnlyTheLastOne: true,
});

function setHeightImage() {
  const imageThumb = document.querySelector('#image-thumb');
  const imageThumbs = document.querySelectorAll('#image-thumb');
  const imgWidth = Number.parseFloat(getComputedStyle(imageThumb).width);
  const height = imgWidth * 0.65 + 'px';
  imageThumbs.forEach(img => (img.style.height = height));
}

const lightbox = new SimpleLightbox('.gallery a', {
//   открытие карточки и мотание
});

refs.formSubmit.addEventListener('submit', searchImages);
refs.buttonLoadMore.addEventListener('click', laodMoreImages);

async function searchImages(e) {
  {
    e.preventDefault();
    refs.buttonLoadMore.style.display = 'none';
    page = 1;
    currentPage = 1;
    query = e.currentTarget.elements.searchQuery.value.trim();
    if (!query) {
      return;
    }
    try {
      const images = await fetchImages({ query, page, imagesPerPage });
      if (images.data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        return;
      }
      numberOfPages = Math.ceil(images.data.totalHits / imagesPerPage);
      refs.gallery.innerHTML = imagesTpl(images.data.hits);
      Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
      setHeightImage();
      window.addEventListener('resize', throttle(setHeightImage, 500));
      lightbox.refresh();
      window.scroll(pageXOffset, 0);
    } catch (error) {
      console.log('Something went wrong', error.message);
    }
  }
  if (numberOfPages > 1) {
    refs.buttonLoadMore.style.display = 'block';
  }
}

async function laodMoreImages(e) {
  e.preventDefault();
  page += 1;
  currentPage += 1;
  if (!query) {
    return;
  }
  try {
    const images = await fetchImages({ query, page, imagesPerPage });
    gallery.insertAdjacentHTML('beforeend', imagesTpl(images.data.hits));
    setHeightImage();
    lightbox.refresh();
  } catch (error) {
    console.log('Error', error.message);
  }
}

// const buttonMoreTop = refs.buttonLoadMore.getBoundingClientRect().top;

//   if (currentPage === numberOfPages) {
//     refs.buttonLoadMore.style.display = 'none';
//     window.addEventListener('scroll', findEdgeOfPageTrottled);
//   }

//  window.scrollBy({
//       top:
//         buttonMoreTop -
//         40 -
//         Number.parseInt(getComputedStyle(refs.searchWrapper).height),
//       behavior: 'smooth',
//     });

// const findEdgeOfPageTrottled = throttle(() => {
//   const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
//   if (scrollTop + clientHeight > scrollHeight - 20) {
//     Notify.info("We're sorry, but you've reached the end of search results.");
//     window.removeEventListener('scroll', findEdgeOfPageTrottled);
//   }
// }, 300);