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

  // Simple validation for required fields
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
    // Only send the fields your endpoint expects!
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

    // If you want to update the car, do it in a separate endpoint/call
    // (not shown here, since your backend expects only driver fields)

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
        <div className="edit-modal-tabs" style={{ marginBottom: 24 }}>
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
          <div className="edit-modal-details" style={{ flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div className="edit-form-section-title">Personal Details</div>
                <label>
                  Name <span className="edit-required">*</span>
                  <input
                    name="name"
                    value={driver.name || ""}
                    onChange={handleDriverChange}
                    className={`edit-input${touched.name && isEmpty(driver.name) ? " edit-input-error" : ""}`}
                    placeholder="Enter first name"
                    required
                  />
                </label>
                <label>
                  Last Name <span className="edit-required">*</span>
                  <input
                    name="lastName"
                    value={driver.lastName || ""}
                    onChange={handleDriverChange}
                    className={`edit-input${touched.lastName && isEmpty(driver.lastName) ? " edit-input-error" : ""}`}
                    placeholder="Enter last name"
                    required
                  />
                </label>
                <label>
                  Email <span className="edit-required">*</span>
                  <input
                    name="email"
                    type="email"
                    value={driver.email || ""}
                    onChange={handleDriverChange}
                    className={`edit-input${touched.email && isEmpty(driver.email) ? " edit-input-error" : ""}`}
                    placeholder="e.g. user@email.com"
                    required
                  />
                </label>
                <label>
                  Phone <span className="edit-required">*</span>
                  <input
                    name="phoneNumber"
                    value={driver.phoneNumber || ""}
                    onChange={handleDriverChange}
                    className={`edit-input${touched.phoneNumber && isEmpty(driver.phoneNumber) ? " edit-input-error" : ""}`}
                    placeholder="e.g. 0712345678"
                    required
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
              </div>
              <div style={{ flex: 1, minWidth: 260 }}>
                <div className="edit-form-section-title">Location & Status</div>
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
                    placeholder="e.g. Active"
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
          </div>
        )}

        {/* Car Tab */}
        {activeTab === "car" && car && (
          <div className="edit-car-card" style={{ flexDirection: "column", gap: 24 }}>
            <div className="edit-form-section-title">Car Details</div>
            <div className="edit-car-fields-grid">
              <label>
                Make <span className="edit-required">*</span>
                <input
                  name="car_make"
                  value={car.car_make || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="e.g. Toyota"
                  required
                />
              </label>
              <label>
                Model <span className="edit-required">*</span>
                <input
                  name="car_model"
                  value={car.car_model || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="e.g. Corolla"
                  required
                />
              </label>
              <label>
                Year <span className="edit-required">*</span>
                <input
                  name="car_year"
                  value={car.car_year || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="e.g. 2022"
                  required
                />
              </label>
              <label>
                Seats
                <input
                  name="number_of_seats"
                  value={car.number_of_seats || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="e.g. 4"
                />
              </label>
              <label>
                Color
                <input
                  name="car_colour"
                  value={car.car_colour || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="e.g. White"
                />
              </label>
              <label>
                License Plate <span className="edit-required">*</span>
                <input
                  name="license_plate"
                  value={car.license_plate || ""}
                  onChange={handleCarChange}
                  className="edit-input"
                  placeholder="e.g. AB 123 CD GP"
                  required
                />
              </label>
            </div>
            {car.car_image && typeof car.car_image === "string" && (
              <div className="edit-car-image-preview">
                <img src={car.car_image} alt="Car" />
                <div className="edit-car-image-caption">Current car image</div>
              </div>
            )}
            <div className="edit-car-section-helper">
              Please ensure all details are correct. Required fields are marked with <span className="edit-required">*</span>.
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button type="button" className="edit-action-btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="edit-action-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="edit-text-red-500" style={{ marginTop: 12 }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default EditDriverForm;
