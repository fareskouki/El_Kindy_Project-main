import React from 'react'

function Hero(props) {
  return (
    <div>

        {/* Start Hero Section */}
			<div class="hero">
				<div class="container">
					<div class="row justify-content-between">
						<div class="col-lg-5">
							<div class="intro-excerpt">
								<h1>{props.title}</h1>
								<p class="mb-4">{props.disc}</p>
								<p><a href="" class="btn btn-secondary me-2">Shop Now</a><a href="#" class="btn btn-white-outline">Explore</a></p>
							</div>
						</div>
						<div class="col-lg-7">
							<div class="hero-img-wrap">
								<img src="assets/images/couch.png" class="img-fluid"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		  {/* End Hero Section */}

    </div>
  )
}

export default Hero