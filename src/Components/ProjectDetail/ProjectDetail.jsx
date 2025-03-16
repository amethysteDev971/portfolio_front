import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import SectionDetail from '../SectionDetail/SectionDetail';
import RelatedProjects from '../RelatedProjects/RelatedProjects';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/api/projets/${id}`);
        setProject(response.data);
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement du projet.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center">Chargement du projet...</p>;
  if (error) return <p className="text-center">{error}</p>;
  if (!project) return <p className="text-center">Projet non trouvé.</p>;

  return (
    <div className="bg-custom text-custom w-full max-w-screen-lg mx-auto p-4 pt-24">
      <h2 className="text-2xl font-bold mb-4 text-left">{project.title}</h2>
      <p className="text-gray-700 mb-8">{project.description}</p>

      {project.sections && Array.isArray(project.sections) && project.sections.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 text-left">Sections</h3>
          {project.sections.map((sectionEndpoint, idx) => (
            <SectionDetail key={idx} sectionEndpoint={sectionEndpoint} />
          ))}
        </div>
      )}

      {/* Projets connexes en excluant le projet courant */}
      <RelatedProjects currentProjectId={id} />
    </div>
  );
};

export default ProjectDetail;
