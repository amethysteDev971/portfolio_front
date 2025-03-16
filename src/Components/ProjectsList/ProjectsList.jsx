import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import CoverPhoto from '../CoverPhoto/CoverPhoto';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/api/projets');
        console.log('Réponse JSON de /api/projets:', response.data);
        // Récupère le tableau des projets via 'hydra:member' ou 'member'
        const projectsData = response.data['hydra:member'] || response.data.member || response.data;
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
        } else {
          console.error('La structure des projets n\'est pas un tableau', projectsData);
          setError('La structure de la réponse est inattendue.');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des projets.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Projets</h2>
      <div className="grid gap-8 justify-center grid-cols-1 md:grid-cols-[240px_240px_240px]">
        {projects.map(project => (
          <Link key={project.id} to={`/projets/${project.id}`} className="block">
            <div className="cursor-pointer">
              {project.coverPhoto && (
                <CoverPhoto endpoint={project.coverPhoto} altText={project.title} />
              )}
              <h3 className="text-lg font-bold mb-1 text-left">{project.title}</h3>
              <p className="text-sm text-gray-600 text-left">{project.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
