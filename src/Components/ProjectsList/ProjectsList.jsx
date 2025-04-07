import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './ProjectsList.css';
import axiosInstance from '../../api/axiosInstance';
import CoverPhoto from '../CoverPhoto/CoverPhoto';
import CursorTrail from '../CursorTrail/CursorTrail';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get('/api/projets');
        const projectsData =
          response.data['hydra:member'] ||
          response.data.member ||
          response.data;
        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
        } else {
          console.error("La structure des projets n'est pas un tableau", projectsData);
          setError("La structure de la réponse est inattendue.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des projets.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // if (loading) return <p>Chargement des projets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="gradient_wapper">
      <div className="container_portolio mx-auto p-4" ref={containerRef}>
        {/* Le composant CursorTrail se rend à l'intérieur du container et couvre 100% de sa surface */}
        <CursorTrail containerRef={containerRef} />
        <div className="content pt-6 pb-9">
          <h2 className="bg-purple-400 p-4 text-2xl font-bold mb-4 inline-block title-custom_am">Projets</h2>
          <div className="projects_container pt-6 relative mx-auto max-w-6xl">
            <div className="projects_grid grid gap-8 justify-center grid-cols-1 md:grid-cols-[240px_240px_240px]">
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
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;
