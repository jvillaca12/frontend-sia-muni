import React, { useState, useEffect } from 'react';
import axiosInstance from 'config/axios-config';
import { CircularProgress } from '@mui/material';

const Chatbot: React.FC = () => {
  const [iframeUrl, setIframeUrl] = useState<string>('');

  useEffect(() => {
    const fetchChatbotSession = async () => {
      try {
        const response = await axiosInstance.post(`admin/api/chatbot/session`);
        setIframeUrl(response.data.url);
      } catch (error) {
        console.error('Error fetching chatbot session:', error);
      }
    };

    fetchChatbotSession();
  }, []);

  if (!iframeUrl) {
    return <CircularProgress />;
  }

  return (
    <iframe
      src={iframeUrl}
      style={{
        width: '100%',
        height: '100vh',
        border: '2px solid #3f51b5', // borde sólido con color
        borderRadius: '10px', // esquinas redondeadas
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // sombra suave
        backgroundColor: '#ffffff', // fondo del iframe
        padding: '5px', // espacio interno
        boxSizing: 'border-box' // incluye padding y border en el tamaño total
      }}
      title="Chatbot"
    />
  );
};

export default Chatbot;