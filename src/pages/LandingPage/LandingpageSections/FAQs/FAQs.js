import "./FAQs.css"

const FAQ = () => {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <h3 className="faq-title">FAQ</h3>
        <p className="faq-subtitle">Find the answers for the most frequently asked questions below</p>

        <div className="faq-grid">
          <div className="faq-item">
            <h3 className="faq-question">How do I report an issue with a passenger or trip?</h3>
            <p className="faq-answer">
              If you encounter any issues with a passenger or trip, you can report it through the Ride Smart app. Our
              support team will investigate the issue and take appropriate action.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">Can I drive with Ride Smart part-time?</h3>
            <p className="faq-answer">
              <strong>
                <u>Yes, it is possible!</u>
              </strong>{" "}
              Many drivers choose to drive with Ride Smart part-time to earn extra income. You have the flexibility to
              set your own schedule and drive whenever it's convenient for you.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">What incentives or bonuses are available for drivers?</h3>
            <p className="faq-answer">
              Ride Smart offers various incentives and bonuses to drivers based on factors such as trip volume, peak
              hours, and driver ratings. Check the promotions section of the app for details on current incentives in
              your area.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">How do I receive payments as a driver?</h3>
            <p className="faq-answer">
              <strong>
                <u>Yes, it is possible!</u>
              </strong>{" "}
              Ride Smart drivers receive payments directly to their bank accounts. Earnings are deposited weekly or can
              be cashed out instantly using our Instant Pay feature.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">What safety measures should I follow as a driver?</h3>
            <p className="faq-answer">
              Your safety and the safety of your passengers are our top priorities. Follow recommended safety
              guidelines, such as verifying passenger identities, confirming trip details, and maintaining a clean and
              safe vehicle.
            </p>
          </div>

          <div className="faq-item">
            <h3 className="faq-question">What are the vehicle requirements for driving?</h3>
            <p className="faq-answer">
              Ride Smart has specific vehicle requirements depending on the service you're interested in. Generally,
              your vehicle must meet certain age, model, and condition criteria for safety and comfort standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
