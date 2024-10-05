import Footer from "components/Footer";
import NavBar from "components/NavBar";
import React, { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';

import { useSelector } from "react-redux";
import { loadScripts } from "../../scriptLoader";
import axios from "axios";


function Index() {
  const user = useSelector((state) => state.user);
  const scriptsLoaded = useRef(false);
  const [coursesByCategories, setCoursesByCategories] = useState([]);
  
//
  const [currentImage, setCurrentImage] = useState(0);
  const [nextImage, setNextImage] = useState(1);
  const images = [
    "assets/images/element/slider1.jpg",
    "assets/images/element/slider2.jpg",
    "assets/images/element/slider3.jpg",
    // Add more image URLs as needed
  ];

  //get all category
  const fetchCoursesByCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/course/getAllByCategories"
      );
      //console.log("response : ", response.data);
      setCoursesByCategories(response.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when component mounts
    //Get all category
    fetchCoursesByCategories();
    console.log("user",user);

    const scripts = [
      "/assets/vendor/purecounterjs/dist/purecounter_vanilla.js",
    ];

    if (!scriptsLoaded.current) {
      loadScripts(scripts);
      scriptsLoaded.current = true;
    }

    return () => {
      // Remove all script tags
      const scriptTags = document.querySelectorAll('script[src^="/assets"]');
      scriptTags.forEach((scriptTag) => {
        scriptTag.parentNode.removeChild(scriptTag);
      });
    };
  }, []); // Empty dependency array ensures this effect runs only once
  

  useEffect(() => {
    const interval = setInterval(() => {
      setNextImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
//test
  useEffect(() => {
    const transitionTimer = setTimeout(() => {
      setCurrentImage(nextImage);
    }, 1000); // Change image after 1 second (adjust as needed)

    return () => clearTimeout(transitionTimer);
  }, [nextImage]);

  

  return (
    <>
      <NavBar />
      <div>
        {/* Start Hero Section 
      <Hero 
        title="Modern Interior Design Studio" 
        disc="Donec vitae odio quis nisl dapibus malesuada. Nullam ac aliquet velit. Aliquam vulputate velit imperdiet dolor tempor tristique." 
      />
      
		  {/* End Hero Section */}

        {/* =======================
Main Banner START */}
        <section className="position-relative bg-light overflow-hidden pt-5 pt-lg-6">
          {/* SVG START */}
          <figure className="position-absolute top-50 start-0 translate-middle-y ms-n7 d-none d-xxl-block">
            <svg className="rotate-74 fill-danger opacity-1">
              <circle cx="180.4" cy="15.5" r="7.7" />
              <path d="m159.9 22.4c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <ellipse
                transform="matrix(.3862 -.9224 .9224 .3862 71.25 138.08)"
                cx="139.4"
                cy="15.5"
                rx="6.1"
                ry="6.1"
              />
              <circle cx="118.9" cy="15.5" r="5.4" />
              <path d="m98.4 20.1c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6z" />
              <path d="m77.9 19.3c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z" />
              <path d="m57.3 18.6c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 17.8c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="15.5" r="1.6" />
              <circle cx="180.4" cy="38.5" r="7.7" />
              <path d="m159.9 45.3c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <ellipse
                transform="matrix(.8486 -.5291 .5291 .8486 .7599 79.566)"
                cx="139.4"
                cy="38.5"
                rx="6.1"
                ry="6.1"
              />
              <circle cx="118.9" cy="38.5" r="5.4" />
              <path d="m98.4 43.1c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6z" />
              <circle cx="77.9" cy="38.5" r="3.8" />
              <path d="m57.3 41.5c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1c0 1.8-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 40.8c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="38.5" r="1.6" />
              <circle cx="180.4" cy="61.4" r="7.7" />
              <path d="m159.9 68.3c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <ellipse
                transform="matrix(.3862 -.9224 .9224 .3862 28.902 166.26)"
                cx="139.4"
                cy="61.4"
                rx="6.1"
                ry="6.1"
              />
              <circle cx="118.9" cy="61.4" r="5.4" />
              <path d="m98.4 66c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6c0 2.6-2.1 4.6-4.6 4.6z" />
              <path d="m77.9 65.2c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z" />
              <path d="m57.3 64.5c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 63.7c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="61.4" r="1.6" />
              <circle cx="180.4" cy="84.4" r="7.7" />
              <path d="m159.9 91.3c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <path d="m139.4 90.5c-3.4 0-6.1-2.7-6.1-6.1s2.7-6.1 6.1-6.1 6.1 2.7 6.1 6.1c0 3.3-2.7 6.1-6.1 6.1z" />
              <circle cx="118.9" cy="84.4" r="5.4" />
              <path d="m98.4 89c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6z" />
              <path d="m77.9 88.2c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z" />
              <path d="m57.3 87.4c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1c0 1.8-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 86.7c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="84.4" r="1.6" />
              <circle cx="180.4" cy="107.3" r="7.7" />
              <path d="m159.9 114.2c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <path d="m139.4 113.4c-3.4 0-6.1-2.7-6.1-6.1s2.7-6.1 6.1-6.1 6.1 2.7 6.1 6.1-2.7 6.1-6.1 6.1z" />
              <circle cx="118.9" cy="107.3" r="5.4" />
              <path d="m98.4 111.9c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6c0 2.6-2.1 4.6-4.6 4.6z" />
              <path d="m77.9 111.2c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z" />
              <path d="m57.3 110.4c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 109.6c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3c0.1 1.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="107.3" r="1.6" />
              <circle cx="180.4" cy="130.3" r="7.7" />
              <path d="m159.9 137.2c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <ellipse
                transform="matrix(.3862 -.9224 .9224 .3862 -34.62 208.52)"
                cx="139.4"
                cy="130.3"
                rx="6.1"
                ry="6.1"
              />
              <circle cx="118.9" cy="130.3" r="5.4" />
              <path d="m98.4 134.9c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6z" />
              <path d="m77.9 134.1c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z" />
              <path d="m57.3 133.4c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 132.6c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="130.3" r="1.6" />
              <circle cx="180.4" cy="153.2" r="7.7" />
              <path d="m159.9 160.1c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <ellipse
                transform="matrix(.3862 -.9224 .9224 .3862 -55.794 222.61)"
                cx="139.4"
                cy="153.2"
                rx="6.1"
                ry="6.1"
              />
              <circle cx="118.9" cy="153.2" r="5.4" />
              <path d="m98.4 157.8c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6c0 2.6-2.1 4.6-4.6 4.6z" />
              <circle cx="77.9" cy="153.2" r="3.8" />
              <path d="m57.3 156.3c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 155.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="153.2" r="1.6" />
              <circle cx="180.4" cy="176.2" r="7.7" />
              <path d="m159.9 183.1c-3.8 0-6.9-3.1-6.9-6.9s3.1-6.9 6.9-6.9 6.9 3.1 6.9 6.9-3.1 6.9-6.9 6.9z" />
              <ellipse
                transform="matrix(.3862 -.9224 .9224 .3862 -76.968 236.7)"
                cx="139.4"
                cy="176.2"
                rx="6.1"
                ry="6.1"
              />
              <circle cx="118.9" cy="176.2" r="5.4" />
              <path d="m98.4 180.8c-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2.1 4.6-4.6 4.6z" />
              <path d="m77.9 180c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8z" />
              <path d="m57.3 179.3c-1.7 0-3.1-1.4-3.1-3.1s1.4-3.1 3.1-3.1 3.1 1.4 3.1 3.1-1.4 3.1-3.1 3.1z" />
              <path d="m36.8 178.5c-1.3 0-2.3-1-2.3-2.3s1-2.3 2.3-2.3 2.3 1 2.3 2.3-1 2.3-2.3 2.3z" />
              <circle cx="16.3" cy="176.2" r="1.6" />
            </svg>
          </figure>
          {/* SVG END */}
          {/* SVG START */}
          <span className="position-absolute top-50 end-0 translate-middle-y mt-5 me-n5 d-none d-xxl-inline-flex">
            <svg className="fill-warning rotate-186 opacity-8">
              <path d="m35.4 54.2c0 0.6 0 1.1-0.1 1.7-0.9 9.3-9.2 16.1-18.5 15.1-4.5-0.4-8.5-2.6-11.4-6.1-2.8-3.5-4.2-7.9-3.7-12.4 0.9-9.3 9.2-16.1 18.5-15.1 4.5 0.4 8.5 2.6 11.4 6.1 2.4 3 3.8 6.8 3.8 10.7zm-33.4 0c0 3.8 1.3 7.5 3.8 10.4 2.8 3.4 6.8 5.5 11.2 6 9.1 0.9 17.2-5.8 18.1-14.8 0.4-4.4-0.9-8.7-3.7-12.1s-6.8-5.5-11.2-6c-9.2-0.8-17.3 5.8-18.2 14.9v1.6z" />
              <path d="m39 54.1c0 1.1-0.1 2.2-0.3 3.3-1.8 9.8-11.2 16.2-21 14.4-4.7-0.8-8.8-3.5-11.5-7.4-2.7-4-3.7-8.7-2.8-13.5 1.8-9.8 11.2-16.2 21-14.4 4.7 0.9 8.8 3.6 11.5 7.5 2.1 3 3.1 6.6 3.1 10.1zm-35.6 0.1c0 3.5 1.1 7 3.1 9.9 2.7 3.9 6.7 6.5 11.3 7.4 9.6 1.8 18.8-4.5 20.6-14.1 0.9-4.6-0.1-9.3-2.8-13.2s-6.7-6.5-11.3-7.4c-9.6-1.8-18.8 4.5-20.6 14.1-0.2 1.1-0.3 2.2-0.3 3.3z" />
              <path d="m42.8 54.2c0 1.7-0.2 3.3-0.7 5-2.7 10.2-13.3 16.3-23.5 13.6-5-1.3-9.1-4.5-11.7-8.9-2.5-4.5-3.2-9.7-1.9-14.7 2.7-10.2 13.3-16.3 23.5-13.6 5 1.3 9.1 4.5 11.7 8.9 1.7 3 2.6 6.3 2.6 9.7zm-38.1 0c0 3.3 0.9 6.5 2.5 9.4 2.5 4.4 6.6 7.5 11.5 8.8 10 2.7 20.4-3.3 23.1-13.4 1.3-4.9 0.6-9.9-1.9-14.3s-6.6-7.5-11.5-8.8c-10-2.6-20.4 3.4-23 13.4-0.5 1.6-0.7 3.3-0.7 4.9z" />
              <path d="m46.7 54.2c0 2.2-0.4 4.5-1.1 6.6-3.6 10.7-15.3 16.5-26.1 12.8-5.2-1.8-9.4-5.4-11.8-10.4-2.4-4.9-2.8-10.5-1-15.7 3.6-10.6 15.3-16.4 26-12.8l-0.1 0.2 0.1-0.2c5.2 1.8 9.4 5.4 11.8 10.4 1.5 2.9 2.2 6 2.2 9.1zm-40.8 0c0 3.1 0.7 6.1 2.1 8.9 2.4 4.8 6.5 8.4 11.6 10.2 10.5 3.6 22-2.1 25.6-12.6 1.7-5.1 1.4-10.6-1-15.4s-6.5-8.4-11.6-10.2c-10.5-3.6-22 2.1-25.6 12.6-0.7 2.1-1.1 4.3-1.1 6.5z" />
              <path d="m50.7 54.2c0 2.8-0.5 5.6-1.6 8.2-4.5 11.2-17.4 16.6-28.6 12.1-5.4-2.2-9.7-6.4-12-11.8s-2.3-11.4-0.1-16.8c4.5-11.2 17.4-16.6 28.6-12.1 5.4 2.2 9.7 6.4 12 11.8 1.1 2.8 1.7 5.7 1.7 8.6zm-43.6 0c0 2.8 0.6 5.7 1.7 8.4 2.2 5.3 6.4 9.4 11.8 11.6 11 4.5 23.6-0.9 28.1-11.9 2.2-5.3 2.1-11.2-0.1-16.5s-6.4-9.4-11.8-11.6c-11-4.5-23.6 0.9-28.1 11.9-1.1 2.6-1.6 5.3-1.6 8.1z" />
              <path d="m54.7 54.2c0 3.4-0.7 6.7-2.2 9.9-5.5 11.7-19.5 16.7-31.2 11.3-5.7-2.6-10-7.3-12.1-13.2s-1.8-12.2 0.8-17.9c5.5-11.7 19.4-16.8 31.1-11.3 5.7 2.6 10 7.3 12.1 13.2 1 2.6 1.5 5.3 1.5 8zm-46.5 0c0 2.7 0.5 5.3 1.4 7.9 2.1 5.8 6.3 10.4 11.9 13 11.5 5.4 25.3 0.4 30.6-11.1 2.6-5.6 2.9-11.8 0.8-17.6s-6.3-10.4-11.9-13l0.1-0.2-0.1 0.1c-11.5-5.4-25.3-0.4-30.6 11.1-1.5 3.1-2.2 6.5-2.2 9.8z" />
              <path d="m58.7 54.2c0 4-1 7.9-2.8 11.5-6.4 12.2-21.5 16.9-33.6 10.6-6-3.1-10.3-8.3-12.3-14.6s-1.4-13.1 1.7-19c6.3-12.2 21.4-17 33.6-10.6 5.9 3.1 10.3 8.3 12.3 14.6 0.8 2.5 1.1 5 1.1 7.5zm-49.5 0c0 2.5 0.4 5 1.1 7.4 2 6.3 6.3 11.4 12.1 14.4 12 6.3 26.9 1.6 33.1-10.4 3-5.8 3.6-12.5 1.7-18.7-2-6.3-6.3-11.4-12.1-14.4-12-6.3-26.9-1.6-33.1 10.4-1.9 3.5-2.8 7.4-2.8 11.3z" />
              <path d="m62.9 54.2c0 4.6-1.2 9.1-3.5 13.1-7.3 12.7-23.6 17.1-36.2 9.9-6.1-3.5-10.5-9.2-12.4-16s-0.9-14 2.6-20.1c7.3-12.7 23.5-17.1 36.2-9.8l-0.1 0.2 0.1-0.2c6.1 3.5 10.5 9.2 12.4 16 0.5 2.3 0.9 4.6 0.9 6.9zm-52.7-0.1c0 2.3 0.3 4.6 0.9 6.9 1.8 6.7 6.2 12.3 12.2 15.8 12.5 7.2 28.5 2.9 35.7-9.6 3.5-6.1 4.4-13.1 2.5-19.8-1.8-6.7-6.2-12.3-12.2-15.8-12.5-7.2-28.5-2.8-35.7 9.7-2.2 3.9-3.4 8.3-3.4 12.8z" />
              <path d="m67 54.2c0 5.2-1.4 10.3-4.2 14.8-8.2 13.2-25.5 17.2-38.7 9-6.4-4-10.8-10.2-12.5-17.5s-0.5-14.8 3.5-21.2c8.2-13.2 25.5-17.2 38.7-9 6.4 4 10.8 10.2 12.5 17.5 0.5 2.1 0.7 4.3 0.7 6.4zm-55.9-0.1c0 2.1 0.2 4.3 0.7 6.4 1.7 7.2 6.1 13.3 12.4 17.2 13 8.1 30.1 4.1 38.2-8.9 3.9-6.3 5.1-13.7 3.4-20.9s-6.1-13.3-12.4-17.2c-13-8.1-30.1-4.1-38.2 8.9-2.6 4.4-4.1 9.4-4.1 14.5z" />
              <path d="m71.2 54.2c0 5.8-1.7 11.5-5 16.4-9.1 13.7-27.6 17.4-41.2 8.3-6.6-4.4-11.1-11.1-12.7-18.9s0-15.7 4.4-22.3c9.1-13.6 27.6-17.4 41.2-8.3 6.6 4.4 11.1 11.1 12.7 18.9 0.4 2 0.6 4 0.6 5.9zm-59.1-0.1c0 1.9 0.2 3.9 0.6 5.9 1.5 7.7 6 14.3 12.5 18.6 13.5 9 31.7 5.3 40.7-8.2 4.3-6.5 5.9-14.4 4.3-22-1.5-7.7-6-14.3-12.5-18.6-13.5-9-31.7-5.3-40.7 8.2-3.3 4.8-4.9 10.4-4.9 16.1z" />
              <path d="m75.4 54.3c0 6.4-2 12.7-5.8 18-10 14.1-29.6 17.5-43.7 7.5-6.9-4.8-11.4-12-12.8-20.3s0.5-16.6 5.3-23.4c9.9-14.1 29.6-17.5 43.7-7.5 6.8 4.8 11.4 12 12.8 20.3 0.3 1.8 0.5 3.6 0.5 5.4zm-62.4-0.2c0 1.8 0.2 3.6 0.5 5.3 1.4 8.2 5.9 15.3 12.7 20.1 14 9.9 33.4 6.5 43.2-7.4 4.8-6.8 6.6-15 5.2-23.1-1.4-8.2-5.9-15.3-12.7-20.1-14-9.9-33.4-6.5-43.2 7.4-3.8 5.3-5.7 11.5-5.7 17.8z" />
              <path d="m79.6 54.3c0 7.1-2.3 13.9-6.5 19.7-10.9 14.6-31.6 17.7-46.3 6.8-7.1-5.3-11.7-13-13-21.7s0.9-17.4 6.2-24.5c10.9-14.6 31.6-17.7 46.3-6.8 7.1 5.3 11.7 13 13 21.7 0.2 1.5 0.3 3.1 0.3 4.8zm-65.8-0.2c0 1.6 0.1 3.2 0.4 4.8 1.3 8.7 5.8 16.3 12.8 21.5 14.5 10.8 35 7.7 45.7-6.7 5.2-7 7.4-15.6 6.1-24.2s-5.8-16.3-12.8-21.5l0.1-0.1v0.1c-14.5-10.8-35-7.7-45.7 6.7-4.3 5.7-6.6 12.4-6.6 19.4z" />
              <path d="m83.9 54.3c0 7.7-2.5 15.1-7.4 21.3-11.8 15.1-33.7 17.8-48.8 6-7.3-5.7-12-13.9-13.1-23.1s1.4-18.3 7.1-25.6c11.8-15.1 33.7-17.8 48.8-6 7.3 5.7 12 13.9 13.1 23.1 0.2 1.4 0.3 2.8 0.3 4.3zm-69.2-0.2c0 1.4 0.1 2.9 0.3 4.3 1.1 9.1 5.7 17.2 13 22.9 15 11.7 36.6 9 48.3-6 5.7-7.2 8.1-16.2 7-25.4-1.1-9.1-5.7-17.2-13-22.9-15-11.7-36.6-9-48.3 6-4.8 6.1-7.3 13.5-7.3 21.1z" />
              <path d="m88.1 54.3c0 8.3-2.8 16.4-8.2 22.9-12.7 15.6-35.7 18-51.3 5.3-7.6-6.1-12.3-14.9-13.3-24.5-1-9.7 1.8-19.2 8-26.7 12.7-15.6 35.7-18 51.3-5.3 7.6 6.1 12.3 14.9 13.3 24.5 0.2 1.2 0.2 2.5 0.2 3.8zm-72.6-0.2c0 1.2 0.1 2.5 0.2 3.8 1 9.6 5.6 18.2 13.1 24.3 15.5 12.5 38.3 10.2 50.9-5.2 6.1-7.5 8.9-16.9 7.9-26.5s-5.6-18.2-13.1-24.3c-15.5-12.6-38.3-10.2-50.9 5.2-5.2 6.5-8.1 14.5-8.1 22.7z" />
              <path d="m92.4 54.2c0 9-3.1 17.6-9 24.6-13.6 16.1-37.7 18.1-53.8 4.5-7.8-6.6-12.6-15.8-13.4-26-0.9-10.2 2.3-20 8.9-27.8 13.5-16 37.7-18.1 53.8-4.5 7.8 6.6 12.6 15.8 13.4 26 0.1 1.1 0.1 2.2 0.1 3.2zm-76-0.1c0 1.1 0 2.1 0.1 3.2 0.8 10.1 5.6 19.2 13.3 25.7 15.9 13.5 39.8 11.4 53.3-4.5 6.5-7.7 9.7-17.5 8.8-27.6-0.8-9.9-5.6-19.1-13.3-25.6-15.9-13.5-39.8-11.4-53.3 4.5-5.8 6.9-8.9 15.4-8.9 24.3z" />
              <path d="m96.7 54.2c0 9.7-3.5 18.9-9.9 26.2-14.5 16.6-39.8 18.3-56.3 3.8-8-7-12.8-16.7-13.6-27.4-0.7-10.6 2.8-20.9 9.8-28.9 14.5-16.6 39.8-18.2 56.3-3.8l-0.1 0.1 0.1-0.1c8 7 12.8 16.7 13.6 27.4 0.1 0.9 0.1 1.8 0.1 2.7zm-79.5-0.1c0 0.9 0 1.8 0.1 2.7 0.7 10.6 5.4 20.2 13.4 27.1 16.4 14.4 41.5 12.7 55.8-3.7 7-7.9 10.4-18.1 9.7-28.7-0.7-10.5-5.4-20.1-13.4-27.1-16.4-14.3-41.5-12.7-55.8 3.8-6.4 7.2-9.8 16.4-9.8 25.9z" />
              <path d="m101 54.2c0 10.3-3.8 20.1-10.7 27.9-15.4 17.1-41.8 18.4-58.9 3-8.3-7.5-13.1-17.7-13.7-28.8s3.2-21.8 10.7-30c15.4-17.1 41.8-18.4 58.9-3 8.3 7.5 13.1 17.7 13.7 28.8v2.1zm-83-0.1c0 0.7 0 1.4 0.1 2.2 0.6 11 5.4 21.1 13.6 28.5 16.9 15.3 43.1 13.9 58.4-3 7.4-8.2 11.2-18.8 10.6-29.8s-5.4-21.1-13.6-28.5c-16.9-15.3-43.1-13.9-58.4 3-7 7.7-10.7 17.4-10.7 27.6z" />
              <path d="m105.3 54.2c0 11-4.1 21.4-11.6 29.5-16.3 17.5-43.9 18.6-61.4 2.3-8.5-7.9-13.4-18.6-13.8-30.2-0.5-11.6 3.6-22.7 11.5-31.2 16.3-17.5 43.9-18.5 61.4-2.2 8.5 7.9 13.4 18.6 13.8 30.2 0.1 0.5 0.1 1.1 0.1 1.6zm-86.5-0.1v1.6c0.4 11.5 5.3 22.1 13.7 30 17.4 16.2 44.7 15.2 60.9-2.2 7.8-8.4 11.9-19.4 11.5-30.9s-5.3-22.1-13.7-30l0.1-0.1-0.1 0.1c-17.4-16.1-44.7-15.1-60.9 2.3-7.5 8-11.5 18.3-11.5 29.2z" />
              <path d="m109.6 54.2c0 11.7-4.4 22.7-12.5 31.2-17.2 18-45.9 18.7-63.9 1.5-8.7-8.3-13.7-19.6-14-31.6-0.3-12.1 4.2-23.6 12.5-32.3 17.2-18 45.9-18.7 63.9-1.5 8.7 8.3 13.7 19.6 14 31.6v1.1zm-90 0v1.1c0.3 12 5.2 23.1 13.9 31.4 17.9 17.1 46.3 16.4 63.4-1.5 8.3-8.7 12.7-20 12.4-32s-5.3-23.2-13.9-31.4c-17.9-17.1-46.4-16.4-63.4 1.5-8.1 8.4-12.4 19.3-12.4 30.9z" />
              <path d="m113.9 54.2c0 12.3-4.7 24-13.4 32.8-18.1 18.5-47.9 18.9-66.4 0.8-9-8.8-14-20.5-14.1-33-0.2-12.5 4.6-24.4 13.4-33.4 18.1-18.6 47.9-18.9 66.4-0.8l-0.1 0.1 0.1-0.1c9 8.8 14 20.5 14.1 33v0.6zm-93.6 0v0.5c0.1 12.4 5.1 24.1 14 32.8 18.4 18 48 17.6 65.9-0.7 8.7-8.9 13.4-20.7 13.3-33.1s-5.1-24.1-14-32.8c-18.4-18-48-17.6-65.9 0.7-8.6 8.8-13.3 20.3-13.3 32.6z" />
              <path d="m118.3 54.2c0 13-5.1 25.3-14.3 34.5-19 19-50 19-69 0-9.2-9.2-14.3-21.4-14.3-34.5 0-13 5.1-25.3 14.3-34.5 19-19 50-19 69 0l-0.1 0.1 0.1-0.1c9.2 9.2 14.3 21.5 14.3 34.5zm-97.2 0c0 12.9 5 25.1 14.2 34.2 18.9 18.9 49.6 18.9 68.4 0 9.1-9.1 14.2-21.3 14.2-34.2s-5-25.1-14.2-34.2c-18.8-18.9-49.5-18.9-68.4 0-9.2 9.1-14.2 21.3-14.2 34.2z" />
            </svg>
          </span>
          {/* SVG END */}
          {/* SVG START */}
          <figure className="position-absolute top-0 start-0 ms-5">
            <svg className="fill-orange opacity-4" width="29px" height="29px">
              <path d="M29.004,14.502 C29.004,22.512 22.511,29.004 14.502,29.004 C6.492,29.004 -0.001,22.512 -0.001,14.502 C-0.001,6.492 6.492,-0.001 14.502,-0.001 C22.511,-0.001 29.004,6.492 29.004,14.502 Z" />
            </svg>
          </figure>
          {/* SVG END */}
          {/* Content START */}
          <div className="container">
            {/* Title */}
            <div className="row align-items-center g-5">
              {/* Left content START */}
              <div className="col-lg-5 col-xl-5 position-relative z-index-1 text-center text-lg-start mb-5 mb-sm-0">
                {/* SVG */}
                <figure className="fill-warning position-absolute bottom-0 end-0 me-5 d-none d-xl-block">
                  <svg width="42px" height="42px">
                    <path d="M21.000,-0.001 L28.424,13.575 L41.999,20.999 L28.424,28.424 L21.000,41.998 L13.575,28.424 L-0.000,20.999 L13.575,13.575 L21.000,-0.001 Z" />
                  </svg>
                </figure>
                {/* SVG */}
                <figure className="fill-success position-absolute top-0 start-50 translate-middle-x mt-n5 ms-5">
                  <svg width="22px" height="21px">
                    <path d="M10.717,4.757 L14.440,-0.001 L14.215,6.023 L20.142,4.757 L16.076,9.228 L21.435,12.046 L15.430,12.873 L17.713,18.457 L12.579,15.252 L10.717,20.988 L8.856,15.252 L3.722,18.457 L6.005,12.873 L-0.000,12.046 L5.359,9.228 L1.292,4.757 L7.220,6.023 L6.995,-0.001 L10.717,4.757 Z" />
                  </svg>
                </figure>
                {/* Title */}
                <h1 className="mb-0 display-6">
                  The art is in you !<br />
                  <span className="position-relative">
                    For 20 years...
                    {/* SVG START */}
                    <span className="position-absolute top-50 start-50 translate-middle ms-3 z-index-n1">
                      <svg
                        width="300px"
                        height="62.1px"
                        enableBackground="new 0 0 366 62.1"
                        viewBox="0 0 366 62.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="fill-warning"
                          d="m322.5 25.3c0 1.4 2.9 0.8 3.1 1.6 0.8 1.1-1.1 1.3-0.6 2.4 13.3 0.9 26.9 1.7 40.2 4-2.5 0.7-4.9 1.6-7.3 1.1-4-0.9-8.2-1-12.2-1.2-8.5-0.5-16.9-1.9-25.5-1.7h-3.1c2.6 0.6 4.8 0.4 5.7 2.2-7.3 0.4-14.1-0.8-21.2-1.1-0.2 0.6-0.5 1.2-0.8 1.8 21.3 0.7 42.5 1.6 64.3 4.6-4.2 1.6-7.7 1-10.8 0.8-6.8-0.5-13.5-1.3-20.3-1.9-0.9-0.1-2.3-0.1-2.9 0.2-2.2 1.6-4.3 0.6-7 0.4 1.4-1 2.5 0.5 3.9-0.8-5.6-1-10.7 0.6-15.9 0s-10.5-0.6-16.6-0.8c2 1.6 4.6 1.3 6.2 1.4 4.9 0 9.9 0.8 14.8 0.7 5.3-0.1 10.4 0.5 15.5 0.9 3.2 0.3 6.7-0.1 9.9-0.4 1.1-0.1 0.5 0.3 0.6 0.6 0.5 0.9 2.2 0.8 3.6 0.8 5.1-0.1 10.1 0.6 14.8 1.5 0.8 0.1 1.5 0 1.7 0.7 0 0.7-0.8 0.6-1.5 0.8-3.9 1.2-7.4-0.2-11.1-0.2-2 0-4.3-1.5-6 0.5-0.3 0.4-1.4 0.1-2.2-0.1-4.5-0.8-9.1-0.5-13.8-1.5-2.3-0.5-5.6 0.1-8.4 0.5-4 0.5-8-0.7-12.1-0.9-3.4-0.2-7.1-0.5-10.5-0.7-7.1-0.3-14.2-1.2-22.3-0.4 4.9 1.1 9.4 1.2 13.8 1.2 9.7 0 19.2 2.3 28.9 1.6 7.3 3.2 15.9 1.5 23.8 2.9 4.9 0.8 10.1 0.8 15.2 1.2 0.5 0 0.8 0.3 1.1 0.9-20-2.1-40.2-1.4-60.8-3 4.9 2.1 10.8-0.3 15.3 2.7-8 1.9-15.8-0.9-23.5-0.1 2.8 1.4 7.1 1.1 9.3 3.3 0.5 0.5 0.2 1.1-1.2 1.3 2.3 1 3.4-2.1 5.7-0.4 0.2-0.6 0.2-1 0.3-1.5 0.8-0.3 2 0.8 1.5 1.5-0.2 0.1 0 0.3 0 0.5 18.7 0.4 37.3 1.7 56.2 3.6-1.7 1.1-2.8 1.2-4.2 1.1-7.1-0.5-14.1-0.9-21.2-1.4-3.1-0.2-6.3-0.4-9.4-0.4-7.6-0.2-15-0.7-22.4-1-9-0.4-17.9-0.1-26.9-0.1-1.2 0-2.9-0.4-3.9 1 14.8 0.3 29.7 0.6 44.4 1.1 14.8 0.6 29.9 1.3 44.2 4.2-4.3 1-8.8 0.9-13 0.5-5.3-0.5-10.5-1.1-15.8-1.2-11.4-0.3-22.9-0.9-34.3-1.2-17.6-0.4-35.4-0.3-53.1-0.4-10.8-0.1-21.7-0.2-32.5 0-17.8 0.4-35.7 0.2-53.5 0.5-13.1 0.3-26.3 0.1-39.4 0.5-11.1 0.3-22.4 0.6-33.6 1-13.1 0.6-26.1 0.2-39.3 0.4-3.9 0.1-7.6 0.2-11.8-0.2 0.9-1.2 2.3-1.3 3.9-1.3 8.4 0.2 16.6-0.4 24.9-0.9 3.9-0.2 7.9-0.4 11.9 0.2 2.5 0.4 5.3-0.3 8-0.4 7.3-0.4 14.7-0.7 22-0.9 11.9-0.5 23.7-1.2 35.6-0.8 7.7 0.2 15.3-0.6 22.9-0.1 2.3 0.2 4.3-0.5 6.5-1h-17.6c-9.6 0-19-0.1-28.6 0-8 0.1-16.1 0.3-24 0.8-2.6 0.2-5.4 0.1-8.2 0.1-10.1 0.3-20.1 0.6-30.2 0.5-5.4 0-10.7-0.1-15.9 0.6-2.3 0.3-4-1.3-6.5-0.6 0.2 0.4 0.5 0.9 0.6 1.5-1.9 0-4 0.4-4.9-0.1-4.2-2.2-9.4-1.5-14.1-2.3-1.7-0.3-3.7-0.1-4.3-1.5-0.5-1.3 1.9-1.5 2.6-2.6-4.2-1.4-4.6-5-8.5-7.2-1.5 0.2-0.9 2.8-4.2 1.3 0.3 2.4 4.5 3.9 2.8 6.4-2.3 0.3-3.2-0.8-4.2-1.7-2.5-4-5.1-8.4-5.1-12.7 0.2-6.8 0.2-13.8 3.6-20.4 0.3-0.5 0.3-1 0.8-1.4 0.9-0.9 1.2-2.4 3.6-2.1 2.2 0.2 2.5 1.5 2.6 2.6 0.2 1.4 1.5 1.8 3.2 2.5 0.9-1.4 0.5-2.9 2.6-3.7 0.2-0.1 0.3-0.4 0.3-0.4-3.1-2.2 1.2-2.2 2.3-3.3-3.1-1.8-4-4.3-3.7-7-1.5-0.3-3.1-0.4-4.5 0-1.7 0.6-2.2-0.5-2.9-1 0.6-0.5 0.8-1.1 2.2-1.3 7.6-0.9 15.2-1.7 22.9-2 20-0.7 39.9-0.9 59.9-1 11.9-0.1 23.8 0.4 35.6 1.1 3.6 0.2 7.1-0.9 10.7-0.5 7.9 0.9 15.8 0.3 23.8 0.5 7.3 0.1 14.4-0.6 21.7-0.1 12.2 0.9 24.4 0.3 36.7 0.6 9.4 0.3 18.9 0.4 28.2 1 11.9 0.7 23.8 1.3 35.6 2 11.1 0.6 22.4 0.5 33.3 2 7.1 1 14.4 1.1 21.3 2.4 4 0.7 8.2 1.6 12.4 1.9 2.2 0.2 0.9 1 1.5 1.5-4-0.8-8-0.8-12.1-1.4-4.3-0.7-8.5-1-12.8 0.4-2.9 1-6.3 0.2-9.3-0.1-10.2-1.1-20.6-1.6-30.8-2.4-12.1-0.9-24.3-1.4-36.4-2.1-9.9-0.6-20-0.5-29.9-1-11.4-0.6-22.7 0-34.2-0.5-6.3-0.3-12.3-0.3-18.5-0.4-4.2-0.1-8.4 1.3-12.8 0.3 0.6 0.2 1.2 0.7 1.9 0.7 10.5 0 20.9 1.9 31.6 1.7 6.5-0.1 13.1 0.2 19.8 0.8 3.2 0.3 6.3-0.4 9.7-0.1 7.6 0.7 15.5 0.5 23 0.8 12.4 0.5 24.7 0.4 37.1 1.1 13.3 0.7 26.8 2.1 39.9 4.1 6.2 0.9 12.7 1.5 19.2 1.7 0.6 0 1.1 0.1 1.5 0.5-4.6 0.1-9.3 0-13.9-0.5-0.6 1.1 1.4 0.9 1.5 1.9-9.7 1.6-19.6-1.4-29.4-0.1 2.2 1.4 5.1 1 7.4 1 7.3 0.1 14.1 1.3 21.2 1.9 2.8 0.3 5.9 0 8.5 0.8 1.5 0.5 4.6-1.1 4.9 1.3 4-0.7 7.3 1.5 11.1 1.2 4-0.3 7.7 0.6 11.6 1.1 0.8 0.1 2.2 0.3 2.3 1.1 0.2 1-1.1 1.2-2 1.5-3.4 1-6.7-0.4-10.1-0.4-0.9 0-2-0.2-2.9-0.2-9.4 0.1-18.8-1.3-28.3-1.8-6-0.4-12.1-0.9-18.1-1.3 0 0.2 0 0.4-0.2 0.6 6.1 0.5 12.1 1.4 18.3 0.7z"
                        />
                      </svg>
                    </span>
                    {/* SVG END */}
                  </span>
                </h1>
                {/* Content */}
                <p className="my-4 lead">
                  Our conservatory offers complete, adapted and tailor-made
                  musical training for all ages !
                </p>
                {/* Info */}
                <ul className="list-inline position-relative justify-content-center justify-content-lg-start mb-4">
                  <li className="list-inline-item me-2">
                    {" "}
                    <i className="bi bi-patch-check-fill h6 me-1" />
                    Learn with experts
                  </li>
                  <li className="list-inline-item me-2">
                    {" "}
                    <i className="bi bi-patch-check-fill h6 me-1" />
                    Get certificate
                  </li>
                  <li className="list-inline-item">
                    {" "}
                    <i className="bi bi-patch-check-fill h6 me-1" />
                    Get membership
                  </li>
                </ul>
                <div className="d-sm-flex align-items-center justify-content-center justify-content-lg-start">
                  {/* Button */}
                  <a
                    href="#"
                    className="btn btn-lg btn-danger-soft me-2 mb-4 mb-sm-0"
                  >
                    Get Started
                  </a>
                  {/* Video button */}
                  <a
                    data-glightbox
                    data-gallery="office-tour"
                    href="https://www.youtube.com/embed/tXHviS-4ygo"
                    className="ms-0 ms-sm-4 d-block"
                  >
                    <div className="btn btn-round btn-primary-shadow mb-0 me-3 align-middle d-inline-block">
                      {" "}
                      <i className="fas fa-play" />
                    </div>
                    <div className="align-middle d-inline-block">
                      <h6 className="mb-0 fw-normal">Watch video</h6>
                    </div>
                  </a>
                </div>
              </div>
              {/* Left content END */}
              {/* Right content START */}
              <div className="col-lg-8 col-xl-7 text-center position-relative">
                {/* Congratulations message */}
                <div className="p-3 bg-blur border border-light shadow rounded-4 position-absolute bottom-0 start-0 z-index-9 d-none d-xl-block mb-5 ms-5">
                  <div className="d-flex justify-content-between align-items-center">
                    {/* Icon */}
                    <span className="icon-lg bg-warning rounded-circle">
                      <i className="fas fa-envelope text-white" />
                    </span>
                    {/* Info */}
                    <div className="text-start ms-3">
                      <h6 className="mb-0 text-white">
                        Congratulations{" "}
                        <span className="ms-4">
                          <i className="fas fa-check-circle text-success" />
                        </span>
                      </h6>
                      <p className="mb-0 small text-white">You are welcome</p>
                    </div>
                  </div>
                </div>

                {/* Active student 
                <div
                  className="p-3 bg-warning d-inline-block rounded-4 shadow-lg position-absolute top-50 end-0 translate-middle-y mt-n7 z-index-9 d-none d-md-block"
                  style={{
                    background:
                      "url(assets/images/pattern/01.png) no-repeat center center",
                    backgroundSize: "cover",
                  }}
                >
                  <p className="text-white">Our daily new students</p>
                  {/* Avatar group 
                  <ul className="avatar-group mb-0">
                   
                    <li className="avatar avatar-sm">
                      <div className="avatar-img rounded-circle border-white bg-primary">
                        <span className="text-white position-absolute top-50 start-50 translate-middle small">
                          1K+
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
*/}
                {/* Image */}
                <div
                  className="position-relative"
                  style={{
                    width: "100%",
                    height: "440px",
                    position: "relative",
                  }}
                >
                  {images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Slider Image ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", // Ensure the image covers the container
                        borderRadius: "20px",
                        position: "absolute",
                        top: "0",
                        left: "0",
                        zIndex: index === currentImage ? 1 : 0, // Ensure the current image is above others
                        opacity: index === currentImage ? 1 : 0, // Show only the current image
                        transition: "opacity 1s ease-in-out", // Add transition for smooth opacity change
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Right content END */}
            </div>
          </div>
          {/* Content END */}
        </section>
        {/* =======================
Main Banner END */}

        {/* =======================
      Counter START */}
        <section className="py-0 pt-xl-6">
          <div className="container">
            <div className="row g-4">
              {/* Counter item */}
              <div className="col-sm-6 col-xl-3">
                <div className="d-flex justify-content-center align-items-center p-4 bg-warning bg-opacity-15 rounded-3">
                  <span className="display-6 lh-1 text-warning mb-0">
                    <i className="fas fa-tv"></i>
                  </span>
                  <div className="ms-4 h6 fw-normal mb-0">
                    <div className="d-flex">
                      <h5
                        className="purecounter mb-0 fw-bold"
                        data-purecounter-start="0"
                        data-purecounter-end="10"
                        data-purecounter-delay="200"
                      >
                        0
                      </h5>
                      <span className="mb-0 h5">K</span>
                    </div>
                    <p className="mb-0">Online Courses</p>
                  </div>
                </div>
              </div>
              {/* Counter item */}
              <div className="col-sm-6 col-xl-3">
                <div className="d-flex justify-content-center align-items-center p-4 bg-blue bg-opacity-10 rounded-3">
                  <span className="display-6 lh-1 text-blue mb-0">
                    <i className="fas fa-user-tie"></i>
                  </span>
                  <div className="ms-4 h6 fw-normal mb-0">
                    <div className="d-flex">
                      <h5
                        className="purecounter mb-0 fw-bold"
                        data-purecounter-start="0"
                        data-purecounter-end="200"
                        data-purecounter-delay="200"
                      >
                        0
                      </h5>
                      <span className="mb-0 h5">+</span>
                    </div>
                    <p className="mb-0">Expert Tutors</p>
                  </div>
                </div>
              </div>
              {/* Counter item */}
              <div className="col-sm-6 col-xl-3">
                <div className="d-flex justify-content-center align-items-center p-4 bg-purple bg-opacity-10 rounded-3">
                  <span className="display-6 lh-1 text-purple mb-0">
                    <i className="fas fa-user-graduate"></i>
                  </span>
                  <div className="ms-4 h6 fw-normal mb-0">
                    <div className="d-flex">
                      <h5
                        className="purecounter mb-0 fw-bold"
                        data-purecounter-start="0"
                        data-purecounter-end="60"
                        data-purecounter-delay="200"
                      >
                        0
                      </h5>
                      <span className="mb-0 h5">K+</span>
                    </div>
                    <p className="mb-0">Online Students</p>
                  </div>
                </div>
              </div>
              {/* Counter item */}
              <div className="col-sm-6 col-xl-3">
                <div className="d-flex justify-content-center align-items-center p-4 bg-info bg-opacity-10 rounded-3">
                  <span className="display-6 lh-1 text-info mb-0">
                    <i className="bi bi-patch-check-fill"></i>
                  </span>
                  <div className="ms-4 h6 fw-normal mb-0">
                    <div className="d-flex">
                      <h5
                        className="purecounter mb-0 fw-bold"
                        data-purecounter-start="0"
                        data-purecounter-end="6"
                        data-purecounter-delay="300"
                      >
                        0
                      </h5>
                      <span className="mb-0 h5">K+</span>
                    </div>
                    <p className="mb-0">Certified Courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* =======================
      Counter END */}

        {/* =======================

      Popular course START */}


        
        <section className="pb-5 pt-0 pt-lg-5">

          <div className="container">
            {/* Title */}
            <div className="row mb-4">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="fs-1">Most Popular Courses</h2>
                <p className="mb-0">
                  Choose from hundreds of courses from specialist organizations
                </p>
              </div>
            </div>
            {/* Tabs START */}
            <ul
              className="nav nav-pills nav-pills-bg-soft justify-content-sm-center mb-4 px-3"
              id="course-pills-tab"
              role="tablist"
            >
              {/* Map over categories to render each tab */}
              {coursesByCategories.map((category, index) => (
                <li className="nav-item me-2 me-sm-5" key={category._id}>
                  <button
                    className={`nav-link mb-2 mb-md-0 ${
                      index === 0 ? "active" : ""
                    }`}
                    id={`course-pills-tab-${index}`}
                    data-bs-toggle="pill"
                    data-bs-target={`#course-pills-tabs-${index}`}
                    type="button"
                    role="tab"
                    aria-controls={`course-pills-tabs-${index}`}
                    aria-selected={index === 0}
                  >
                    {category.categoryName[0]}
                  </button>
                </li>
              ))}
            </ul>
            {/* Tabs END */}

            {/* Tabs content START */}
            <div className="tab-content" id="course-pills-tabContent">
              {/* Map over categories to render courses under each tab */}
              {coursesByCategories.map((category, index) => (
                <div
                  className={`tab-pane fade ${
                    index === 0 ? "show active" : ""
                  }`}
                  id={`course-pills-tabs-${index}`}
                  role="tabpanel"
                  aria-labelledby={`course-pills-tab-${index}`}
                  key={index}
                >
                  <div className="row g-4">
                    {/* Map over courses within the category */}
                    {category.courses.map((course, courseIndex) => (
                      <div
                        className="col-sm-6 col-lg-4 col-xl-3"
                        key={course._id}
                      >
                        <div className="card shadow h-100">
                          {/* Image */}
                          <img
                            src={`http://localhost:3001/assets/${course.picturePath}`}
                            className="card-img-top"
                            alt="course image"
                            style={{ height: "230px" }} // Set fixed dimensions here
                          />
                          {/* Card body */}
                          <div className="card-body pb-0">
                            {/* Badge and favorite */}
                            <div className="d-flex justify-content-between mb-2">
                              {/* Render badge based on course level */}
                              {course.courseLevel === "Beginner" && (
                                <a
                                  href="#"
                                  className="badge bg-info bg-opacity-10 text-info"
                                >
                                  {course.courseLevel}
                                </a>
                              )}
                              {course.courseLevel === "All level" && (
                                <a
                                  href="#"
                                  className="badge bg-info bg-opacity-10 text-info"
                                >
                                  {course.courseLevel}
                                </a>
                              )}
                              {course.courseLevel === "Intermediate" && (
                                <a
                                  href="#"
                                  className="badge bg-warning bg-opacity-10 text-warning"
                                >
                                  {course.courseLevel}
                                </a>
                              )}
                              {course.courseLevel === "Advance" && (
                                <a
                                  href="#"
                                  className="badge bg-danger bg-opacity-10 text-danger"
                                >
                                  {course.courseLevel}
                                </a>
                              )}
                              {/* Favorite icon */}
                              <a href="#" className="h6 mb-0">
                                <i className="far fa-heart" />
                              </a>
                            </div>

                            {/* Title */}
                            <h5 className="card-title fw-normal">
                              <a href="#">{course.title}</a>
                            </h5>
                            <p className="mb-2 text-truncate-2">
                              {course.description}
                            </p>
                            {/* You can render other course details here */}
                          </div>
                          
                        </div>
                      </div>
                    ))}
                  </div>{" "}
                  {/* Row END */}
                </div>
              ))}
            </div>
            {/* Tabs content END */}
        {/* Button */}
<div className="text-center mt-5">
  <a href="#" className="btn btn-primary-soft">View more<i className="fas fa-sync ms-2" /></a>
</div>

          </div>
        </section>
        {/* =======================
      Popular course END */}

        {/* =======================
Course START */}
        <section className="bg-light py-5 position-relative overflow-hidden">
          {/* SVG decoration */}
          <figure className="position-absolute top-0 start-0">
            <svg width="818.6px" height="235.1px">
              <path
                className="fill-orange opacity-5"
                d="M735,226.3c-5.7,0.6-11.5,1.1-17.2,1.7c-66.2,6.8-134.7,13.7-192.6-16.6c-34.6-18.1-61.4-47.9-87.3-76.7 c-21.4-23.8-43.6-48.5-70.2-66.7c-53.2-36.4-121.6-44.8-175.1-48c-13.6-0.8-27.5-1.4-40.9-1.9c-46.9-1.9-95.4-3.9-141.2-16.5 C8.3,1.2,6.2,0.6,4.2,0H0c3.3,1,6.6,2,10,3c46,12.5,94.5,14.6,141.5,16.5c13.4,0.6,27.3,1.1,40.8,1.9 c53.4,3.2,121.5,11.5,174.5,47.7c26.5,18.1,48.6,42.7,70,66.5c26,28.9,52.9,58.8,87.7,76.9c58.3,30.5,127,23.5,193.3,16.7 c5.8-0.6,11.5-1.2,17.2-1.7c26.2-2.6,55-4.2,83.5-2.2v-1.2C790,222,761.2,223.7,735,226.3z"
              />
            </svg>
          </figure>
          {/* SVG decoration */}
          <figure className="position-absolute bottom-0 start-0 mb-3">
            <svg
              enableBackground="new 0 0 223 134"
              xmlSpace="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="fill-success"
                d="m216.6 78.7c-1.8-0.3-4.1 0.1-5.9 0.3-2.4 0.2-4.8 0.7-7.1 0.9-1.6 0.1-3.1 0.2-4.6 0.3-1.8 0.1-3.7 0.1-5.6 0.1-1.3-0.1-2.6-0.1-3.9-0.1-2.5 0-4.9-0.3-7.3-0.4-2.3-0.1-4.5 0.5-6.8 0.5-4 0.1-8.6-0.3-12.2 1.6-0.2 0.1-0.2 0.5-0.1 0.6 0.6 1.1 2.6 1.6 3.7 2 0.3 0.1 0.7 0.3 1 0.3 0.9 0.6 1.8 1.2 2.8 1.8 0.7 0.5 1.5 0.8 2.2 1.2 0.1 0.1 0.3 0.2 0.4 0.3 0.3 0.2 1 0.4 1.2 0.7 0.3 0.5 0 1.6-0.1 2.1-0.3 1.3-0.6 2.5-0.8 3.8-0.3 2.1-1 4.1-1.5 6-0.1 0.1-0.3 0.3-0.4 0.5-0.3 0.4 0.1 0.8 0.5 0.7v0.2c0 0.2 0.4 0.1 0.5 0 0.2-0.1 0.3-0.3 0.5-0.4s0.3-0.2 0.5-0.3c2-0.8 4-1.5 5.8-2.6 0.7 1.4 1.4 2.9 2 4.3 0.5 1.1 1.4 3.1 2.9 3.2 1.8 0.1 3.8-2.6 5.1-3.7 2.1-1.6 4.4-3.1 6.5-4.7 3.9-2.8 7.7-5.7 11.4-8.8 0.9-0.8 1.4-1.8 2.3-2.6 1-1 2.2-1.6 3.3-2.4 0.9-0.7 1.5-1.5 2.2-2.3 0.7-0.7 1.6-1.5 2.1-2.5-0.2-0.3-0.3-0.6-0.6-0.6zm-46.5 7 0.6 0.3 0.9 0.6c-0.6-0.3-1.1-0.6-1.5-0.9zm2.4 0.6c-0.7-0.7-1.2-1-2.1-1.4-1.2-0.5-2.6-1-3.8-1.4h-0.1c-0.3-0.2-0.7-0.4-1-0.5-0.5-0.3-1.5-0.4-0.9-0.9 0.2-0.1 0.7-0.1 0.9-0.2 1.2-0.3 2.4-0.5 3.7-0.7 2.6-0.1 5.2 0.1 7.5-0.1 1.2-0.1 2.3-0.2 3.5-0.3h1.9 0.1c0.7 0 1.4 0.1 2.2 0.1 1.9 0.2 3.8 0.1 5.7 0.2 4.3 0.1 8.4 0.1 12.7-0.3 2.1-0.2 4.2-0.5 6.3-0.7 1.2-0.1 2.3-0.2 3.5-0.2-0.5 0.1-1 0.3-1.5 0.3-1.8 0.3-3.5 0.6-5.2 0.9-3.4 0.4-6.8 0.9-10.1 1.6-3.4 0.7-6.8 1.5-10.3 2.2-3.7 0.7-7 2.4-10.7 3.3-0.1-0.1-0.2-0.1-0.3-0.1-0.6-0.9-1.2-1.1-2-1.8zm1.5 9.8c0.1-0.5 0.3-0.9 0.4-1.3 0.3-1.1 0.4-2.3 0.6-3.5 0.1-0.8 0.4-1.6 0.4-2.5 0 0 0-0.1 0.1-0.1 0.3-0.2 1.8-0.3 2-0.3 1.4-0.4 2.9-1 4.3-1.5 1.2-0.5 2.5-0.9 3.8-1.2 3.3-0.7 6.5-1.3 9.8-2.2 3.5-0.9 7.1-1.2 10.7-1.7 1.6-0.2 3.3-0.5 4.9-0.8 1-0.2 2-0.5 3.1-0.7-0.6 0.3-1.2 0.7-1.9 1-1.2 0.5-2.4 0.8-3.6 1.2-2.5 1.1-4.8 2.5-7.1 3.8-1 0.4-2 0.8-3.1 1.2-2.2 0.9-4.3 1.8-6.4 2.7-1.5 0.6-3.1 1.1-4.6 1.8-1.1 0.5-2.2 1-3.3 1.5-0.2 0.1-0.5 0.2-0.7 0.3-0.5 0.2-1 0.4-1.4 0.5-1.1 0.3-2.4 0.6-3.3 1.1-0.1-0.1-0.3-0.1-0.4 0.1-1.3 0.9-2.6 2-3.8 2.9-0.3 0.3-0.7 0.5-1 0.8 0.1-0.8 0.3-1.9 0.5-3.1zm4.7 1.9c-1.4 0.8-3.1 1.4-4.6 2 0.1-0.2 0.3-0.3 0.3-0.4 0.3-0.2 0.5-0.3 0.7-0.5 1-0.9 2.1-1.8 3.2-2.6 0.2 0.5 0.4 0.9 0.6 1.4-0.1 0.1-0.2 0.1-0.2 0.1zm34.9-16.3c-0.5 0.4-0.9 0.9-1.3 1.2l-0.4 0.4c-0.2 0.1-0.3 0.3-0.5 0.4-1 0.7-2 1.4-2.9 2.2-0.5 0.5-0.9 1-1.2 1.5-1 0.9-1.9 1.8-2.9 2.6-0.8 0.6-1.6 1.2-2.3 1.8-1.6 1.4-3.4 2.7-5.2 4-3.3 2.4-6.7 4.6-9.8 7.3-0.7 0.5-1.2 1-1.9 1.6-0.7 0.4-1.3 0.5-2-0.1-0.2-0.3-0.3-0.7-0.4-0.9-0.5-1-1-2-1.4-3-0.7-1.6-1.2-3.3-2.3-4.6 1.4-0.8 3.4-1 4.8-1.6s2.8-1.5 4.3-2l9.6-3.6c2.9-1.2 5.4-2.7 8.2-4.1 0.1-0.1 0.3-0.1 0.4-0.1 1.7-0.7 3.3-1.6 5-2.3 0.7-0.3 1.4-0.5 2.1-0.8 0.1-0.1 0.3-0.2 0.5-0.3l-0.4 0.4z"
              />
              <path
                className="fill-success"
                d="m89.1 0c-0.5 0-1 0.1-1.4 0.3-0.3 0.1-0.5 0.3-0.8 0.3-0.3 0.1-0.6 0-0.9 0.1-0.1 0-0.3 0.2-0.3 0.3v0.2c-0.1 0.5 0.7 0.8 0.9 0.3 0.4-0.1 0.7 0 1.1-0.2 0.5-0.3 0.9-0.4 1.4-0.4 0.6 0 0.6-0.9 0-0.9z"
              />
              <path
                className="fill-success"
                d="m77.1 0.9c-0.7 0-1.4-0.1-2.2-0.1-0.6 0-1.4 0-1.8 0.5s0.3 1.1 0.7 0.7c0.3-0.3 1.2-0.2 1.6-0.2 0.5 0 1.1 0.1 1.6 0.1 0.7-0.1 0.7-1 0.1-1z"
              />
              <path
                className="fill-success"
                d="m65.5 1.5h-2.9c-0.6 0-0.6 0.9 0 0.9h2.9c0.6 0 0.6-0.9 0-0.9z"
              />
              <path
                className="fill-success"
                d="m55.7 2.1c-0.9-0.3-2.7-0.7-3.1 0.5-0.1 0.6 0.7 0.8 0.9 0.3 0.1-0.4 1.7 0 2 0.1 0.5 0.2 0.7-0.6 0.2-0.9z"
              />
              <path
                className="fill-success"
                d="m46.1 2.7c-0.7 0-1.3-0.1-2 0s-1.2 0.4-1.8 0.4-0.6 0.9 0 0.9 1.1-0.2 1.6-0.3c0.7-0.2 1.4-0.1 2.2-0.1 0.6 0.1 0.6-0.9 0-0.9z"
              />
              <path
                className="fill-success"
                d="m35 4.5c-1 0.4-2.3 0.6-3.1 1.4-0.5 0.4 0.2 1 0.7 0.7 0.7-0.7 1.8-0.9 2.7-1.2 0.5-0.3 0.3-1.1-0.3-0.9z"
              />
              <path
                className="fill-success"
                d="m24 9c-0.6 0.5-1.6 0.6-1.8 1.4-0.1 0.6 0.7 0.8 0.9 0.3 0.1-0.3 0.5-0.4 0.7-0.5 0.3-0.2 0.7-0.3 0.9-0.5 0.4-0.4-0.3-1.1-0.7-0.7z"
              />
              <path
                className="fill-success"
                d="m15.7 15c-0.3 0.5-0.5 0.9-0.7 1.4-0.2 0.6-0.5 1.1-0.7 1.7-0.1 0.6 0.8 0.9 0.9 0.3 0.1-0.5 0.4-1 0.6-1.5s0.3-0.9 0.7-1.4-0.4-1-0.8-0.5z"
              />
              <path
                className="fill-success"
                d="m10.6 23.6c-0.3-0.1-0.5 0.1-0.6 0.3-0.3 0.7-0.5 1.3-0.5 2 0 0.6 0.9 0.6 0.9 0 0-0.7 0.1-1.2 0.4-1.8 0.2-0.1 0-0.4-0.2-0.5z"
              />
              <path
                className="fill-success"
                d="m6.4 36.1v2.6c0 0.6 0.9 0.6 0.9 0v-2.6c0-0.6-0.9-0.6-0.9 0z"
              />
              <path
                className="fill-success"
                d="m7.1 45.8c-0.1-0.3 0-0.7 0-1 0-0.6-0.9-0.6-0.9 0 0 0.3-0.1 0.7 0 1 0.1 0.4 0.3 0.7 0.2 1-0.1 0.6 0.9 0.6 0.9 0 0.1-0.3-0.1-0.6-0.2-1z"
              />
              <path
                className="fill-success"
                d="m8.7 57.4c-0.4-0.7-0.6-1.6-1.1-2.2-0.4-0.5-1 0.2-0.7 0.7 0.5 0.6 0.7 1.4 1 2 0.2 0.5 1.1 0 0.8-0.5z"
              />
              <path
                className="fill-success"
                d="m13.3 63.9c-0.8-0.8-1.4-1.6-2.4-2.2-0.5-0.3-1 0.5-0.5 0.8 0.9 0.5 1.5 1.3 2.2 2 0.5 0.4 1.1-0.2 0.7-0.6z"
              />
              <path
                className="fill-success"
                d="m20.9 69.2c-0.5-0.1-1-0.4-1.5-0.7-0.5-0.2-0.9-0.5-1.2-0.9-0.4-0.4-1 0.3-0.7 0.7 0.4 0.4 0.9 0.8 1.4 1 0.6 0.3 1.1 0.7 1.8 0.7 0.5 0.2 0.7-0.7 0.2-0.8z"
              />
              <path
                className="fill-success"
                d="m31.1 72c-0.2 0-0.3-0.1-0.5-0.1-0.2-0.1-0.4 0-0.6-0.1-0.5-0.1-1-0.3-1.3-0.5-0.5-0.4-1.1 0.3-0.7 0.7 0.5 0.4 1 0.6 1.5 0.7 0.3 0.1 0.5 0 0.8 0.1s0.5 0.2 0.8 0.2c0.6-0.2 0.6-1.1 0-1z"
              />
              <path
                className="fill-success"
                d="m36.2 74.5c-0.1 0-0.3-0.2-0.3-0.3-0.1-0.1-0.3-0.3-0.4-0.5-0.4-0.4-1 0.2-0.7 0.7 0.4 0.4 0.7 0.9 1.4 1 0.3 0 0.5-0.2 0.5-0.5-0.1-0.2-0.3-0.4-0.5-0.4z"
              />
              <path
                className="fill-success"
                d="m46.7 80.6c-0.3 0-0.7-0.5-0.9-0.7-0.4-0.3-0.9-0.4-1.3-0.7-0.5-0.4-1.1 0.3-0.7 0.7 0.5 0.4 1.1 0.5 1.6 0.9 0.4 0.3 0.7 0.7 1.2 0.7 0.7 0.1 0.7-0.8 0.1-0.9z"
              />
              <path
                className="fill-success"
                d="m54.3 86.1c-0.4-0.4-0.7-0.8-1-1.2-0.3-0.5-1.2 0-0.8 0.5 0.3 0.4 0.5 0.8 0.9 1.1 0.2 0.2 0.7 0.5 0.7 0.7 0.1 0.6 1 0.6 0.9 0-0.1-0.5-0.3-0.8-0.7-1.1z"
              />
              <path
                className="fill-success"
                d="m60.3 93.1c0.1 0 0-0.1-0.1-0.1-0.1-0.1-0.1-0.1-0.1-0.2-0.1-0.2-0.3-0.3-0.5-0.5-0.3-0.3-0.7-0.7-0.7-1.2-0.1-0.6-1-0.3-0.9 0.3s0.5 1.1 0.9 1.5c0.2 0.2 0.4 0.4 0.5 0.7s0.3 0.4 0.6 0.5c0.6 0 0.9-0.8 0.3-1z"
              />
              <path
                className="fill-success"
                d="m64.9 100.9v-0.9c0-0.6-0.9-0.6-0.9 0 0 0.5-0.1 0.9 0.1 1.4 0.1 0.1 0.1 0.3 0.3 0.3h0.2c0.3 0.1 0.5-0.1 0.6-0.3 0-0.2-0.2-0.4-0.3-0.5z"
              />
              <path
                className="fill-success"
                d="m66.5 110.5c-0.5-0.4 0.1-1.7 0.1-2.2 0.1-0.6-0.9-0.6-0.9 0-0.1 0.9-0.7 2.2 0.1 2.9 0.5 0.3 1.1-0.3 0.7-0.7z"
              />
              <path
                className="fill-success"
                d="m64.2 116.7c-0.4 0.7-0.8 1.2-0.9 2-0.1 0.6 0.8 0.9 0.9 0.3 0.1-0.7 0.5-1.2 0.8-1.8 0.3-0.5-0.4-1-0.8-0.5z"
              />
              <path
                className="fill-success"
                d="m59.6 126.6c-0.1-0.3-0.4-0.3-0.7-0.2s-0.6 0.3-0.9 0.4-0.4 0.3-0.3 0.6 0.3 0.3 0.6 0.3c0.4-0.1 0.8-0.3 1.2-0.5 0.2 0 0.2-0.4 0.1-0.6z"
              />
              <path
                className="fill-success"
                d="m48.5 127.2c-0.8 0.1-1.6 0.2-2.3 0.2-0.6 0-0.6 0.9 0 0.9 0.8 0 1.6-0.1 2.3-0.2 0.6-0.1 0.6-1 0-0.9z"
              />
              <path
                className="fill-success"
                d="m40.9 126.6c-0.3-0.3-0.5-0.5-0.8-0.7-0.1-0.1-0.3-0.1-0.5-0.2s-0.3-0.1-0.4-0.1c-0.4-0.5-1 0.2-0.7 0.7 0.3 0.3 0.6 0.3 0.9 0.4s0.6 0.4 0.8 0.7c0.4 0.3 1.1-0.3 0.7-0.8z"
              />
              <path
                className="fill-success"
                d="m38.9 127.3c-0.3-0.5-0.7-0.9-1.1-1.4-0.4-0.4-1 0.2-0.7 0.7 0.4 0.4 0.7 0.7 1 1.2s1.1 0 0.8-0.5z"
              />
              <path
                className="fill-success"
                d="m33.7 119.8c-0.1-0.1-0.3-0.3-0.3-0.5 0-0.6-0.9-0.6-0.9 0 0 0.5 0.3 0.9 0.6 1.2 0.4 0.3 1.1-0.3 0.6-0.7z"
              />
              <path
                className="fill-success"
                d="m34.2 110c0 0.1-0.3 0.3-0.3 0.3-0.1 0.1-0.3 0.3-0.4 0.5-0.2 0.4-0.3 0.8-0.3 1.2-0.1 0.6 0.9 0.6 0.9 0 0.1-0.5 0.2-0.9 0.5-1.2s0.5-0.5 0.5-1c0.1-0.4-0.8-0.4-0.9 0.2z"
              />
              <path
                className="fill-success"
                d="m40.8 103.2c-0.5 0.1-0.9 0.5-1.3 0.7-0.5 0.3-0.8 0.7-1 1.2-0.3 0.5 0.5 1 0.8 0.5 0.2-0.4 0.5-0.7 0.8-0.9 0.4-0.3 0.8-0.6 1.2-0.7 0.1 0 0.3-0.2 0.3-0.3s0-0.1 0.1-0.2c0.1-0.5-0.7-0.8-0.9-0.3z"
              />
              <path
                className="fill-success"
                d="m49.4 100.3c-0.7-0.1-1.4 0.1-2 0.3-0.6 0.1-1 0.3-1.4 0.7-0.4 0.5 0.3 1.1 0.7 0.7s0.8-0.5 1.3-0.5c0.5-0.1 1-0.2 1.6-0.2 0.4-0.1 0.4-1-0.2-1z"
              />
              <path
                className="fill-success"
                d="m57 100.4c-0.8-0.6-1.7-0.7-2.6-0.8-0.6 0-0.6 0.9 0 0.9 0.7 0 1.4 0.1 2 0.5 0.4 0.4 1-0.3 0.6-0.6z"
              />
              <path
                className="fill-success"
                d="m66.5 103.9c-1.1-0.3-2.1-0.9-3.3-0.9-0.6 0.1-0.6 1 0 0.9 1.1-0.1 2 0.6 3 0.9 0.6 0 0.8-0.8 0.3-0.9z"
              />
              <path
                className="fill-success"
                d="m79.7 109.4c-0.6-0.7-1.1-1.4-1.8-2-0.8-0.6-1.6-0.9-2.5-1.3-0.5-0.3-1 0.5-0.5 0.8 0.8 0.4 1.6 0.7 2.3 1.1 0.7 0.5 1.2 1.3 1.8 2 0.5 0.5 1.1-0.1 0.7-0.6z"
              />
              <path
                className="fill-success"
                d="m87 114.4c-0.6-0.1-1.2-0.7-1.6-1.1s-1 0.2-0.7 0.7c0.6 0.6 1.3 1.3 2.2 1.4 0.7 0 0.7-1 0.1-1z"
              />
              <path
                className="fill-success"
                d="m97.7 120.6c-0.8-0.8-1.6-1.4-2.6-1.8-0.9-0.4-1.6-0.9-2.6-0.9-0.6 0-0.6 0.9 0 0.9 1.6 0 3.5 1.4 4.5 2.4 0.5 0.5 1.1-0.1 0.7-0.6z"
              />
              <path
                className="fill-success"
                d="m108.9 123.7c-0.5 0-1-0.3-1.5-0.4-0.4-0.1-1 0.1-1.4-0.1-0.5-0.4-1 0.3-0.7 0.7 0.5 0.5 1 0.4 1.6 0.4 0.7 0 1.2 0.5 1.9 0.4 0.7-0.2 0.8-1.1 0.1-1z"
              />
              <path
                className="fill-success"
                d="m118.2 126c-0.5 0-1 0.1-1.5 0s-0.9-0.3-1.3-0.4c-0.5-0.2-0.8 0.7-0.3 0.9 1 0.4 2 0.5 3.1 0.5 0.6-0.1 0.6-1 0-1z"
              />
              <path
                className="fill-success"
                d="m125.5 124c-0.5 0.5-1 0.8-1.7 0.9-0.6 0.1-0.3 1 0.3 0.9 0.8-0.2 1.5-0.6 2.1-1.2 0.4-0.4-0.3-1-0.7-0.6z"
              />
              <path
                className="fill-success"
                d="m128.7 117c-0.5 0.5-0.4 1.2-0.4 1.8-0.1 0.8-0.6 1.4-0.6 2.3 0 0.6 0.9 0.6 0.9 0 0-0.7 0.4-1.2 0.5-1.8 0.1-0.5-0.1-1.3 0.2-1.6 0.4-0.4-0.2-1.1-0.6-0.7z"
              />
              <path
                className="fill-success"
                d="m130.1 112c-0.3-0.5-0.1-1.2-0.3-1.8-0.1-0.3-0.1-0.7-0.3-0.9-0.1-0.3-0.3-0.6-0.4-1-0.1-0.6-1-0.3-0.9 0.3 0.1 0.3 0.3 0.6 0.4 0.9 0.1 0.4 0.3 0.8 0.3 1.2 0.2 0.7 0.1 1.2 0.4 1.8 0.2 0.6 1 0.1 0.8-0.5z"
              />
              <path
                className="fill-success"
                d="m127.7 104.9c-0.2-0.5-0.4-1.1-0.3-1.6 0.1-0.6-0.9-0.6-0.9 0-0.1 0.7 0.2 1.5 0.5 2.2 0.2 0.4 1-0.1 0.7-0.6z"
              />
              <path
                className="fill-success"
                d="m131 96.8c-0.3 0.3-0.7 0.3-0.9 0.5-0.4 0.2-0.7 0.5-1 0.9-0.4 0.4 0.3 1 0.7 0.7 0.3-0.3 0.6-0.6 0.9-0.8 0.3-0.1 0.7-0.3 1-0.5 0.4-0.5-0.3-1.2-0.7-0.8z"
              />
              <path
                className="fill-success"
                d="m136.4 96c-0.6 0-0.6 0.9 0 0.9 0.5 0 0.9-0.1 1.4-0.1 0.3 0 0.6 0 0.9 0.1 0.1 0 0.2 0.1 0.3 0.1h0.1c0.1 0.5 0.9 0.5 0.9-0.1-0.1-1.4-2.9-0.9-3.6-0.9z"
              />
              <path
                className="fill-success"
                d="m144.9 99.2c-0.5-0.3-1 0.5-0.5 0.8 0.7 0.5 2.5 1.1 2.3 2.2-0.1 0.6 0.8 0.9 0.9 0.3 0.3-1.7-1.6-2.5-2.7-3.3z"
              />
              <path
                className="fill-success"
                d="m156.6 106c-1.5-0.1-2.9-0.5-4.3-1-0.5-0.2-0.8 0.7-0.3 0.9 1.4 0.5 2.9 1 4.6 1 0.6 0 0.6-0.9 0-0.9z"
              />
              <path
                className="fill-success"
                d="m163 104.9c-0.4 0-0.7-0.1-1.1 0-0.3 0.1-0.7 0.3-1 0.2-0.6-0.1-0.6 0.9 0 0.9 0.3 0 0.7-0.1 1-0.2 0.4-0.1 0.8 0 1.1 0 0.6 0 0.6-0.9 0-0.9z"
              />
              <path
                className="fill-success"
                d="m168.1 103.9c0.5-0.1 0.5-0.9-0.1-0.9-0.5 0-0.9 0.4-1.2 0.7-0.1 0.2-0.3 0.4-0.3 0.7s0.3 0.5 0.5 0.6c0.3 0.1 0.5-0.1 0.6-0.3 0-0.1 0-0.3-0.1-0.4l0.2-0.2c0.1-0.1 0.1-0.1 0.2-0.1 0.1-0.1 0.1-0.1 0.2-0.1z"
              />
            </svg>
          </figure>
          {/* SVG image decoration */}
          <div className="position-absolute bottom-0 end-0 d-none d-lg-block">
            <img src="assets/images/element/rocket.svg" alt />
          </div>
          {/* Content END */}
          <div className="container position-relative ">
            {/* Title */}
            <div className="row mb-4">
              <div className="col-12">
                <h6 className="mb-3 ">
                  <i className="bi bi-pin-map-fill me-2" />
                  Elkindy Conservatory, TUNISIA
                </h6>
                <h2 className="fw-bold" style={{ fontSize: "4rem" }}>
                  <span className="position-relative z-index-9">
                    Learning{"  "}
                  </span>
                  <span className="position-relative z-index-1">
                    path
                    {/* SVG START */}
                    <span className="position-absolute top-50 start-50 translate-middle z-index-n1">
                      <svg width="163.9px" height="48.6px">
                        <path
                          className="fill-warning"
                          d="M162.5,19.9c-0.1-0.4-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-0.5-0.4-0.7c-0.3-0.4-0.7-0.7-1.2-0.9l0.1,0l-0.1,0 c0.1-0.4-0.2-0.5-0.5-0.6c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.2-0.3-0.3c0-0.3,0-0.6-0.2-0.7c-0.1-0.1-0.3-0.2-0.6-0.2 c0-0.3-0.1-0.5-0.3-0.6c-0.1-0.1-0.3-0.2-0.5-0.2c-0.1,0-0.1,0-0.2,0c-0.5-0.4-1-0.8-1.4-1.1c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.3-0.2 c-0.9-0.5-1.8-1-2.6-1.5c-6-3.6-13.2-4.3-19.8-6.2c-4.1-1.2-8.4-1.4-12.6-2c-5.6-0.8-11.3-0.6-16.9-1.1c-2.3-0.2-4.6-0.3-6.8-0.3 c-1.2,0-2.4-0.2-3.5-0.1c-2.4,0.4-4.9,0.6-7.4,0.7c-0.8,0-1.7,0.1-2.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0 c-0.9,0-1.8,0.1-2.7,0.1c-0.9,0-1.8,0-2.7,0c-5.5-0.3-10.7,0.7-16,1.5c-2.5,0.4-5.1,1-7.6,1.5c-2.8,0.6-5.6,0.7-8.4,1.4 c-4.1,1-8.2,1.9-12.3,2.6c-4,0.7-8,1.6-11.9,2.7c-3.6,1-6.9,2.5-10.1,4.1c-1.9,0.9-3.8,1.7-5.2,3.2c-1.7,1.8-2.8,4-4.2,6 c-1,1.3-0.7,2.5,0.2,3.9c2,3.1,5.5,4.4,9,5.7c1.8,0.7,3.6,1,5.3,1.8c2.3,1.1,4.6,2.3,7.1,3.2c5.2,2,10.6,3.4,16.2,4.4 c3,0.6,6.2,0.9,9.2,1.1c4.8,0.3,9.5,1.1,14.3,0.8c0.3,0.3,0.6,0.3,0.9-0.1c0.7-0.3,1.4,0.1,2.1-0.1c3.7-0.6,7.6-0.3,11.3-0.3 c2.1,0,4.3,0.3,6.4,0.2c4-0.2,8-0.4,11.9-0.8c5.4-0.5,10.9-1,16.2-2.2c0.1,0.2,0.2,0.1,0.2,0c0.5-0.1,1-0.2,1.4-0.3 c0.1,0.1,0.2,0.1,0.3,0c0.5-0.1,1-0.3,1.6-0.3c3.3-0.3,6.7-0.6,10-1c2.1-0.3,4.1-0.8,6.2-1.2c0.2,0.1,0.3,0.1,0.4,0.1 c0.1,0,0.1,0,0.2-0.1c0,0,0.1,0,0.1-0.1c0,0,0-0.1,0.1-0.1c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0.1,0,0.2-0.1,0.3-0.2 c0,0,0,0,0,0l0,0c0,0,0,0,0,0c0.2,0,0.4-0.1,0.5-0.1c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.3-0.3c0.5-0.2,0.9-0.4,1.4-0.5 c0.1,0,0.2,0,0.2,0c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1,0c0,0,0.1,0,0.1,0c0.2,0.1,0.4,0.1,0.6,0 c0.1,0,0.1-0.1,0.2-0.2c0.1-0.1,0.1-0.2,0.1-0.3c0.5-0.2,1-0.4,1.6-0.7c1.5-0.7,3.1-1.4,4.7-1.9c4.8-1.5,9.1-3.4,12.8-6.3 c0.8-0.2,1.2-0.5,1.6-1c0.2-0.3,0.4-0.6,0.5-0.9c0.5-0.1,0.7-0.2,0.9-0.5c0.2-0.2,0.2-0.5,0.3-0.9c0-0.1,0-0.1,0.1-0.1 c0.5,0,0.6-0.3,0.8-0.5C162.3,24,163,22,162.5,19.9z M4.4,28.7c-0.2-0.4-0.3-0.9-0.1-1.2c1.8-2.9,3.4-6,6.8-8 c2.8-1.7,5.9-2.9,8.9-4.2c4.3-1.8,9-2.5,13.6-3.4c0,0.1,0,0.2,0,0.2l0,0c-1.1,0.4-2.2,0.7-3.2,1.1c-3.3,1.1-6.5,2.1-9.7,3.4 c-4.2,1.6-7.6,4.2-10.1,7.5c-0.5,0.7-1,1.3-1.6,2c-2.2,2.7-1,4.7,1.2,6.9c0.1,0.1,0.3,0.3,0.4,0.5C7.8,32.5,5.5,31.2,4.4,28.7z  M158.2,23.8c-1.7,2.8-4.1,5.1-7,6.8c-2,1.2-4.5,2.1-6.9,2.9c-3.3,1-6.4,2.4-9.5,3.7c-3.9,1.6-8.1,2.5-12.4,2.9 c-6,0.5-11.8,1.5-17.6,2.5c-4.8,0.8-9.8,1-14.7,1.5c-5.6,0.6-11.2,0.2-16.8,0.1c-3.1-0.1-6.3,0.3-9.4,0.5c-2.6,0.2-5.2,0.1-7.8-0.1 c-3.9-0.3-7.8-0.5-11.7-0.9c-2.8-0.3-5.5-0.7-8.2-1.4c-3.2-0.8-6.3-1.7-9.5-2.5c-0.5-0.1-1-0.3-1.4-0.5c-0.2-0.1-0.4-0.1-0.6-0.2 c0,0,0.1,0,0.1,0c0.3-0.1,0.5,0,0.7,0.1c0,0,0,0,0,0c3.4,0.5,6.9,1.2,10.3,1.4c0.5,0,1,0,1.5,0c0.5,0,1.3,0.2,1.3-0.3 c0-0.6-0.7-0.9-1.4-0.9c-2.1,0-4.2-0.2-6.3-0.5c-4.6-0.7-9.1-1.5-13.4-3c-2.9-1.1-5.4-2.7-6.9-5.2c-0.5-0.8-0.5-1.6-0.1-2.4 c3.2-6.2,9-9.8,16.3-12.2c6.7-2.2,13.2-4.5,20.2-6c5-1.1,10-1.8,15-2.9c8.5-1.9,17.2-2.4,26-2.7c3.6-0.1,7.1-0.8,10.8-0.6 c8.4,0.7,16.7,1.2,25,2.3c4.5,0.6,9,1.2,13.6,1.7c3.6,0.4,7.1,1.4,10.5,2.8c3.1,1.3,6,2.9,8.5,5C159.1,17.7,159.8,21.1,158.2,23.8z"
                        />
                      </svg>
                    </span>
                    {/* SVG END */}
                  </span>
                </h2>
                <p className="mb-0">
                  We support kindies in essential lessons for acquiring the
                  basics and pursuing qualitative and demanding learning.
                </p>
                {/* Info list */}
                <ul className="list-group list-group-borderless my-2">
                  <li className="list-group-item d-flex align-items-center px-0">
                    <p className="mb-0 h6 fw-light">
                      <i className="bi bi-arrow-right text-primary me-2" />
                      We welcome all age groups as well as all nationalities.
                    </p>
                  </li>
                  <li className="list-group-item d-flex align-items-center px-0">
                    <p className="mb-0 h6 fw-light">
                      <i className="bi bi-arrow-right text-primary me-2" />
                      Whether you are a child or adult, student or integrated
                      into the world of work, you are welcome in our
                      conservatory which will create a tailor-made job for you
                      adapted to your daily life.
                    </p>
                  </li>
                  <li className="list-group-item d-flex align-items-center px-0">
                    <p className="mb-0 h6 fw-light">
                      <i className="bi bi-arrow-right text-primary me-2" />
                      The teaching program is based on training divided into 7
                      years, including an introductory class which constitutes a
                      common core and which ends with the Arabic music diploma.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            {/* Outer tabs START */}
            <ul
              className="nav nav-pills nav-pill-soft mb-3"
              id="course-pills-tab"
              role="tablist"
            >
              {/* Tab item */}
              <li className="nav-item me-2 me-sm-5" role="presentation">
                <button
                  className="nav-link active"
                  id="course-pills-tab-1"
                  data-bs-toggle="pill"
                  data-bs-target="#course-pills-tab1"
                  type="button"
                  role="tab"
                  aria-controls="course-pills-tab1"
                  aria-selected="true"
                >
                  The initiation class
                </button>
              </li>
              {/* Tab item */}
              <li className="nav-item me-2 me-sm-5" role="presentation">
                <button
                  className="nav-link"
                  id="course-pills-tab-2"
                  data-bs-toggle="pill"
                  data-bs-target="#course-pills-tab2"
                  type="button"
                  role="tab"
                  aria-controls="course-pills-tab2"
                  aria-selected="false"
                >
                  Over the next 5 years
                </button>
              </li>
              {/* Tab item */}
              <li className="nav-item me-2 me-sm-5" role="presentation">
                <button
                  className="nav-link"
                  id="course-pills-tab-3"
                  data-bs-toggle="pill"
                  data-bs-target="#course-pills-tab3"
                  type="button"
                  role="tab"
                  aria-controls="course-pills-tab3"
                  aria-selected="false"
                >
                  7th grade
                </button>
              </li>
            </ul>
            {/* Outer tabs END */}
            {/* Outer tabs contents START */}
            <div className="tab-content mb-0" id="course-pills-tabContent">
              {/* Outer content START */}
              <div
                className="tab-pane fade show active"
                id="course-pills-tab1"
                role="tabpanel"
                aria-labelledby="course-pills-tab-1"
              >
                <div className="row">
                  <div className="col-12">
                    <div className="row justify-content-between">
                      {/* Left content START */}
                      <div className="col-lg-6">
                        {/* Title */}
                        <h3>The initiation class</h3>
                        <p className="mb-3">
                          Discover the essentials of music in our initiation
                          class. Dive into the world of music theory and explore
                          different instruments under expert guidance.
                        </p>
                        <h6 className="mt-4">What you’ll learn</h6>
                        <ul className="list-group list-group-borderless mb-3">
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Introduction to fundamental music concepts
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Exploration of various musical instruments
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Guidance from experienced instructors
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Hands-on learning in a supportive environment
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Building a strong foundation for further musical
                            pursuits
                          </li>
                          <div className="mt-5" style={{ marginLeft: "120px" }}>
                            <Link
                              to={"/inscription/Initiation"}
                              className="btn btn-sm btn-primary-soft mb-0 rounded-pill py-2 px-4"
                            >
                              Subscribe !
                            </Link>
                          </div>
                        </ul>
                      </div>
                      {/* Left content END */}
                      {/* Right content START */}
                      <div className="col-lg-6 position-relative">
                        {/* Inner tab content START */}
                        <div
                          className="tab-content mb-0 pb-0"
                          id="course-pills-tabContent1"
                        >
                          {/* Inner content item START */}
                          <div
                            className="tab-pane fade show active"
                            id="course-pills-tab01"
                            role="tabpanel"
                            aria-labelledby="course-pills-tab-01"
                          >
                            {/* Card START */}
                            <div className="card p-2 pb-0 shadow" >
                              <div className="overflow-hidden" >
                                <img
                                  src="assets/images/about/brahim.png"
                                  className="card-img-top"
                                  alt="course image"
                                  style={{ height: "300px" }}
                                />
                                <div className="card-img-overlay d-flex p-3">
                                  {/* Video button and link */}
                                  <div className="m-auto">
                                    <a
                                      href="https://youtube.com/embed/IZz1tRxVz4I"
                                      className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                                      data-glightbox
                                      data-gallery="course-video"
                                    >
                                      <i className="fas fa-play" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                              
                            </div>
                            {/* Card END */}
                          </div>
                          {/* Inner content item END */}
                          {/* Inner content item START */}
                          <div
                            className="tab-pane fade"
                            id="course-pills-tab02"
                            role="tabpanel"
                            aria-labelledby="course-pills-tab-02"
                          >
                            {/* Card START */}
                            <div className="card p-2 pb-0 shadow">
                              <div className="overflow-hidden h-xl-200px">
                                <img
                                  src="assets/images/about/11.jpg"
                                  className="card-img-top"
                                  alt="course image"
                                />
                                <div className="card-img-overlay d-flex p-3">
                                  {/* Video button and link */}
                                  <div className="m-auto">
                                    <a
                                      href="https://www.youtube.com/embed/tXHviS-4ygo"
                                      className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                                      data-glightbox
                                      data-gallery="course-video"
                                    >
                                      <i className="fas fa-play" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                              {/* Card body */}
                              <div className="card-body">
                              
                              </div>
                            </div>
                            {/* Card END */}
                          </div>
                          {/* Inner content item END */}
                          {/* Inner content item START */}
                          <div
                            className="tab-pane fade"
                            id="course-pills-tab03"
                            role="tabpanel"
                            aria-labelledby="course-pills-tab-03"
                          >
                            {/* Card START */}
                            <div className="card p-2 shadow">
                              <div className="overflow-hidden h-xl-200px">
                                <img
                                  src="assets/images/about/14.jpg"
                                  className="card-img-top"
                                  alt="course image"
                                />
                                <div className="card-img-overlay d-flex p-3">
                                  {/* Video button and link */}
                                  <div className="m-auto">
                                    <a
                                      href="https://www.youtube.com/embed/tXHviS-4ygo"
                                      className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                                      data-glightbox
                                      data-gallery="course-video"
                                    >
                                      <i className="fas fa-play" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                              {/* Card body */}
                              <div className="card-body px-2">
                                <p className="mb-0">
                                  <span className="h6 mb-0 fw-bold me-1">
                                    Note:
                                  </span>
                                  Before you learning this video you need to
                                  first learn Beginner course
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Inner content item END */}
                        </div>
                        {/* Inner tab content END */}
                      </div>
                      {/* Right content END */}
                    </div>
                  </div>
                </div>{" "}
                {/* Row END */}
              </div>
              {/* Outer content END */}
              {/* Outer content START */}
              <div
                className="tab-pane fade"
                id="course-pills-tab2"
                role="tabpanel"
                aria-labelledby="course-pills-tab-2"
              >
                <div className="row">
                  {/* Left content START */}
                  <div className="col-lg-6">
                        {/* Title */}
                        <h3>Over the next 5 years</h3>
                        <p className="mb-3">
                        Our music program offers advanced and specialized instruction under the guidance of experienced teachers. Students will benefit from a focused and professional environment, 
                        preparing them for the culmination of their studies with the attainment of an Arabic music diploma.
                        </p>
                        <h6 className="mt-4">What you’ll learn</h6>
                        <ul className="list-group list-group-borderless mb-3">
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Advanced music theory and composition techniques
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Mastery of multiple musical instruments
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Personalized guidance from dedicated instructors
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Performance skills honed in a supportive atmosphere
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Preparation for professional pursuits in the field of Arabic music
                          </li>
                          <div className="mt-4" style={{ marginLeft: "120px" }}>
                          <Link
                              to={"/inscription/Over the next 5 years"}
                              className="btn btn-sm btn-primary-soft mb-0 rounded-pill py-2 px-4"
                            >
                              Subscribe !
                            </Link>
                          </div>
                        </ul>
                      </div>
                      {/* Left content END */}
                  {/* Right content START */}
                  <div className="col-lg-6">
                    {/* Card START */}
                    <div className="card p-2 pb-0 shadow">
                      <div className="overflow-hidden">
                        <img
                          src="assets/images/about/ahmed.jpg"
                          className="card-img-top"
                          alt="course image"
                          style={{ height: "300px" }}
                        />
                        <div className="card-img-overlay d-flex p-3">
                          {/* Video button and link */}
                          <div className="m-auto">
                            <a
                              href="https://www.youtube.com/embed/f1SG8HhhCJA"
                              className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                              data-glightbox
                              data-gallery="course-video"
                            >
                              <i className="fas fa-play" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Card body */}
                      <div className="card-body">
                        
                      </div>
                    </div>
                    {/* Card END */}
                  </div>
                  {/* Right content END */}
                </div>{" "}
                {/* Row END */}
              </div>
              {/* Outer content END */}
              {/* Outer content START */}
              <div
                className="tab-pane fade"
                id="course-pills-tab3"
                role="tabpanel"
                aria-labelledby="course-pills-tab-3"
              >
                <div className="row g-4">
                  {/* Left content START */}
                  <div className="col-lg-6">
                        {/* Title */}
                        <h3>7th grade is a diploma class</h3>
                        <p className="mb-3">
                        In the 7th year, students prepare for their diploma examination, which concludes 7 years of learning and leads to a state-recognized diploma. 
                        Before the examination, students undergo evaluation tests to familiarize themselves with the exam conditions.
                        </p>
                        <h6 className="mt-4">What you’ll learn</h6>
                        <ul className="list-group list-group-borderless mb-3">
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Preparation for diploma examination
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Culmination of 7 years of learning
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            State-recognized diploma
                          </li>
                          <li className="list-group-item h6 fw-light d-flex mb-0">
                            <i className="bi bi-patch-check-fill text-success me-2" />
                            Evaluation tests to simulate exam conditions
                          </li>
                          <div className=" mt-5" style={{ marginLeft: "120px" }}>
                            <Link
                                to="/inscription/7th grade is a diploma class"
                                className="btn btn-sm btn-primary-soft mb-0 rounded-pill py-2 px-4"
                              >
                                Subscribe !
                              </Link>
                          </div>
                        </ul>
                      </div>
                      {/* Left content END */}
                  {/* Right content START */}
                  <div className="col-lg-6">
                    {/* Card START */}
                    <div className="card p-2 pb-0 shadow">
                      <div className="overflow-hidden">
                        <img
                          src="assets/images/about/chibani.jpg"
                          className="card-img-top"
                          alt="course image"
                          style={{ height: "300px" }}
                        />
                        <div className="card-img-overlay d-flex p-3">
                          {/* Video button and link */}
                          <div className="m-auto">
                            <a
                              href="https://www.youtube.com/user/conservatoireelkindy"
                              className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                              data-glightbox
                              data-gallery="course-video"
                            >
                              <i className="fas fa-play" />
                            </a>
                          </div>
                        </div>
                      </div>
                      {/* Card body */}
                      <div className="card-body">
                        
                      </div>
                    </div>
                    {/* Card END */}
                  </div>
                  {/* Right content END */}
                </div>
              </div>
              {/* Outer content END */}
            </div>
            {/* Outer tabs contents END */}
          </div>
        </section>
        {/* =======================
Course END */}

       

    
      </div>
      <Footer />
    </>
  );
}

export default Index;
