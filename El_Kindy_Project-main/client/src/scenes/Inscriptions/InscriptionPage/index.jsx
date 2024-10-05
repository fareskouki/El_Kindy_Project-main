import React , { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import BannerStart from 'components/BannerStart';
import InscriptionCorsus from 'components/InscriptionCorsus';

function Index() {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when component mounts
  }, []);
    const { id } = useParams();
  return (
    <div>
        <NavBar />
        <InscriptionCorsus
          title={id}
        />
        <Footer />
    </div>
  )
}

export default Index