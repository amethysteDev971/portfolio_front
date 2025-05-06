// src/pages/Home.jsx
import React from 'react';
import Loading3D from '../Components/Loading3D/Loading3D';
import ScrollingBanner from '../Components/ScrollingBanner/ScrollingBanner';
import ProjectsList from '../Components/ProjectsList/ProjectsList';
import './Home.css'; // Importation du fichier CSS pour le style

const Home = () => (
  <>
    <header>
      <Loading3D />
    </header>
    <ScrollingBanner />
    <section className="bg-purple-600 p-6">
      <div className="max-w-[1440px] wrapper-txt-hue_ad mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-[920px]">
        <h1 className="pt-10 pb-5"><span className="font-light">Développeuse </span><span className="txt-hue_ad">FullStack</span> <span className="font-light">& <br/>Designer Créative</span></h1>
        <h2 className="pb-6 font-bold">
          ..Un espace où créativité et technologie se rencontrent. 
        </h2>
         <p className='text-left pb-10'>Issu d’un parcours de graphiste et depuis plusieurs années maintenant, passionnée par le développement FullStack, j’allie l’esthétique du design à la rigueur du code pour créer des projets à la fois inspirants et performants. {/*<br/>Ce portfolio, riche en illustrations, n’est qu’un aperçu de mes compétences diversifiées : une invitation à découvrir un univers atypique, où chaque projet repousse les frontières du possible. */}</p>
      </div>

    </section>
    <ProjectsList />
  </>
);

export default Home;
