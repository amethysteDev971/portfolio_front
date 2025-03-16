import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import CoverPhoto from '../CoverPhoto/CoverPhoto';

const SectionDetail = ({ sectionEndpoint }) => {
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await axiosInstance.get(sectionEndpoint);
        console.log('Réponse de SectionDetail:', response.data);
        setSection(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement de la section:', err);
        setError('Erreur lors du chargement de la section.');
      } finally {
        setLoading(false);
      }
    };

    fetchSection();
  }, [sectionEndpoint]);

  if (loading) return <p>Chargement de la section...</p>;
  if (error) return <p>{error}</p>;
  if (!section) return <p>Section non trouvée.</p>;

  // On suppose ici que la section renvoie un tableau de photos dans "photos"
  const photos = section.photos && Array.isArray(section.photos) && section.photos.length > 0
    ? section.photos
    : (section.photo && section.photo.trim() !== '' ? [section.photo] : []);

  return (
    <div className="mb-8">
      {section.title && (
        <h3 className="text-xl font-bold mb-4 text-left">{section.title}</h3>
      )}
      {photos.length > 0 ? (
        // Affichage vertical des images
        <div className="flex flex-col gap-4">
          {photos.map((photoEndpoint, index) => (
            <CoverPhoto key={index} endpoint={photoEndpoint} altText={section.title} />
          ))}
        </div>
      ) : (
        <p>Aucune image disponible pour cette section.</p>
      )}
    </div>
  );
};

export default SectionDetail;
