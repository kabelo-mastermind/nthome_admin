<<<<<<< HEAD
import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { api } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../configs/firebase";
import { showToast } from "../../constants/ShowToast";
import { setUser } from "../../contexts/redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import "./CustomerPage.css";

// Memoized components
const ProfileHeader = memo(({ customerData, uploadingImage, pickImage, formData, isProfileComplete, genderColor }) => (
    <div className="profile-header">
        <div className="profile-image-container">
            {uploadingImage ? (
                <div className="uploading-container">Uploading...</div>
=======
import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaArrowLeft,
  FaPhoneAlt,
  FaAddressBook,
} from "react-icons/fa";
import "./CustomerPage.css";
import "./editpopup.css";

const EditIcon = () => (
  <svg
    className="icon"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M15.232 5.232l3.536 3.536M9 13l6-6M3 21h18" />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="icon"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" />
  </svg>
);

const API_BASE = "https://tech-wise-server-brown.vercel.app/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRideHistory, setShowRideHistory] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);
  const [tripLoading, setTripLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: null,
    name: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    current_address: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/customers`);
      if (!response.ok) throw new Error("Failed to fetch customers");
      const data = await response.json();
      setCustomers(data.rows);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter customers by search
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.lastname?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phoneNumber?.toLowerCase().includes(term) ||
      c.current_address?.toLowerCase().includes(term)
    );
  });

  // Ride history
  const openRideHistory = async (id) => {
    setSelectedCustomerId(id);
    setShowRideHistory(true);
    setTripLoading(true);
    setTripHistory([]);
    try {
      const response = await fetch(`${API_BASE}/tripHistory/${id}`);
      if (!response.ok) throw new Error("Failed to fetch trip history");
      const data = await response.json();
      setTripHistory(data);
    } catch (err) {
      console.error(err);
      setTripHistory([]);
    } finally {
      setTripLoading(false);
    }
  };

  const closeRideHistory = () => {
    setShowRideHistory(false);
    setSelectedCustomerId(null);
    setTripHistory([]);
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await fetch(`${API_BASE}/delete-customer/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const resData = await response.json();
        alert(`Error: ${resData.message || "Failed to delete user"}`);
        return;
      }
      alert("User deleted successfully");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // Edit customer
  const editCustomer = (customer) => {
    setEditFormData({
      id: customer.id,
      name: customer.name || "",
      lastname: customer.lastname || "",
      email: customer.email || "",
      phoneNumber: customer.phoneNumber || "",
      current_address: customer.current_address || "",
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    const { id, name, lastname, email, phoneNumber, current_address } = editFormData;
    if (!name || !lastname || !email) {
      setEditError("Name, Lastname, and Email are required.");
      return;
    }
    setEditLoading(true);
    setEditError(null);
    try {
      const response = await fetch(`${API_BASE}/update-customer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: id, name, lastname, email, phoneNumber, current_address }),
      });
      if (!response.ok) {
        const resData = await response.json();
        setEditError(resData.message || "Failed to update customer");
      } else {
        alert("Customer updated successfully");
        setShowEditModal(false);
        fetchCustomers();
      }
    } catch (err) {
      console.error(err);
      setEditError("An error occurred while updating the customer");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="customer-page-container">
      <h1>Customer Management</h1>
      <input
        type="search"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="customer-search-input"
      />

      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="customer-error-text">Error: {error}</p>
      ) : filteredCustomers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="customer-card-list">
          {filteredCustomers.map((c) => (
            <div className="customer-card" key={c.id}>
              <div className="customer-card-header">
                <img
                  src={c.profile_picture || "/images/placeholder.jpg"}
                  alt={c.name}
                  className="customer-avatar"
                />
                <div>
                  <h2>{c.name} {c.lastname}</h2>
                  <p>{c.email}</p>
                </div>
              </div>

              <div className="customer-card-body">
                <p><FaPhoneAlt /> {c.phoneNumber || "-"}</p>
                <p><FaAddressBook /> {c.current_address || "-"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status-badge ${c.status?.toLowerCase() === "active" ? "status-active" : "status-inactive"}`}>
                    {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Inactive"}
                  </span>
                </p>
              </div>

              <div className="customer-card-actions">
                <button className="customer-card-icons" onClick={() => openRideHistory(c.id)} title="Ride History"><FaHistory /></button>
                <button className="customer-card-icons" onClick={() => editCustomer(c)} title="Edit"><EditIcon /></button>
                <button className="customer-card-icons icon-delete" onClick={() => deleteCustomer(c.id)} title="Delete"><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showRideHistory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeRideHistory}>
              <FaArrowLeft /> Back
            </button>
            <h2>Ride History for Customer ID: {selectedCustomerId}</h2>
            {tripLoading ? (
              <p>Loading trip history...</p>
            ) : tripHistory.length === 0 ? (
              <p>No trips found for this user.</p>
>>>>>>> 2c7be9bcce193d7c560451c2d8447e102bb5228d
            ) : (
                <img
                    src={customerData?.profile_picture || "/placeholder.jpg"}
                    alt="Profile"
                    className="profile-image"
                    style={{ borderColor: genderColor.primary }}
                />
            )}
            <button 
                className="camera-button" 
                onClick={pickImage}
                style={{ backgroundColor: genderColor.primary }}
            >📷</button>
            <div className="status-badge">Active</div>
        </div>

<<<<<<< HEAD
        <h2 className="profile-name">{customerData?.name} {customerData?.lastName}</h2>

        <div className="contact-info">
            <div>Email: {customerData?.email}</div>
            <div>Phone: {customerData?.phoneNumber || "Not provided"}</div>
        </div>

        <div className="completeness-container">
            <div className="completeness-title">Profile Completeness</div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{
                        width: `${isProfileComplete().complete
                            ? 100
                            : Math.max(
                                25,
                                Object.values({
                                    name: formData.name,
                                    lastName: formData.lastName,
                                    email: formData.email,
                                    phoneNumber: formData.phoneNumber,
                                }).filter(Boolean).length * 25
                            )
                            }%`,
                        backgroundColor: genderColor.primary
                    }}
                />
            </div>
            {!isProfileComplete().complete && (
                <div className="completeness-warning">
                    Please complete your personal information to enable payment processing
                </div>
            )}
=======
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Customer</h2>
            <form onSubmit={submitEditForm} className="edit-form">
              <label>First Name:
                <input type="text" name="name" value={editFormData.name} onChange={handleEditInputChange} required />
              </label>
              <label>Last Name:
                <input type="text" name="lastname" value={editFormData.lastname} onChange={handleEditInputChange} required />
              </label>
              <label>Email:
                <input type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} required />
              </label>
              <label>Phone Number:
                <input type="text" name="phoneNumber" value={editFormData.phoneNumber} onChange={handleEditInputChange} />
              </label>
              <label>Address:
                <input type="text" name="current_address" value={editFormData.current_address} onChange={handleEditInputChange} />
              </label>
              {editError && <p className="error-text">{editError}</p>}
              <div className="form-buttons">
                <button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
                <button type="button" onClick={() => setShowEditModal(false)} disabled={editLoading}>Cancel</button>
              </div>
            </form>
          </div>
>>>>>>> 2c7be9bcce193d7c560451c2d8447e102bb5228d
        </div>
    </div>
));

const InfoRow = memo(({ label, value }) => (
    <div className="info-row">
        <span className="info-label">{label}:</span>
        <span className="info-value">{value || "Not provided"}</span>
    </div>
));

const FormGroup = memo(({ label, value, onChange, placeholder, type = "text", multiline }) => (
    <div className="form-group">
        <label className="form-label">{label}</label>
        {multiline ? (
            <textarea
                className="form-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        ) : (
            <input
                className="form-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                type={type}
            />
        )}
    </div>
));

const GenderSelector = memo(({ selectedGender, onSelect, genderColor }) => (
    <div className="gender-options">
        {["Male", "Female", "Other"].map((gender) => (
            <button
                key={gender}
                className={`gender-option ${selectedGender === gender ? "selected" : ""}`}
                onClick={() => onSelect(gender)}
                style={selectedGender === gender ? { 
                    backgroundColor: genderColor.primary, 
                    borderColor: genderColor.primary 
                } : {}}
            >
                {gender}
            </button>
        ))}
    </div>
));

const CardButton = memo(({ title, onClick, disabled, genderColor }) => (
    <button 
        className={`card-button ${disabled ? "disabled" : ""}`} 
        onClick={onClick} 
        disabled={disabled}
        style={!disabled ? { backgroundColor: genderColor.primary } : {}}
    >
        {title} →
    </button>
));


const CustomerProfile = ({ navigation }) => {
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [totalCompletedTrips, setTotalCompletedTrips] = useState(0);
    const [customerCode, setCustomerCode] = useState(null);

    const user = useSelector((state) => state.auth?.user);
    const user_id = user?.user_id;
    const username = user?.name;

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        current_address: "",
        gender: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Define color schemes based on gender
    const genderColors = {
        Female: {
            primary: "#ff69b4", // Pink
            secondary: "#ffcce6", // Light pink
            text: "#333333"
        },
        Male: {
            primary: "#3498db", // Blue
            secondary: "#d6eaf8", // Light blue
            text: "#333333"
        },
        Other: {
            primary: "#9b59b6", // Purple
            secondary: "#e8daef", // Light purple
            text: "#333333"
        },
        Default: {
            primary: "#ff69b4", // Default to pink
            secondary: "#ffcce6",
            text: "#333333"
        }
    };

    // Get the appropriate color scheme based on gender
    const getGenderColor = () => {
        const gender = formData.gender || customerData?.gender;
        return genderColors[gender] || genderColors.Default;
    };

    const genderColor = getGenderColor();

    // Logout function
    const handleLogout = async () => {
        try {
            dispatch(setUser(null));
            localStorage.removeItem("reduxState");
            localStorage.removeItem("persist:root");
            
            if (user?.uid) {
                await import("firebase/auth").then(({ getAuth, signOut }) => {
                    const auth = getAuth();
                    signOut(auth);
                });
            }

            showToast("success", "Logged Out", "You have successfully logged out!");
            navigate("/login", { replace: true });
        } catch (err) {
            showToast("error", "Logout Failed", "Failed to log you out. Please try again.");
            console.error("Logout error:", err);
        }
    };

    // Fetch customer data
    useEffect(() => {
        if (!user_id) return;
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${api}customer/${user_id}`);
                setCustomerData(res.data);
                if (res.data.customer_code) setCustomerCode(res.data.customer_code);
                setFormData({
                    name: res.data.name || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                    phoneNumber: res.data.phoneNumber || "",
                    address: res.data.address || "",
                    current_address: res.data.current_address || "",
                    gender: res.data.gender || "",
                });
            } catch (err) {
                showToast("error", "Fetch failed", "Failed to fetch customer details.");
                setError("Failed to fetch customer details.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [user_id]);

    // Fetch total trips
    useEffect(() => {
        if (!user_id) return;
        const fetchTrips = async () => {
            try {
                const res = await axios.get(`${api}tripHistory/${user_id}`, { params: { status: "completed" } });
                setTotalCompletedTrips(res.data.length);
            } catch (err) {
                showToast("error", "Fetch Failed", "We couldn't load your trip history. Please try again later.");
            }
        };
        fetchTrips();
    }, [user_id]);

    // Pick image
    const pickImage = async () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) await uploadProfileImage(file);
        };
        fileInput.click();
    };

    const uploadProfileImage = async (file) => {
        try {
            setUploadingImage(true);
            const storageRef = ref(storage, `profile_pictures/${username}_${user_id}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                null,
                (error) => {
                    showToast("error", "Upload Failed", "Failed to upload profile picture.");
                    setUploadingImage(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    const res = await axios.post(`${api}update-profile-picture`, {
                        profile_picture: downloadURL,
                        user_id,
                    });

                    if (res.status === 200) {
                        setCustomerData((prev) => ({ ...prev, profile_picture: downloadURL }));
                        dispatch(setUser({ ...user, profile_picture: downloadURL }));
                        showToast("success", "Profile Updated", "Profile picture updated successfully!");
                    }
                    setUploadingImage(false);
                }
            );
        } catch (err) {
            showToast("error", "Error", "Something went wrong while uploading the image.");
            setUploadingImage(false);
        }
    };

    const toggleEditMode = () => {
        if (editMode) {
            setFormData({
                name: customerData?.name || "",
                lastName: customerData?.lastName || "",
                email: customerData?.email || "",
                phoneNumber: customerData?.phoneNumber || "",
                address: customerData?.address || "",
                current_address: customerData?.current_address || "",
                gender: customerData?.gender || "",
            });
        }
        setEditMode(!editMode);
    };

    const isProfileComplete = useCallback(() => {
        const requiredFields = { name: formData.name, lastName: formData.lastName, email: formData.email, phoneNumber: formData.phoneNumber };
        const missingFields = Object.entries(requiredFields).filter(([_, value]) => !value).map(([key]) => key);
        return { complete: missingFields.length === 0, missingFields };
    }, [formData]);

    const handleInputChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

    const saveAllChanges = async () => {
        const requiredFields = { name: formData.name, lastName: formData.lastName, email: formData.email, phoneNumber: formData.phoneNumber, address: formData.address, current_address: formData.current_address };
        const missingFields = Object.entries(requiredFields).filter(([_, value]) => !value).map(([key]) => key);
        if (missingFields.length > 0) {
            showToast("info", "Incomplete Information", `Please fill the following fields:\n${missingFields.join(", ")}`);
            return;
        }

        setIsSaving(true);
        try {
            let newCustomerCode = customerCode;
            if (!newCustomerCode) {
                const response = await axios.post(api + "create-customer", {
                    email: formData.email,
                    first_name: formData.name,
                    last_name: formData.lastName,
                    phone: formData.phoneNumber,
                    user_id,
                });
                if (response.status === 200) {
                    newCustomerCode = response.data.data.customer_code;
                    showToast("success", "Customer Created", "Payment profile created successfully!");
                    setCustomerCode(newCustomerCode);
                } else {
                    showToast("error", "Creation Failed", "Failed to create customer.");
                    return;
                }
            }

            const response = await axios.put(api + "update-customer", { ...formData, user_id, customer_code: newCustomerCode });
            if (response.status === 200) {
                setCustomerData({ ...customerData, ...formData, customer_code: newCustomerCode });
                showToast("success", "Profile Updated", "Profile updated successfully!");
                setEditMode(false);
            }
        } catch (err) {
            showToast("error", "Update Failed", "Failed to update profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="customer-profile-container">
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading profile...</div>
                </div>
            )}
            <header className="header">
                <h1>My Profile</h1>
                <button onClick={toggleEditMode}>{editMode ? "✔️" : "✏️"}</button>
            </header>

            <ProfileHeader
                customerData={customerData}
                uploadingImage={uploadingImage}
                pickImage={pickImage}
                formData={formData}
                isProfileComplete={isProfileComplete}
                genderColor={genderColor}
            />

            <div className="card">
                <h3>Personal Information</h3>
                {editMode ? (
                    <>
                        <FormGroup label="First Name" value={formData.name} onChange={(v) => handleInputChange("name", v)} placeholder="Enter first name" />
                        <FormGroup label="Last Name" value={formData.lastName} onChange={(v) => handleInputChange("lastName", v)} placeholder="Enter last name" />
                        <FormGroup label="Email" value={formData.email} onChange={(v) => handleInputChange("email", v)} placeholder="Enter email" type="email" />
                        <FormGroup label="Phone" value={formData.phoneNumber} onChange={(v) => handleInputChange("phoneNumber", v)} placeholder="Enter phone" type="tel" />
                        <div>
                            <label>Gender</label>
                            <GenderSelector selectedGender={formData.gender} onSelect={(v) => handleInputChange("gender", v)} genderColor={genderColor} />
                        </div>
                    </>
                ) : (
                    <>
                        <InfoRow label="First Name" value={customerData?.name} />
                        <InfoRow label="Last Name" value={customerData?.lastName} />
                        <InfoRow label="Email" value={customerData?.email} />
                        <InfoRow label="Phone" value={customerData?.phoneNumber} />
                        <InfoRow label="Gender" value={customerData?.gender} />
                    </>
                )}

                <h3>Address Information</h3>
                {editMode ? (
                    <>
                        <FormGroup label="Permanent Address" value={formData.address} onChange={(v) => handleInputChange("address", v)} placeholder="Enter address" multiline />
                        <FormGroup label="Current Address" value={formData.current_address} onChange={(v) => handleInputChange("current_address", v)} placeholder="Enter current address" multiline />
                    </>
                ) : (
                    <>
                        <InfoRow label="Permanent" value={customerData?.address} />
                        <InfoRow label="Current" value={customerData?.current_address} />
                    </>
                )}

                {editMode && (
                    <button 
                        onClick={saveAllChanges} 
                        disabled={isSaving}
                        style={{ backgroundColor: genderColor.primary }}
                        className="save-button"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                )}
            </div>

            <div className="card">
                <h3>Trip History</h3>
                <div>Total Trips: {totalCompletedTrips}</div>
            </div>
            
            <div className="card logout-card">
                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default CustomerProfile;