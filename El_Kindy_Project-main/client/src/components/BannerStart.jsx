import React from 'react';
function BannerStart(props) {
  return (
    <div>
       {/* =============================================================
        Page Banner START */}
            <section className="py-0 bg-blue h-100px align-items-center d-flex h-200px rounded-4" style={{background: 'url(assets/images/pattern/04.png) no-repeat center center', backgroundSize: 'cover'}}>
            {/* Main banner background image */}
            <div className="container">
                <div className="row">
                <div className="col-12 text-center">
                    {/* Title */}
                    <h1 className="text-white">{props.title}</h1>
                    <p className="text-white mb-0">{props.description}</p>	
                </div>
                </div>
            </div>
            </section>
        {/* =======================
        Page Banner END */}

    </div>
  )
}

export default BannerStart

