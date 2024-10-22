import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';

import { fetchNews, archiveNews, removeNews, initializeNewsSocket } from '../utils/api';
import NewsItem from './NewsItem';
import ConfirmationModal from './ConfirmationModal';


const NewsList=({type}) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  useEffect(() => {
    setError(null);
    loadNews();
    
    if(type === 'new') {
      try {
        const socket = initializeNewsSocket();
        socket.on('newNews', handleNewNews);
        return () => socket.disconnect();

      } catch (err) {
        setError(`Failed to connect to webSocket.`);
      }
    }
  }, [type]);
  
  const handleNewNews =(newNewsItem) => {
      if(!newNewsItem.archiveDate){
        setNews(prevNews => {
          const updatedNews = [newNewsItem, ...prevNews];
          return updatedNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        });
      }
  }
  const loadNews = async () => {
    try {
      const isArchivedString =  type === 'new' ? 'false' : 'true'
      const newsData = await fetchNews(isArchivedString)
      setNews(newsData);
    } catch (err) {
      setError(`Failed to load ${type} news.`);
    }
  };
  const handleShowModal = (id) => {
    setSelectedNewsId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNewsId(null);
  };

  const handleConfirmAction = async () => {
    try {
      if (type === 'new') {
        const date = new Date();
        const archivedItem = await archiveNews(selectedNewsId, date);
        if (archivedItem) {
          setNews(news.filter(item => item._id !== selectedNewsId));
        }
      } else {
        const removed = await removeNews(selectedNewsId);
        if (removed) {
          setNews(news.filter(item => item._id !== selectedNewsId));
        }
      }
      handleCloseModal();
    } catch (err) {
      setError(`Failed to ${type === 'new' ? 'archive' : 'remove'} news.`);
      handleCloseModal();
    }
  };

  return (
    <Container>
      <h2 className="mb-4">{type === 'new' ? 'New' : 'Archived'}</h2>
      {news.map((item) => (
        <NewsItem
          key={item._id}
          item={item}
          onAction={handleShowModal}
          actionText={type === 'new' ? 'Archive' : 'Remove'}
          actionVariant={type === 'new' ? 'primary' : 'danger'}
        />
      ))}
      {news.length === 0 && (
        <Alert variant="info">
          No news available.
        </Alert>
      )}
      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      <ConfirmationModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={`Confirm Action`}
        message={`Are you sure you want to ${type === 'new' ? 'archive' : 'remove'} this news?`}
      />
    </Container>
  );
}

export default NewsList;