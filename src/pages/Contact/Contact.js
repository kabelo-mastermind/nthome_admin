import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { IoIosCall, IoIosMail, IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoIosPin, IoIosSend } from 'react-icons/io';
import toast, { Toaster } from 'react-hot-toast';
import './Contact.css';
import ScrollToTop from '../LandingPage/LandingpageSections/ScrollToTop/ScrollToTopButton';
import { api } from "../../api";

const Contact = ({ emails }) => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: '',
    subject: '',
    email: emails || '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInput = (e) => {
    setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!values.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!values.subject.trim()) {
      errors.subject = 'Subject is required';
      isValid = false;
    }

    if (!values.message.trim()) {
      errors.message = 'Message is required';
      isValid = false;
    }

    if (!emails && !values.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emails && values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        name: values.name,
        email: emails || values.email,
        subject: values.subject,
        message: values.message
      };

      await axios.post(`${api}/contactUS`, formData);
      toast.success("Message sent successfully!");
      setTimeout(() => {
        navigate('/thankyou');
      }, 2000);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to send message: ${error.response.data.message || 'Please try again.'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error("No response from server. Please try again later.");
      } else {
        console.error('Error:', error.message);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Contact methods handlers
  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleEmail = () => {
    window.location.href = 'mailto:info@nthome.com';
  };

  const handleSocialMedia = (platform) => {
    const urls = {
      facebook: 'https://www.facebook.com/NthomeExpressCouriers',
      twitter: 'https://twitter.com/Nthomekp',
      instagram: 'https://www.instagram.com/Nthomekp'
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-overlay"></div>
        <div className="contact-hero-content">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Let's start a conversation.</p>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-wrapper">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <p className="contact-info-description">
              Our team is here to assist you with all courier needs. 
              Reach us via phone, email, or social platforms.
            </p>

            <div className="contact-info-card">
              <div className="contact-info-item">
                <div className="contact-icon">
                  <IoIosPin />
                </div>
                <div className="contact-details">
                  <h4>Address</h4>
                  <p>4652 N Mamabolo street, Pretoria West, South Africa</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <IoIosCall />
                </div>
                <div className="contact-details">
                  <h4>Phone Numbers</h4>
                  <p 
                    className="contact-link" 
                    onClick={() => handleCall('+27842346914')}
                  >
                    +27 84 234 6914
                  </p>
                  <p 
                    className="contact-link" 
                    onClick={() => handleCall('+27842346918')}
                  >
                    +27 84 234 6918
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <IoIosMail />
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p 
                    className="contact-link" 
                    onClick={handleEmail}
                  >
                    info@nthome.com
                  </p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">
                  <IoLogoFacebook />
                </div>
                <div className="contact-details">
                  <h4>Follow Us</h4>
                  <div className="social-links">
                    <button 
                      className="social-btn"
                      onClick={() => handleSocialMedia('facebook')}
                    >
                      <IoLogoFacebook />
                    </button>
                    <button 
                      className="social-btn"
                      onClick={() => handleSocialMedia('twitter')}
                    >
                      <IoLogoTwitter />
                    </button>
                    <button 
                      className="social-btn"
                      onClick={() => handleSocialMedia('instagram')}
                    >
                      <IoLogoInstagram />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className={`form-group ${errors.name ? 'error' : ''}`}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={values.name}
                  onChange={handleInput}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={values.email}
                  onChange={handleInput}
                  disabled={!!emails}
                  className={emails ? 'disabled-field' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className={`form-group ${errors.subject ? 'error' : ''}`}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={values.subject}
                  onChange={handleInput}
                />
                {errors.subject && <span className="error-message">{errors.subject}</span>}
              </div>

              <div className={`form-group ${errors.message ? 'error' : ''}`}>
                <label htmlFor="message">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Please describe your inquiry in detail..."
                  value={values.message}
                  onChange={handleInput}
                />
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <IoIosSend className="send-icon" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h2>Find Us</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3581.866300343508!2d28.13156131502805!3d-26.120883983472536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e951a6e5d7b7b0f%3A0x5a0a0a0a0a0a0a0!2s4652%20N%20Mamabolo%20St%2C%20Pretoria%20West%2C%20Pretoria%2C%200183!5e0!3m2!1sen!2sza!4v1633600000000!5m2!1sen!2sza"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nthome Courier Location"
            />
          </div>
        </div>
      </div>

      <ScrollToTop />
    </>
  );
};

export default Contact;
