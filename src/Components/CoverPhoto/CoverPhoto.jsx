import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const CoverPhoto = ({ endpoint, altText }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axiosInstance.get(endpoint);
        console.log('Réponse de CoverPhoto:', response.data);
        const urlFromApi = response.data.url; // votre champ `url` exposé par le getter getUrl()
        let fullUrl = '';

        // 1) URL absolue
        if (urlFromApi.startsWith('http://') || urlFromApi.startsWith('https://')) {
          fullUrl = urlFromApi;
        }
        // 2) Chemin relatif commençant par slash
        else if (urlFromApi.startsWith('/')) {
          const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
          fullUrl = `${API_URL}${urlFromApi}`;
        }
        // 3) Chemin sans slash initial (par sécurité)
        else {
          const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, '');
          fullUrl = `${API_URL}/${urlFromApi}`;
        }

        console.log('URL finale de l’image de couverture :', fullUrl);
        setPhotoUrl(fullUrl);
      } catch (err) {
        console.error('Erreur lors du chargement de la photo :', err);
      }
    };

    fetchPhoto();
  }, [endpoint]);

  if (!photoUrl) return null;
  return <img src={photoUrl} alt={altText} className="w-full h-auto mb-2" />;
};

export default CoverPhoto;
