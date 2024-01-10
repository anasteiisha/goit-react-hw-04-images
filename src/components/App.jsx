import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { useEffect, useState } from 'react';

import { getImages } from 'service/image-service';
import { makeNormalizeDataImg } from 'helpers/normalize-data-img';

import ModalLibrary from 'react-modal';
ModalLibrary.setAppElement('#root');

export const App = () => {
  // state
  const [searchValue, setSearchValue] = useState('');
  const [hits, setHits] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isVisibleLoadMoreBtn, setIsVisibleLoadMoreBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [tags, setTags] = useState('');
  // функції
  const [isShowModal, setIsShowModal] = useState(false);

  //  useEffect
  useEffect(() => {
    if (searchValue === '') {
      return;
    }
    async function getImgs() {
      try {
        setIsLoading(true);

        const { hits, totalHits } = await getImages(searchValue, page);

        setIsVisibleLoadMoreBtn(
          prev => prev || page < Math.ceil(totalHits / 12)
        );

        setHits(prevHits => [...prevHits, ...makeNormalizeDataImg(hits)]);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    if (searchValue || page > 1) {
      getImgs();
    }
  }, [searchValue, page]);

  const onSubmit = searchValue => {
    setSearchValue(searchValue);
    setPage(1);
    setHits([]);
    setError(null);
    setLargeImageURL('');
    setTags('');
    setIsShowModal(false);
  };

  const handleClickOnBtn = () => {
    setPage(prevPage => prevPage + 1);
  };
  const handleClickOnImg = (largeImageURL, tags) => {
    setLargeImageURL(largeImageURL);
    setTags(tags);
    setIsShowModal(true);
  };

  const onCloseModal = () => {
    setIsShowModal(false);
  };

  return (
    <>
      <Searchbar onSubmit={onSubmit} />
      {error && <p>Error: {error.message}</p>}
      {hits.length > 0 && (
        <ImageGallery hits={hits} handleClickOnImg={handleClickOnImg} />
      )}
      {isVisibleLoadMoreBtn && (
        <Button onClick={handleClickOnBtn} isLoading={isLoading} />
      )}
      {isShowModal && (
        <Modal
          isShowModal={isShowModal}
          onCloseModal={onCloseModal}
          largeImageURL={largeImageURL}
          tags={tags}
        />
      )}
    </>
  );
};
