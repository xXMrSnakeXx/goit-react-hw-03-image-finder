import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './App.module.css';
import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Modal } from './Modal';
import { Loader } from 'components/Loader';
import { Button } from 'components/Button';
import { fetchImages } from 'services/fetchImages';

export class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    totalImg: 0,
    loading: false,
    error: null,
    isModal: false,
    modalImg: null,
    tags: '',
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.query !== this.state.query && this.state.query !== '') {
      this.setState({ images: [], page: 1 });
      this.loadImages();
    }

    if (prevState.page !== this.state.page && this.state.page !== 1) {
      this.loadImages();
    }
  }

  loadImages = () => {
    const { page, query } = this.state;
    this.setState({ loading: true, error: null });
    fetchImages(query, page)
      .then(images => {
        const pictures = images.hits.map(
          ({ id, webformatURL, tags, largeImageURL }) => ({
            id,
            webformatURL,
            tags,
            largeImageURL,
          })
        );
        if (!images.hits.length) {
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        }
        if (page === 1 && images.hits.length) {
          toast.success(`Hooray! We found ${images.totalHits} images.`);
        }
        const totalPage = images.totalHits / (page * images.hits.length);
        if (totalPage <= 1) {
          toast.success(
            `We're sorry, but you've reached the end of search results.`
          );
        }
        this.setState(prevState => ({
          images: [...prevState.images, ...pictures],
          totalImg: images.totalHits,
        }));
      })
      .catch(error => this.setState({ error }))
      .finally(() => this.setState({ loading: false }));
  };
  handleLoadMore = e => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };
  changeSearch = query => {
    this.setState({ query: query, page: 1, images: [] });
  };
  toggleModal = (modalImg = null, tags = '') => {
    this.setState(prevState => ({
      isModal: !prevState.isModal,
      modalImg,
      tags,
    }));
  };
  render() {
    const { isModal, modalImg, tags, loading, images, totalImg, error } =
      this.state;
    return (
      <div className={s.App}>
        <ToastContainer autoClose={3000} />
        <Searchbar changeSearch={this.changeSearch} />
        <ImageGallery images={images} toggleModal={this.toggleModal} />
        {loading && <Loader />}
        {images.length > 0 && images.length < totalImg && (
          <Button handleLoadMore={this.handleLoadMore} />
        )}
        {isModal && (
          <Modal
            modalImg={modalImg}
            onCloseModal={this.toggleModal}
            tags={tags}
          />
        )}
        {error && <>{error.message}</>}
      </div>
    );
  }
}
