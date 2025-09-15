import React from "react";
import "./TermsScreen.css"; // We'll define styles here

const TermsPage = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-heading">Terms and Conditions</h1>
      <div className="terms-content">
        <p>
          These Terms and Conditions govern your use of the NthomeRidez e-hailing platform, whether as a Passenger or Driver. By registering or using the service, you agree to comply with and be bound by these Terms.
        </p>

        <hr />
        <h2>1. Definitions</h2>
        <p>
          "NthomeRidez" – The platform operated by [Your Company Name/NPO/Private Entity], offering e-hailing services.<br />
          "User" – Any individual using the platform, including both Passengers and Drivers.<br />
          "Driver" – An individual authorized to accept ride requests.<br />
          "Passenger" – An individual who requests and takes rides via the platform.
        </p>

        <hr />
        <h2>2. User Eligibility</h2>
        <p>
          Must be 18 years or older.<br />
          Must have a valid government-issued ID.<br />
          Drivers must possess a valid driver’s license, vehicle registration, roadworthy certificate, and necessary permits.
        </p>

        <hr />
        <h2>3. Use of the Platform</h2>
        <p>
          <strong>Passengers:</strong><br />
          - Agree to request rides in good faith.<br />
          - Agree to pay the fare as quoted on the app.<br />
          - Must not engage in abusive, illegal, or unsafe conduct during the ride.
        </p>
        <p>
          <strong>Drivers:</strong><br />
          - Agree to provide safe, professional, and lawful transport services.<br />
          - Must maintain clean, roadworthy vehicles.<br />
          - Must not accept rides outside the app unless authorized.
        </p>

        <hr />
        <h2>4. Fares and Payments</h2>
        <p>
          Fares are calculated based on distance, time, and vehicle type.<br />
          Payment can be made via cash or through the in-app payment system (when applicable).<br />
          A cancellation fee may apply if a trip is canceled too late.
        </p>

        <hr />
        <h2>5. Subscription Plans (If Applicable)</h2>
        <p>
          Subscription-based access may be available for frequent users or drivers.<br />
          Plans must be paid in advance and are non-refundable unless otherwise stated.
        </p>

        <hr />
        <h2>6. Prohibited Conduct</h2>
        <p>
          Users must not:<br />
          - Harass, threaten, or harm drivers, passengers, or staff.<br />
          - Use the app for illegal activities.<br />
          - Provide false information during sign-up or trip requests.
        </p>

        <hr />
        <h2>7. Ratings and Reviews</h2>
        <p>
          Users and drivers can rate each other after every trip.<br />
          Repeated low ratings may result in suspension or removal from the platform.
        </p>

        <hr />
        <h2>8. Liability and Insurance</h2>
        <p>
          NthomeRidez is not liable for any loss, damage, or injury that occurs during or as a result of the ride.<br />
          Drivers are responsible for ensuring their vehicle is properly insured.
        </p>

        <hr />
        <h2>9. Termination</h2>
        <p>
          NthomeRidez may suspend or terminate a user’s account for breach of terms, fraud, or safety concerns.<br />
          Users may deactivate their accounts at any time.
        </p>

        <hr />
        <h2>10. Dispute Resolution</h2>
        <p>
          Minor disputes should be reported through the app or customer support.<br />
          Serious matters may be escalated to legal arbitration or relevant transport authorities.
        </p>

        <hr />
        <h2>11. Privacy Policy</h2>
        <p>
          All user data is handled in accordance with POPIA (Protection of Personal Information Act).<br />
          Data will not be sold or shared without consent.
        </p>

        <hr />
        <h2>12. Modifications to Terms</h2>
        <p>
          NthomeRidez may update these Terms occasionally.<br />
          Continued use after updates means you agree to the new terms.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
