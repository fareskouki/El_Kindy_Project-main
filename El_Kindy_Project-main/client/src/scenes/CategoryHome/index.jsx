import React, { useEffect, useState, useRef } from 'react';
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import { useSelector } from "react-redux";
import { loadScripts } from '../../scriptLoader';
import BannerStartHome from 'components/BannerStartHome';

function Index() {
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.user);
  const scriptsLoaded = useRef(false);

  useEffect(() => {
    // Charger les scripts nécessaires au composant
    const scripts = [
      '/assets/vendor/bootstrap/dist/js/bootstrap.bundle.min.js',
      '/assets/vendor/bootstrap/dist/js/bootstrap.bundle.js',
      '/assets/vendor/tiny-slider/tiny-slider.js',
      '/assets/vendor/glightbox/js/glightbox.js',
      '/assets/vendor/purecounterjs/dist/purecounter_vanilla.js',
      '/assets/js/functions.js',
      '/assets/vendor/choices/js/choices.min.js',
      '/assets/vendor/aos/aos.js',
      '/assets/vendor/quill/js/quill.min.js',
      '/assets/vendor/stepper/js/bs-stepper.min.js',
    ];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    // Nettoyage en fin de vie du composant
    return () => {
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []);

  // Récupérer les catégories de l'API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories/allCategories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);
  const cardBackgroundClasses = ['bg-success bg-opacity-10', 'bg-orange bg-opacity-10', 'bg-danger bg-opacity-10', 'bg-purple bg-opacity-10', 'bg-info bg-opacity-10', 'bg-blue bg-opacity-10', 'bg-warning bg-opacity-15', 'bg-dark bg-opacity-10'];

  return (
    <>
      <NavBar />
<div>
   {/* =======================
Page Banner START */}
      <BannerStartHome
        title="Category"
        description="Learn more about our category"
        list={categories}
        />
        {/* =======================
Page Banner END */}

  
  {/* =======================
Categories START */}
      <section>
          <div className="container">
            <div className="row mb-4">
              <div className="col-lg-8 mx-auto text-center">
                <h2>Choose a Categories</h2>
                <p className="mb-0">Explore our wide range of courses.</p>
              </div>
            </div>
            <div className="row g-4">
              {categories.map((category, index) => (
                <div key={index} className="col-sm-6 col-md-4 col-xl-3">
                  <div className={`card card-body text-center position-relative btn-transition p-4 ${cardBackgroundClasses[index % cardBackgroundClasses.length]}`}>
                    <div className="icon-xl mx-auto rounded-circle mb-3">
                      <img className="icon-xl mx-auto rounded-circle mb-3"
                        src={`http://localhost:3001/assets/${category.picturePath}`}
                        alt={category.name}
                        style={{ width: '80%', height: '70px', maxWidth: '70px' }} // Ajuster selon les besoins
                      />
                    </div>
                    <h5 className="mb-2"><a href="#" className="stretched-link">{category.name}</a></h5>
                    <p className="mb-0">{category.description}</p> {/* Ajouté pour montrer la description si nécessaire */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Index;
