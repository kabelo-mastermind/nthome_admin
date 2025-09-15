import React, { useState, useEffect, useCallback, memo } from "react";
import axios from "axios";
import { api } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../configs/firebase";
// import CustomDrawer from "../components/CustomDrawer";
// import LoadingState from "../components/LoadingState";
import { showToast } from "../../constants/ShowToast";
import "./Profile.css"; // Add a separate CSS file with styles
import { setUser } from "../../contexts/redux/actions/authActions";
import { useNavigate } from "react-router-dom";

// Memoized components
const ProfileHeader = memo(({ customerData, uploadingImage, pickImage, formData, isProfileComplete }) => (
    <div className="profile-header">
        <div className="profile-image-container">
            {uploadingImage ? (
                <div className="uploading-container">Uploading...</div>
            ) : (
                <img
                    src={customerData?.profile_picture || "/placeholder.jpg"}
                    alt="Profile"
                    className="profile-image"
                />
            )}
            <button className="camera-button" onClick={pickImage}>📷</button>
            <div className="status-badges">Active</div>
        </div>

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
                            }%`
                    }}
                />
            </div>
            {!isProfileComplete().complete && (
                <div className="completeness-warning">
                    Please complete your personal information to enable payment processing
                </div>
            )}
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

const GenderSelector = memo(({ selectedGender, onSelect }) => (
    <div className="gender-options">
        {["Male", "Female"].map((gender) => (
            <button
                key={gender}
                className={`gender-option ${selectedGender === gender ? "selected" : ""}`}
                onClick={() => onSelect(gender)}
            >
                {gender}
            </button>
        ))}
    </div>
));

const CardButton = memo(({ title, onClick, disabled }) => (
    <button className={`card-button ${disabled ? "disabled" : ""}`} onClick={onClick} disabled={disabled}>
        {title} →
    </button>
));


const Profile = ({ navigation }) => {
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
    const role = user?.role;
    const gender = user?.gender;
    console.log("User rol---------e:", user);


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

    //   const toggleDrawer = () => setDrawerOpen((prev) => !prev);
    // Logout function
    const handleLogout = async () => {
        try {
            // Clear Redux user state
            dispatch(setUser(null));

            // Clear localStorage / persisted data if you store auth there
            localStorage.removeItem("reduxState"); // adjust key if different
            localStorage.removeItem("persist:root"); // if using redux-persist

            // Optional: Clear Firebase auth persistence
            if (user?.uid) {
                await import("firebase/auth").then(({ getAuth, signOut }) => {
                    const auth = getAuth();
                    signOut(auth);
                });
            }

            showToast("success", "Logged Out", "You have successfully logged out!");

            // Redirect to login or home page
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

            // Create a storage reference
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
                    // Upload completed, get the download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Update profile picture in your backend
                    const res = await axios.post(`${api}update-profile-picture`, {
                        profile_picture: downloadURL,
                        user_id,
                    });

                    if (res.status === 200) {
                        // Update local state
                        setCustomerData((prev) => ({ ...prev, profile_picture: downloadURL }));

                        // Update Redux store with new profile picture URL
                        dispatch(
                            setUser({
                                ...user, // keep existing Redux user fields
                                profile_picture: downloadURL,
                            })
                        );

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
            // Create customer code if missing
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

    //   if (loading) return <LoadingState />;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="customer-profile-container" data-gender={gender}>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <div className="loading-text">Loading profile...</div>
                </div>
            )}
            {/* {drawerOpen && <CustomDrawer isOpen={drawerOpen} toggleDrawer={toggleDrawer} />} */}
            <header className="header">
                {/* <button onClick={toggleDrawer}>☰</button> */}
                <h1>My Profile</h1>
                <button onClick={toggleEditMode}>{editMode ? "✔️" : "✏️"}</button>
            </header>

            <ProfileHeader
                customerData={customerData}
                uploadingImage={uploadingImage}
                pickImage={pickImage}
                formData={formData}
                isProfileComplete={isProfileComplete}
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
                            <GenderSelector selectedGender={formData.gender} onSelect={(v) => handleInputChange("gender", v)} />
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
                        className="save-button"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                )}

            </div>

            <div className="card">
                <h3>Trip History</h3>
                <div>Total Trips: {totalCompletedTrips}</div>
                {/* <CardButton title="View Trip History" onClick={() => navigation.navigate("TripHistory")} /> */}
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

export default Profile;
