import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { auth, db } from "../../configs/FirebaseConfig";
import { storage } from "../../configs/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { api } from "../../api";
import { setUser } from "../../contexts/redux/actions/authActions";
import { showToast } from "../../constants/ShowToast";

import "./DriverProfile.css"; // You'll need to create corresponding CSS

const DriverProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const user_id = user?.user_id;

  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    current_address: "",
    gender: "",
  });
  const [firestoreData, setFirestoreData] = useState({ name: "", email: "", gender: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldValue, setFieldValue] = useState("");

  const [trips, setTrips] = useState([]);
  const [totalCompletedTrips, setTotalCompletedTrips] = useState(0);

  // Fetch user data
  useEffect(() => {
    if (!user_id) return;

    const fetchFirestoreUser = async () => {
      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;

        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirestoreData({
            name: data.name || "",
            email: data.email || "",
            gender: data.gender || "",
          });
        } else {
          showToast("info", "No Data", "No data found for this user.");
        }
      } catch (err) {
        showToast("error", "Network Error", "Failed to fetch user data.");
      }
    };

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${api}customer/${user_id}`);
        setCustomerData(res.data);
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
        setError("Failed to fetch user details.");
        showToast("error", "Fetch Error", "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFirestoreUser();
    fetchCustomer();
  }, [user_id]);

  // Fetch trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(`${api}tripHistory/${user_id}`, { params: { status: "completed" } });
        setTrips(res.data);
        setTotalCompletedTrips(res.data.length);
      } catch (err) {
        showToast("error", "Fetch Failed", "Failed to load trip history.");
      }
    };
    if (user_id) fetchTrips();
  }, [user_id]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = () => setEditMode(!editMode);

  const saveAllChanges = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put(`${api}update-customer`, { ...formData, user_id });
      if (response.status === 200) {
        setCustomerData((prev) => ({ ...prev, ...formData }));
        setEditMode(false);
        showToast("success", "Profile Updated", "Profile updated successfully!");
      } else {
        showToast("error", "Update Failed", "Failed to update profile.");
      }

      // Update Firestore if needed
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const updates = {};
        if (formData.name !== firestoreData.name) updates.name = formData.name;
        if (formData.email !== firestoreData.email) updates.email = formData.email;
        if (formData.gender !== firestoreData.gender) updates.gender = formData.gender;

        if (Object.keys(updates).length > 0) {
          await updateDoc(userRef, updates);
          setFirestoreData((prev) => ({ ...prev, ...updates }));
        }
      }
    } catch (error) {
      showToast("error", "Update Failed", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async (event) => {
    const file = event.target.files[0];
    if (file) uploadProfileImage(file);
  };

  const uploadProfileImage = async (file) => {
    try {
      setUploadingImage(true);
      const filename = `${user?.name}_${user_id}_${file.name}`;
      const storageRef = ref(storage, `profile_pictures/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (err) => {
          showToast("error", "Upload Failed", "Failed to upload profile picture.");
          setUploadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await axios.post(`${api}update-profile-picture`, { profile_picture: downloadURL, user_id });
          setCustomerData((prev) => ({ ...prev, profile_picture: downloadURL }));
          dispatch(setUser({ ...user, profile_picture: downloadURL }));
          await updateProfile(auth.currentUser, { photoURL: downloadURL });
          setUploadingImage(false);
          showToast("success", "Profile Updated", "Profile picture updated successfully!");
        }
      );
    } catch (err) {
      setUploadingImage(false);
      showToast("error", "Upload Failed", "Something went wrong.");
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="driver-profile-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        <button onClick={toggleEditMode}>{editMode ? "Save" : "Edit"}</button>
      </div>

      <div className="profile-image-section">
        <img
          src={customerData?.profile_picture || "/assets/placeholder.jpg"}
          alt="Profile"
          className="profile-image"
        />
        <input type="file" onChange={pickImage} />
        {uploadingImage && <span>Uploading...</span>}
      </div>

      <div className="profile-info">
        <label>First Name</label>
        {editMode ? (
          <input value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
        ) : (
          <p>{customerData?.name}</p>
        )}

        <label>Last Name</label>
        {editMode ? (
          <input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
        ) : (
          <p>{customerData?.lastName}</p>
        )}

        <label>Email</label>
        {editMode ? (
          <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
        ) : (
          <p>{customerData?.email}</p>
        )}

        <label>Phone Number</label>
        {editMode ? (
          <input value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} />
        ) : (
          <p>{customerData?.phoneNumber}</p>
        )}

        <label>Gender</label>
        {editMode ? (
          <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : (
          <p>{customerData?.gender}</p>
        )}

        {editMode && <button onClick={saveAllChanges} disabled={isSaving}>Save Changes</button>}
      </div>

      <div className="trip-history">
        <h3>Total Completed Trips: {totalCompletedTrips}</h3>
      </div>
    </div>
  );
};

export default DriverProfile;
