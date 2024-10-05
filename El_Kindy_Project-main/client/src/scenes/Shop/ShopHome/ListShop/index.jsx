import BannerStartHome from 'components/BannerStartHome'
import Footer from 'components/Footer'
import NavBar from 'components/NavBar'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode library
import './ListShop.css';
function Index() {
  const accessToken = useSelector((state) => state.accessToken);
  const decodeToken = accessToken ? jwtDecode(accessToken) : "";
  const [popupVisible, setPopupVisible] = useState(false); // Etat pour contrôler la visibilité du popup
  const [shops, setShops] = useState([]); // Etat pour stocker la liste des shops

  // State to hold the image name
  const [imageName, setImageName] = useState(null);
  // State to hold the image file
  const [imageFile, setImageFile] = useState(null);

  // Function to handle removing the image
  const handleRemoveImage = () => {
    // Reset the image name to null
    setImageName(null);
    // Reset the image file
    setImageFile(null);
    // Reset the input field value to allow selecting the same file again
    document.getElementById('image').value = '';
  }; 
  // Function to handle selecting an image
  const handleImageSelect = (event) => {
    // Get the selected file
    const selectedFile = event.target.files[0];
    // Set the image name
    setImageName(selectedFile.name);
    // Set the image file
    setImageFile(selectedFile);
  };
  const navigate = useNavigate();

  const addShop = async (values, onSubmitProps) => {
    console.log("values", values);
    // this allow us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);
    console.log("formData", formData);
    console.log("picture name", values.picture.name);

    // Add the full name of the user to the form data
    const fullName = decodeToken ? decodeToken.fullName : '';
    const email = decodeToken ? decodeToken.email : '';

    formData.append('fullName', fullName);
    formData.append('email', email);

    const savedUserResponse = await fetch(
      "http://localhost:3001/shops",
      {
        method: "POST",
        body: formData,
      }
    );
    const savedShop = await savedUserResponse.json();
    //onSubmitProps.resetForm();
    if (savedShop) {
      console.log('Instrument ajouté !');
      console.log('Instrument', savedShop);
      setPopupVisible(true); // Afficher le popup après l'ajout réussi
      setTimeout(() => {
        setPopupVisible(false); // Fermer le popup après un délai
        navigate('/ListShop');
      }, 1500); // Délai pour fermer le popup et naviguer vers la liste des magasins
      toast.success('Instrument ajouté avec succès !!', {
        autoClose: 1500,
        onClose: () => {
          navigate('/ListShop');
        }
      });
    }
  };
  // Effet pour nettoyer le corps après la fermeture du modal
  useEffect(() => {
    const handleModalClose = () => {
      document.body.classList.remove('modal-open');
    };

    if (!popupVisible) {
      handleModalClose();
    }

    return () => {
      handleModalClose();
    };
  }, [popupVisible]);
  const handleFormSubmit = async (values, onSubmitProps) => {

    values.preventDefault();
    const formData = new FormData(values.target); // Create FormData object from form
    const formValues = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    // console.log("Values",formValues);
    await addShop(formValues, onSubmitProps);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/shops");
      const data = await response.json();
      // Filtrer les shops dont le statut est "accepted"
      const acceptedShops = data.filter((shop) => shop.status === 'accepted');
      setShops(acceptedShops);
    };
    fetchData();
  }, []);

  return (
    <>
      <NavBar />
      {/* **************** MAIN CONTENT START **************** */}
      <main>
        <ToastContainer />
        {/* =======================
Page Banner START */}
        <BannerStartHome
          title="Shop Home"
          description="Buy here , musical instruments for everyone ...!"
        />
        {/* =======================Page Banner END */}
        <div>
          <section className="py-5">
            <div className="container">
              <div className="row justify-content-center align-items-center">
                <div className="col-lg-6 position-relative order-1 order-lg-2">
                  {/* Title */}
                  <h5 className="text-center"><img
                    src="assets/images/element/guitarr.svg"
                    className="h-50px mb-2"
                    alt=""
                  /> Sell your own product <img
                      src="assets/images/element/guitarr.svg"
                      className="h-50px mb-2"
                      alt=""
                    />  </h5>
                  <p className="mb-2 text-center">For instance, when it comes to buying musical instruments, whether new or used, our website makes it easy for you.</p>

                  {/* Button */}
                  <div className="text-center">
                    <a href="#" className="btn btn-primary-soft mb-0 " data-bs-toggle="modal" data-bs-target="#addShop">
                      <FontAwesomeIcon icon={faPlus} /> Post your product for sale here ...
                    </a>        </div>
                </div>
              </div>
              <div className="my-5"></div>


              <div className="row">
                {/* Main content START */}
                <div className="col-12">
                  {/* Search option START */}
                  <div className="row mb-4 align-items-center">
                    {/* Title */}
                    <div className="col-md-4">
                      <h5 className="mb-2 mb-sm-0"> We have {shops.length} Instruments in our shop</h5>
                    </div>
                  </div>
                  {/* Search option END */}
                  {/* Main content START */}
                  {/* Main content START */}
                  <section className="py-5">
                    <div className="container">
                      <div className="row g-4">
                        {/* Parcours des shops et génération dynamique des cartes */}
                        {shops.map((shop) => (
                          <div key={shop._id} className="col-sm-6 col-lg-4 col-xl-3">
                            <Link to={`/DetailShopFront/${shop._id}`} className="text-decoration-none">
                              <div className="cardd h-100 shadow zoom border-2s position-relative" style={{ backgroundColor: 'white' }}>
                                {/* Bouton panier en haut à droite avec espace */}
                                
                                {/* Image */}
                                <img
                                  src={`http://localhost:3001/assets/${shop.picturePath}`}
                                  className="card-img-top"
                                  alt="shop image"
                                  style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                />
                                {/* Card body */}
                                <div className="card-body px-3">
                                  {/* Title */}
                                  <h5 className="card-title mb-0">
                                    <a href={`/shop-details/${shop._id}`} className="stretched-link">{shop.name}</a>
                                  </h5>
                                </div>

                                {/* Card footer */}
                                <div className="card-footer pt-0 px-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <span className="h6 fw-light mb-0">By {shop.marque} <br /> </span>
                                  </div>
                                </div>
                                <div className="card-footer  pt-0 px-3">
                                  {/* Conditionally render price with or without discount */}
                                  {shop.remise !== null ? (
                                    <div className="d-flex justify-content-end align-items-center me-2">
                                      <li className="list-inline-item">
                                        <label className="btn btn-success-soft-check" htmlFor={`option_${shop._id}`}>
                                          {/* Price and discount */}
                                          <span className="d-flex align-items-center">
                                            <span className="mb-0 h5 me-2 text-success">{(shop.price - (shop.price * shop.remise) / 100).toFixed(2)} dt</span>
                                            {/* Placeholder for discount */}
                                            <span className="text-decoration-line-through fs-6 mb-0 me-2">{shop.price}dt</span>
                                            {/* Placeholder for discount percentage */}
                                            <span className="badge bg-danger text-white mb-0">{shop.remise}% off</span>
                                          </span>
                                        </label>
                                      </li>
                                    </div>
                                  ) : (
                                    <div className="d-flex justify-content-end align-items-center me-2">

                                      <li className="list-inline-item">
                                        <label className="btn btn-success-soft-check" htmlFor={`option_${shop._id}`}>

                                          <h5 className="text-success mb-0">{shop.price} dt</h5>
                                        </label>
                                      </li>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                  {/* Main content END */}

                  {/* Main content END */}
                  {/* Pagination START */}
                  <div className="col-12">
                    <nav className="mt-4 d-flex justify-content-center" aria-label="navigation">
                      <ul className="pagination pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
                        <li className="page-item mb-0"><a className="page-link" href="#" tabIndex={-1}><i className="fas fa-angle-double-left" /></a></li>
                        <li className="page-item mb-0"><a className="page-link" href="#">1</a></li>
                        <li className="page-item mb-0 active"><a className="page-link" href="#">2</a></li>
                        <li className="page-item mb-0"><a className="page-link" href="#">..</a></li>
                        <li className="page-item mb-0"><a className="page-link" href="#">6</a></li>
                        <li className="page-item mb-0"><a className="page-link" href="#"><i className="fas fa-angle-double-right" /></a></li>
                      </ul>
                    </nav>
                  </div>
                  {/* Pagination END */}
                </div>
                {/* Main content END */}
              </div>{/* Row END */}
            </div>
          </section>
          {/* =======================
Page content END */}

          <div className={`modal fade ${popupVisible ? 'show' : ''}`} id="addShop" tabIndex={-1} aria-labelledby="addShopLabel" aria-hidden={!popupVisible}>
            <div className={`modal-dialog modal-dialog-centered ${popupVisible ? 'show' : ''}`}>
              <div className="modal-content">
                <div className="modal-header bg-primary">
                  <h5 className="modal-title text-white" id="addShopLabel">Add New Instrument</h5>
                  <button type="button" className="btn btn-sm btn-light mb-0" data-bs-dismiss="modal" aria-label="Close"><i className="bi bi-x-lg" /></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleFormSubmit} className="row text-start g-3">
                    {/* Answer options START */}
                    <div className="col-6">
                      <label className="form-label">Instrument name </label>
                      <input className="form-control" name="name" type="text" placeholder="Write name" required />
                    </div>
                    {/* Answer options START */}
                    <div className="col-6">
                      <label className="form-label">brand</label>
                      <input className="form-control" name="marque" type="text" placeholder="Write the brand" required />
                    </div>

                    <div className="col-6">
                      <label className="form-label">Price</label>
                      <input className="form-control" name="price" type="number" placeholder="Write the price" required />
                    </div>
                    <div className="col-6">
                      <label className="form-label">discount</label>
                      <input className="form-control" name="remise" type="number" placeholder="Write a discount" />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Phone number </label>
                      <input className="form-control" name="phoneNumber" type="number" placeholder="Write the number" required />
                    </div>
                    {/* Question */}
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input className="form-control" name="description" type="text" placeholder="Write description" required />
                    </div>
                    {/* Course category */}


                    <div className="col-12">
                      {/* Upload image START */}

                      <div className="m-4">
                        {/* Image */}
                        <div className="text-center justify-content-center align-items-center mx-5 my-5 p-sm-5 border border-2 border-dashed position-relative rounded-3">
                          {/* Display the image */}
                          {imageFile && (
                            <div>
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded image"
                                className="img-fluid mb-2 rounded"
                                style={{ maxWidth: '100px', maxHeight: '100px' }} // Ajuster la taille de l'image ici
                              />
                              <p className="mb-0">Uploaded image</p>
                            </div>
                          )}
                          {/* Upload image button */}
                          <div className="mb-3">
                            <h6 className="my-2">Upload instrument picture here, or <span className="text-primary" style={{ cursor: 'pointer' }}>Browse</span></h6>
                            {/* File input */}
                            <input
                              className="form-control form-control-sm" // Ajouter la classe form-control-sm pour réduire la taille de l'input
                              type="file"
                              name="picture"
                              id="image"
                              accept="image/gif, image/jpeg, image/png"
                              onChange={handleImageSelect}
                              required // Champ requis pour l'image
                            />
                            {/* Note */}
                            <p className="small mb-0 mt-2"><b>Note:</b> Only JPG, JPEG, and PNG formats are supported. Our suggested dimensions are 600px * 450px. Larger images will be cropped to fit our thumbnails/previews.</p>
                          </div>
                          {/* Remove image button */}
                          {imageName && (
                            <div className="d-sm-flex justify-content-end mt-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-danger-soft mb-3"
                                onClick={handleRemoveImage}
                              >
                                Remove image
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-danger-soft my-0" data-bs-dismiss="modal">Close</button>
                      <button className="btn btn-success my-0" type="submit">Add Instrument</button>
                    </div>
                    {/* Answer options END */}

                  </form>
                </div>

              </div>
            </div>
          </div>


        </div>




      </main>
      {/* **************** MAIN CONTENT END **************** */}

      <Footer />
    </>
  )
}

export default Index
