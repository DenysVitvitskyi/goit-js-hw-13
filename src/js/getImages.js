import axios from 'axios';

const baseURL = 'https://pixabay.com/api/';

export const fetchImages = ({ query, page, imagesPerPage }) => {
  const params = {
    key: '22674819-1c6648e1bd9ba2423cbcfb506',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: imagesPerPage,
    page,
  };
  return axios(baseURL, { params });
};