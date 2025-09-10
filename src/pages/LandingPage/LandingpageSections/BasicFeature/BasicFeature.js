import "./BasicFeature.css"
import blueBg from '../../../../assets/img/blue bg.png'


const BasicFeatures = () => {
  return (
    <section className="basic-features">
      <div className="basic-features-container">
        <div className="basic-features-content">
          <div className="basic-features-text">
            <h2 className="basic-features-title">
              Enter a new age
              <br />
              of
              <br />
              transportation
            </h2>
            <p className="basic-features-description">
              Experience the power of these game-changing features on our app. Dynamic rate adjustments guaranteeing
              fair pay for drivers, real-time tracking for your absolute safety, and a registration process so seamless,
              the market throws your way.
            </p>
          </div>
          <div className="basic-features-image">
            <div className="image-container">
              <img
                src={blueBg}
                alt="Car side mirror with motion blur showing speed and movement"
                className="circular-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BasicFeatures
