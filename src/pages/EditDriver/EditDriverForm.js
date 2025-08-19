// EditDriverForm.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditDriverPage.css";
import { api } from "../../api";

function EditDriverForm() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("driver");
  const [touched, setTouched] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await axios.get(`${api}drivers/${userId}`);
        setDriver(res.data);

        const carRes = await axios.get(`${api}car_listing/user/${userId}`);
        setCar(carRes.data.carListings?.[0] || {});
      } catch (e) {
        setError("Failed to load driver or car data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  function handleDriverChange(e) {
    const { name, value } = e.target;
    setDriver((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleCarChange(e) {
    const { name, value } = e.target;
    setCar((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function isEmpty(val) {
    return !val || val.trim() === "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    if (
      isEmpty(driver.name) ||
      isEmpty(driver.lastName) ||
      isEmpty(driver.email) ||
      isEmpty(driver.phoneNumber)
    ) {
      setError("Please fill in all required fields.");
      setSaving(false);
      return;
    }

    try {
      const payload = {
        name: driver.name,
        lastName: driver.lastName,
        email: driver.email,
        phoneNumber: driver.phoneNumber,
        address: driver.address,
        current_address: driver.current_address,
        gender: driver.gender,
        status: driver.status,
        state: driver.state
      };
      await axios.put(`${api}drivers/${userId}`, payload);

      navigate("/adminapp/driver");
    } catch (e) {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="edit-p-6">Loading...</div>;
  if (error) return <div className="edit-p-6 edit-text-red-500">{error}</div>;

  return (
    <div className="edit-driver-page">
      <form className="edit-driver-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="edit-modal-title">Edit Driver & Car Details</h2>

        {/* Tabs */}
        <div className="edit-modal-tabs">
          <button
            type="button"
            className={activeTab === "driver" ? "edit-tab-active" : "edit-tab-inactive"}
            onClick={() => setActiveTab("driver")}
          >
            Driver Info
          </button>
          <button
            type="button"
            className={activeTab === "car" ? "edit-tab-active" : "edit-tab-inactive"}
            onClick={() => setActiveTab("car")}
          >
            Car Details
          </button>
        </div>

        {/* Driver Tab */}
        {activeTab === "driver" && (
          <div className="edit-modal-details">
            <div className="form-grid">
              <label>
                Name <span className="edit-required">*</span>
                <input
                  name="name"
                  value={driver.name || ""}
                  onChange={handleDriverChange}
                  className={`edit-input${touched.name && isEmpty(driver.name) ? " input-error" : ""}`}
                  placeholder="Enter first name"
                />
              </label>
              <label>
                Last Name <span className="edit-required">*</span>
                <input
                  name="lastName"
                  value={driver.lastName || ""}
                  onChange={handleDriverChange}
                  className={`edit-input${touched.lastName && isEmpty(driver.lastName) ? " input-error" : ""}`}
                  placeholder="Enter last name"
                />
              </label>
              <label>
                Email <span className="edit-required">*</span>
                <input
                  name="email"
                  type="email"
                  value={driver.email || ""}
                  onChange={handleDriverChange}
                  className={`edit-input${touched.email && isEmpty(driver.email) ? " input-error" : ""}`}
                  placeholder="e.g. user@email.com"
                />
              </label>
              <label>
                Phone <span className="edit-required">*</span>
                <input
                  name="phoneNumber"
                  value={driver.phoneNumber || ""}
                  onChange={handleDriverChange}
                  className={`edit-input${touched.phoneNumber && isEmpty(driver.phoneNumber) ? " input-error" : ""}`}
                  placeholder="e.g. 0712345678"
                />
              </label>
              <label>
                Gender
                <select
                  name="gender"
                  value={driver.gender || ""}
                  onChange={handleDriverChange}
                  className="edit-input"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label>
                Address
                <input
                  name="address"
                  value={driver.address || ""}
                  onChange={handleDriverChange}
                  className="edit-input"
                  placeholder="Street address"
                />
              </label>
              <label>
                Current Address
                <input
                  name="current_address"
                  value={driver.current_address || ""}
                  onChange={handleDriverChange}
                  className="edit-input"
                  placeholder="Current residence"
                />
              </label>
              <label>
                Status
                <input
                  name="status"
                  value={driver.status || ""}
                  onChange={handleDriverChange}
                  className="edit-input"
                  placeholder="Active / Inactive"
                />
              </label>
              <label>
                State
                <input
                  name="state"
                  value={driver.state || ""}
                  onChange={handleDriverChange}
                  className="edit-input"
                  placeholder="e.g. Gauteng"
                />
              </label>
            </div>
          </div>
        )}

        {/* Car Tab */}
        {activeTab === "car" && car && (
          <div className="edit-car-card">
            <div className="form-grid">
              <label>
                Make <span className="edit-required">*</span>
                <input
                  name="car_make"
                  value={car.car_make || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="Toyota"
                />
              </label>
              <label>
                Model <span className="edit-required">*</span>
                <input
                  name="car_model"
                  value={car.car_model || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="Corolla"
                />
              </label>
              <label>
                Year <span className="edit-required">*</span>
                <input
                  name="car_year"
                  value={car.car_year || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="2022"
                />
              </label>
              <label>
                Seats
                <input
                  name="number_of_seats"
                  value={car.number_of_seats || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="4"
                />
              </label>
              <label>
                Color
                <input
                  name="car_colour"
                  value={car.car_colour || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="White"
                />
              </label>
              <label>
                License Plate <span className="edit-required">*</span>
                <input
                  name="license_plate"
                  value={car.license_plate || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="AB 123 CD GP"
                />
              </label>
              {car.car_image && typeof car.car_image === "string" && (
                <div className="edit-car-image-preview">
                  <img src={car.car_image} alt="Car" />
                  <div className="edit-car-image-caption">Current car image</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="form-actions">
          <button type="button" className="edit-action-btn cancel-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="edit-action-btn save-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && <div className="edit-text-red-500">{error}</div>}
      </form>
    </div>
  );
}

export default EditDriverForm;
