import BannerStartHome from 'components/BannerStartHome'
import Footer from 'components/Footer'
import NavBar from 'components/NavBar'
import React, { useState, useEffect } from 'react'
import { getShop } from "services/shopService/api";

import axios from 'axios'; // Import Axios
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function Index() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const { id } = useParams();
    const [shop, setShop] = useState("");
    const navigate = useNavigate();
    const [liked, setLiked] = useState(() => {
        const storedLiked = localStorage.getItem(`liked-${id}`);
        return storedLiked === 'true'; // Convertir en booléen
    });
   
    const handleLike = async (like) => {
        try {
            // Mettre à jour l'état de like dans le composant
            setLiked(like);
            localStorage.setItem(`liked-${id}`, like.toString()); // Stocker comme chaîne
            // Appel Axios pour mettre à jour le champ likedShop dans la base de données
            await axios.put(`http://localhost:3001/shops/${id}`, { likedShop: like ? 1 : 0 }); // Remplacez "your-api-url" par l'URL de votre API

            // Afficher une notification
            toast.success(`Le magasin a été ${like ? 'ajouté aux favoris' : 'retiré des favoris'}.`, {
                autoClose: 1500,
                style: {
                    color: 'green', // Couleur du texte
                },
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du magasin:', error);
            // Gérer l'erreur
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/shops/${id}`); // Remplacez "your-api-url" par l'URL de votre API
                console.log("shop", response.data);
                setShop(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, []);


    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleString('en-US', options);
        return formattedDate;
    };


    return (
        <>
            <NavBar />
            <main>
                <ToastContainer />
                <BannerStartHome
                    title="Detail Instrument"
                    description="Buy here , musical instruments for everyone ...!"
                />

                <section className="pt-5">
                    <div className="container" data-sticky-container>
                        <div className="row g-4 g-sm-5">
                            <div className="col-xl-4">
                                <div data-sticky data-margin-top={80} data-sticky-for={992}>
                                    <div className="row justify-content-center">
                                        <div className="col-md-8 col-xl-12">
                                            <div className="card shadow">
                                                <div className="rounded-3">
                                                    <img src={`http://localhost:3001/assets/${shop.picturePath}`} className="card-img-top" alt="book image" />
                                                </div>
                                                <div className="card-body pb-3">
                                                    <div className="text-center">
                                                        <a href="#" className="btn btn-light mb-0">{liked ? (
                                                            <FontAwesomeIcon
                                                                icon={faHeartSolid}
                                                                className="text-danger"
                                                                onClick={() => handleLike(false)} // Pass false to unlike
                                                            />
                                                        ) : (
                                                            <FontAwesomeIcon
                                                                icon={faHeartRegular}
                                                                className="text-secondary"


                                                                onClick={() => handleLike(true)} // Pass true to like
                                                            />
                                                        )}
                                                            Add wishlist </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8">
                                <h1 className="mb-4">{shop.name}</h1>

                                <ul className="list-inline mb-4">
                                    <li className="list-inline-item">
                                        <input type="radio" className="btn-check" name="options" id="option1" defaultChecked />
                                        <div className="card-footer  pt-0 px-3">
                                            {shop.remise !== null ? (
                                                <div className="d-flex justify-content-end align-items-center me-2">
                                                    <li className="list-inline-item">
                                                        <label className="btn btn-success-soft-check" htmlFor={`option_${shop._id}`}>
                                                            <span className="d-flex align-items-center">
                                                                <span className="mb-0 h5 me-2 text-success">{(shop.price - (shop.price * shop.remise) / 100).toFixed(2)} dt</span>
                                                                <span className="text-decoration-line-through fs-6 mb-0 me-2">{shop.price}dt</span>
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
                                    </li>
                                </ul>
                                <h4>Description</h4>
                                <p>{shop.description}.</p>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-borderless">
                                            <li className="list-group-item px-0">
                                                <span className="h6 fw-light"><i className="bi fa-fw bi-calendar-fill text-primary me-2" />Published date:</span>
                                                <span className="h6">{formatDate(shop.createdAt)}</span>
                                            </li>
                                            <li className="list-group-item px-0">
                                                <span className="h6 fw-light"><i className="fas fa-fw fa-book text-primary me-2" />Full Name:</span>
                                                <span className="h6">{shop.fullName}</span>
                                            </li>
                                            <li className="list-group-item px-0">
                                                <span className="h6 fw-light"><i className="fas fa-fw fa-font text-primary me-2" />Email Contact:</span>
                                                <span className="h6">{shop.email}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-md-6">
                                        <ul className="list-group list-group-borderless">
                                            <li className="list-group-item px-0">
                                                <span className="h6 fw-light"><i className="bi fa-fw bi-calendar-fill text-primary me-2" />Mobile Number:</span>
                                                <span className="h6">+216 {shop.phoneNumber}</span>
                                            </li>
                                            <li className="list-group-item px-0">
                                                <span className="h6 fw-light"><i className="fas fa-fw fa-book text-primary me-2" />Brand :</span>
                                                <span className="h6">{shop.marque}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div>
                
                </div>

            </main>
            <Footer />
        </>
    )
}

export default Index;