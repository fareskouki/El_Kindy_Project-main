import React from "react";

function Footer() {
  return (
    <div>
        {/* =======================
Footer START */}
<footer className="pt-0 bg-blue rounded-4 position-relative mx-2 mx-md-4 mb-3">
  {/* SVG decoration for curve */}
  <figure className="mb-0">
    <svg className="fill-body rotate-180" width="100%" height={120} viewBox="0 0 500 150" preserveAspectRatio="none">
      <path d="M0,150 L0,40 Q250,150 500,40 L580,150 Z" />
    </svg>
  </figure>
  <div className="container">
    <div className="row mx-auto">
      <div className="col-lg-6 mx-auto text-center my-0">
        {/* Logo START */}
        <a className="navbar-brand" href="index.html">
                    <img className="light-mode-item navbar-brand-item" src="/assets/images/logo/logo.png" style={{ width: '180px', height: '80px' }} alt="logo" />
                    <img className="dark-mode-item navbar-brand-item" src="/assets/images/logo/logo.png" style={{ width: '180px', height: '80px' }} alt="logo" />
                  </a>
                  {/* Logo END */}
        <p className="mt-4 text-white">Notre conservatoire propose une formation musicale complète, adaptée et sur mesure pour tous les âges !</p>
        {/* Links */}
        <ul className="nav justify-content-center text-primary-hover mt-3 mt-md-0">
          <li className="nav-item"><a className="nav-link text-white" href="#">About</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Terms</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Privacy</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Career</a></li>
          <li className="nav-item"><a className="nav-link text-white" href="#">Contact us</a></li>
          <li className="nav-item"><a className="nav-link text-white pe-0" href="#">Cookies</a></li>
        </ul>
        {/* Social media button */}
        <ul className="list-inline mt-3 mb-0">
          <li className="list-inline-item"> 
            <a className="btn btn-white btn-sm shadow px-2 text-facebook" href="https://www.facebook.com/ConservatoireElkindy">
              <i className="fab fa-fw fa-facebook-f" />
            </a> 
          </li>
          <li className="list-inline-item"> 
            <a className="btn btn-white btn-sm shadow px-2 text-instagram" href="https://www.instagram.com/conservatoireelkindy/">
              <i className="fab fa-fw fa-instagram" />
            </a> 
          </li>
          <li className="list-inline-item"> 
            <a className="btn btn-white btn-sm shadow px-2 text-youtube" href="https://www.youtube.com/user/conservatoireelkindy">
              <i className="fab fa-fw fa-youtube" />
            </a> 
          </li>
        </ul>
        {/* Bottom footer link */}
        <div className="mt-3 mb-3 text-white">©2024 <a href="https://www.webestica.com/" className="text-reset btn-link text-primary-hover" target="_blank"> Conservatoire El Kindy</a>. All rights reserved. </div>
      </div>
    </div>
  </div>
</footer>
{/* =======================
Footer END */}

    </div>
  );
}

export default Footer;
