import {io} from 'socket.io-client';

const API_URL = 'http://localhost:3000/api';
const WEBSOCKET_URL = 'http://localhost:3000';

export const fetchNews = async (type) => {
  try {
    const response = await fetch(`${API_URL}/news?isArchived=${type}`);
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching new news:', error);
    throw error;
  }
};

export const archiveNews = async (id,date) => {
  try {
    const response = await fetch(`${API_URL}/news/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ archiveDate: date }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error archiving news:', error);
    throw error;
  }
};

export const removeNews = async (id) => {
  try {
    const response = await fetch(`${API_URL}/news/${id}`, {
      method: 'DELETE',
    });
    
    return true;
  } catch (error) {
    console.error('Error removing news:', error);
    throw error;
  }
};

export const initializeNewsSocket = () => {
    try {
        const socket = io(WEBSOCKET_URL);
        return socket
    } catch (error) {
      console.error('Error removing news:', error);
      throw error;
    }
};

