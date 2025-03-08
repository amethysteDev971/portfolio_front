// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/Navbar';
import Loading3D from './Components/Loading3D/Loading3D';
import ScrollingBanner from './Components/ScrollingBanner/ScrollingBanner';


// const todos = [
//   'bbklbdklaz',
//   'fsgfkgsdhfjgkf',
//   'gsdjkhsjdkgf'
// ]

function App() {
 

  return (
    <>
    <div id="main">
      <Navbar/>
      {/* <nav></nav> */}
      <header>
      <Loading3D/>
      </header>
      <ScrollingBanner />
      <section className='bg-purple-600  '>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='p-10'>Bienvenue dans mon univers créatif</h1>
          <p className='p-10'>Bienvenue sur mon portfolio, l’espace où la créativité se mêle à la technique. Passionné(e) de design, d’illustration et de développement, je mets mon savoir-faire au service de projets qui allient esthétique, innovation et performance.
             À travers ce site, je vous invite à découvrir une sélection de mes réalisations : des designs graphiques raffinés, des illustrations originales et des solutions de développement web qui repoussent les limites de la créativité. Chaque projet est une aventure, une recherche de l’harmonie entre forme et fonctionnalité, et une invitation à explorer de nouvelles perspectives.
             Prenez le temps de parcourir mon travail et laissez-vous inspirer par la synergie unique entre art visuel et technologie.</p>
        </div>
        
        
      </section>
      {/* <section className='bg-purple-600'>
        <h1>Bonjour, vous êtes sur la home</h1>
        <ul>
          {todos.map(todo => (<li key={todo}>{todo}</li>))}
        </ul>
      </section> */}
    </div>
    </>
  )
}

export default App
