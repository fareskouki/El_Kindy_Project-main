import React, { useEffect, useState, useRef } from "react";
import Footer from "components/Footer";
import NavBar from "components/NavBar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loadScripts } from "../../../scriptLoader";
import BannerStartHome from "components/BannerStartHome";
import '../../Style.css';

function Index() {
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);

  // Récupérer les stage de l'API
  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await fetch("http://localhost:3001/stage/Stage");
        const { stages } = await response.json();
        setStages(stages);
      } catch (error) {
        console.error("Error fetching stages:", error);
      }
    };


    fetchStages();
  }, []);

  const handleDetailClick = (stage) => {
    setSelectedStage(stage);
  };
  return (
    <>
      <NavBar />

      <BannerStartHome
          title="All Internships"
          description="Find Out Our Internship."
        />
      <div>
   
       <section className="position-relative pt-0 pt-lg-5">
  <div className="container">

		<div class="row mb-4">
			<div class="col-12">
				<h2 class="fs-1 fw-bold">
					<span class="position-relative z-index-9">Most Popular </span>
					<span class="position-relative z-index-1"> Internships
						<span class="position-absolute top-50 start-50 translate-middle z-index-n1">
							<svg width="163.9px" height="48.6px">
								<path class="fill-warning" d="M162.5,19.9c-0.1-0.4-0.2-0.8-0.3-1.3c-0.1-0.3-0.2-0.5-0.4-0.7c-0.3-0.4-0.7-0.7-1.2-0.9l0.1,0l-0.1,0 c0.1-0.4-0.2-0.5-0.5-0.6c0,0-0.1,0-0.1,0c-0.1-0.1-0.2-0.2-0.3-0.3c0-0.3,0-0.6-0.2-0.7c-0.1-0.1-0.3-0.2-0.6-0.2 c0-0.3-0.1-0.5-0.3-0.6c-0.1-0.1-0.3-0.2-0.5-0.2c-0.1,0-0.1,0-0.2,0c-0.5-0.4-1-0.8-1.4-1.1c0,0,0-0.1,0-0.1c0-0.1-0.1-0.1-0.3-0.2 c-0.9-0.5-1.8-1-2.6-1.5c-6-3.6-13.2-4.3-19.8-6.2c-4.1-1.2-8.4-1.4-12.6-2c-5.6-0.8-11.3-0.6-16.9-1.1c-2.3-0.2-4.6-0.3-6.8-0.3 c-1.2,0-2.4-0.2-3.5-0.1c-2.4,0.4-4.9,0.6-7.4,0.7c-0.8,0-1.7,0.1-2.5,0.1c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0 c-0.9,0-1.8,0.1-2.7,0.1c-0.9,0-1.8,0-2.7,0c-5.5-0.3-10.7,0.7-16,1.5c-2.5,0.4-5.1,1-7.6,1.5c-2.8,0.6-5.6,0.7-8.4,1.4 c-4.1,1-8.2,1.9-12.3,2.6c-4,0.7-8,1.6-11.9,2.7c-3.6,1-6.9,2.5-10.1,4.1c-1.9,0.9-3.8,1.7-5.2,3.2c-1.7,1.8-2.8,4-4.2,6 c-1,1.3-0.7,2.5,0.2,3.9c2,3.1,5.5,4.4,9,5.7c1.8,0.7,3.6,1,5.3,1.8c2.3,1.1,4.6,2.3,7.1,3.2c5.2,2,10.6,3.4,16.2,4.4 c3,0.6,6.2,0.9,9.2,1.1c4.8,0.3,9.5,1.1,14.3,0.8c0.3,0.3,0.6,0.3,0.9-0.1c0.7-0.3,1.4,0.1,2.1-0.1c3.7-0.6,7.6-0.3,11.3-0.3 c2.1,0,4.3,0.3,6.4,0.2c4-0.2,8-0.4,11.9-0.8c5.4-0.5,10.9-1,16.2-2.2c0.1,0.2,0.2,0.1,0.2,0c0.5-0.1,1-0.2,1.4-0.3 c0.1,0.1,0.2,0.1,0.3,0c0.5-0.1,1-0.3,1.6-0.3c3.3-0.3,6.7-0.6,10-1c2.1-0.3,4.1-0.8,6.2-1.2c0.2,0.1,0.3,0.1,0.4,0.1 c0.1,0,0.1,0,0.2-0.1c0,0,0.1,0,0.1-0.1c0,0,0-0.1,0.1-0.1c0.2-0.1,0.4-0.1,0.6-0.2c0,0,0.1,0,0.1,0c0.1,0,0.2-0.1,0.3-0.2 c0,0,0,0,0,0l0,0c0,0,0,0,0,0c0.2,0,0.4-0.1,0.5-0.1c0,0,0,0,0,0c0.1,0,0.1,0,0.2,0c0.2,0,0.3-0.1,0.3-0.3c0.5-0.2,0.9-0.4,1.4-0.5 c0.1,0,0.2,0,0.2,0c0,0,0.1,0,0.1,0c0,0,0.1-0.1,0.1-0.1c0,0,0,0,0.1,0c0,0,0.1,0,0.1,0c0.2,0.1,0.4,0.1,0.6,0 c0.1,0,0.1-0.1,0.2-0.2c0.1-0.1,0.1-0.2,0.1-0.3c0.5-0.2,1-0.4,1.6-0.7c1.5-0.7,3.1-1.4,4.7-1.9c4.8-1.5,9.1-3.4,12.8-6.3 c0.8-0.2,1.2-0.5,1.6-1c0.2-0.3,0.4-0.6,0.5-0.9c0.5-0.1,0.7-0.2,0.9-0.5c0.2-0.2,0.2-0.5,0.3-0.9c0-0.1,0-0.1,0.1-0.1 c0.5,0,0.6-0.3,0.8-0.5C162.3,24,163,22,162.5,19.9z M4.4,28.7c-0.2-0.4-0.3-0.9-0.1-1.2c1.8-2.9,3.4-6,6.8-8 c2.8-1.7,5.9-2.9,8.9-4.2c4.3-1.8,9-2.5,13.6-3.4c0,0.1,0,0.2,0,0.2l0,0c-1.1,0.4-2.2,0.7-3.2,1.1c-3.3,1.1-6.5,2.1-9.7,3.4 c-4.2,1.6-7.6,4.2-10.1,7.5c-0.5,0.7-1,1.3-1.6,2c-2.2,2.7-1,4.7,1.2,6.9c0.1,0.1,0.3,0.3,0.4,0.5C7.8,32.5,5.5,31.2,4.4,28.7z  M158.2,23.8c-1.7,2.8-4.1,5.1-7,6.8c-2,1.2-4.5,2.1-6.9,2.9c-3.3,1-6.4,2.4-9.5,3.7c-3.9,1.6-8.1,2.5-12.4,2.9 c-6,0.5-11.8,1.5-17.6,2.5c-4.8,0.8-9.8,1-14.7,1.5c-5.6,0.6-11.2,0.2-16.8,0.1c-3.1-0.1-6.3,0.3-9.4,0.5c-2.6,0.2-5.2,0.1-7.8-0.1 c-3.9-0.3-7.8-0.5-11.7-0.9c-2.8-0.3-5.5-0.7-8.2-1.4c-3.2-0.8-6.3-1.7-9.5-2.5c-0.5-0.1-1-0.3-1.4-0.5c-0.2-0.1-0.4-0.1-0.6-0.2 c0,0,0.1,0,0.1,0c0.3-0.1,0.5,0,0.7,0.1c0,0,0,0,0,0c3.4,0.5,6.9,1.2,10.3,1.4c0.5,0,1,0,1.5,0c0.5,0,1.3,0.2,1.3-0.3 c0-0.6-0.7-0.9-1.4-0.9c-2.1,0-4.2-0.2-6.3-0.5c-4.6-0.7-9.1-1.5-13.4-3c-2.9-1.1-5.4-2.7-6.9-5.2c-0.5-0.8-0.5-1.6-0.1-2.4 c3.2-6.2,9-9.8,16.3-12.2c6.7-2.2,13.2-4.5,20.2-6c5-1.1,10-1.8,15-2.9c8.5-1.9,17.2-2.4,26-2.7c3.6-0.1,7.1-0.8,10.8-0.6 c8.4,0.7,16.7,1.2,25,2.3c4.5,0.6,9,1.2,13.6,1.7c3.6,0.4,7.1,1.4,10.5,2.8c3.1,1.3,6,2.9,8.5,5C159.1,17.7,159.8,21.1,158.2,23.8z"/>
							</svg>
						</span>
					</span>
				</h2>
				<p class="mb-0">See what course other students and experts in your domain are learning on.</p>
			</div>
		</div>
     
                  {/* Content */}
                  <div className="col-12 col-xl-3 d-flex justify-content-between align-items-center mt-3 mt-xl-0">
                    {/* Advanced filter responsive toggler END */}
<br></br>                  </div>
                {/* Search option END */}
    <div className="row g-4">
      {stages.map((stage, index) => (
        <div className="col-sm-6 col-lg-3 col-xl-3" key={index}>
          <div className="cardd shadow-hover h-100">
            <div className="overflow-hidden rounded-3">
              {/* Affichage de l'image */}
              {stage.picturePath ? (
                <img
                  src={`http://localhost:3001/assets/${stage.picturePath}`}
                  alt=""
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  className="card-img-top"
                />
              ) : (
                <span>No Image</span>
              )}
              {/* Overlay */}
              <div className="bg-overlay bg-dark opacity-4" />
              <div className="card-img-overlay d-flex align-items-start p-3">
                {/* Badge */}
                <a href="#" className="badge bg-success text-white">
                  Student Event
                </a>
                {/* Reservation Button 
                <button className="btn btn-warning ml-5 ms-5">Reservation</button>*/}
              </div>
            </div>
            <h5 className="card-title fw-normal">
                          {/*     <a href="#">{event.title}</a> */}
                            </h5>
                            <div className="text-center mt-5 cardd-layer">
                            <Link to={`/StageDetail/${stage._id}`}  className="btn btn-primary btn-sm"  onClick={() => handleDetailClick(stage)}>
                            View more</Link>
                            </div>
            {/* Card body */}
            <div className="card-body">
            
              {/* Title */}
              <h5 className="card-title ">
                
                <a href="#">{stage.title}</a>
                
              </h5>
              <h4 className="mb-0">{stage.price ? `${stage.price} TND` : "Free"}</h4>

              <p className="text-truncate-2">{stage.description}</p>
              {/* Info */}
              <div className="d-flex justify-content-between " >
                <h6 className="mb-0">
                  <a href="#">{stage.startDate}</a>
                </h6>
                <span className="small">{stage.finishDate}</span>
              </div>
            </div>
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
