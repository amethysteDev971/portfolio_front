// src/pages/Home.jsx
import React from 'react';
import Loading3D from '../Components/Loading3D/Loading3D';
import ScrollingBanner from '../Components/ScrollingBanner/ScrollingBanner';
import ProjectsList from '../Components/ProjectsList/ProjectsList';

const Home = () => (
  <>
    <header>
      <Loading3D />
    </header>
    <ScrollingBanner />
    <section className="bg-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="p-10">Bienvenue dans mon univers créatif</h1>
      </div>
    </section>
    <ProjectsList />
  </>
);

export default Home;
