import axios from 'axios';

export async function fetchImages(query, page) {
  const BASE_URL = `https://pixabay.com/api/`;
  const KEY = `25724186-ef6039769df87abd937d53a4a`;
  const options = `image_type=photo&orientation=horizontal&per_page=12`;

  try {
    const resolve = await axios.get(
      `${BASE_URL}?key=${KEY}&q=${query}&${options}&page=${page}`
    );
    return resolve.data;
  } catch (error) {
    console.log(error);
  }
}
