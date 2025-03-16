import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const CoverPhoto = ({ endpoint, altText }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log('Réponse de CoverPhoto:', response.data);
        const API_URL = import.meta.env.VITE_API_URL;
        let fullUrl = '';

        if (response.data.imageName && response.data.imageName.trim() !== '') {
          console.log('imageName trouvé:', response.data.imageName);
          const userId = response.data.user ? response.data.user.split('/').pop() : '';
          fullUrl = `${API_URL}/uploads/photos/${userId}/${response.data.imageName}`;
          console.log('URL construite avec imageName:', fullUrl);
        } else {
          console.error('Impossible de construire l\'URL de l\'image. Réponse:', response.data);
        }

        if (fullUrl) {
          setPhotoUrl(fullUrl);
        }
      } catch (err) {
        console.error('Erreur lors du chargement de la photo:', err);
      }
    };

    fetchPhoto();
  }, [endpoint]);

  if (!photoUrl) return null;
  return <img src={photoUrl} alt={altText} className="w-full h-auto mb-2" />;
};

export default CoverPhoto;
