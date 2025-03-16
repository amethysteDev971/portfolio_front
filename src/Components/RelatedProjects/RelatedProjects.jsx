import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CoverPhoto from '../CoverPhoto/CoverPhoto';

const RelatedProjects = ({ currentProjectId }) => {
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/api/projets');
        const projectsData = response.data['hydra:member'] || response.data.member || response.data;
        if (Array.isArray(projectsData)) {
          // Filtrer les projets qui ont une cover photo et exclure le projet courant
          const projectsWithCover = projectsData.filter(
            project => project.coverPhoto && project.id !== Number(currentProjectId)
          );
          // Mélanger la liste aléatoirement
          projectsWithCover.sort(() => Math.random() - 0.5);
          // Prendre les 3 premiers
          setRelatedProjects(projectsWithCover.slice(0, 3));
        } else {
          setError('La structure de la réponse est inattendue.');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des projets liés.');
      }
    };

    fetchProjects();
  }, [currentProjectId]);

  if (error) return <p>{error}</p>;
  if (relatedProjects.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-left">Projets connexes</h3>
      <div className="flex gap-4">
        {relatedProjects.map(project => (
          <Link key={project.id} to={`/projets/${project.id}`} className="flex-1">
            <div className="related-cover-wrapper">
              <CoverPhoto endpoint={project.coverPhoto} altText={project.title} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;
