"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DriversPage.css";
import { api } from "../../api";
import EditDriverForm from "../EditDriver/EditDriverForm";
import { useNavigate } from "react-router-dom"; // ✅ add this

// Replace with your API base URL


// SVG icons for table actions
const EyeIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const EditIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M15.232 5.232l3.536 3.536M9 13l6-6M3 21h18" />
  </svg>
);
const TrashIcon = () => (
  <svg className="icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" />
  </svg>
);

function StatusBadge({ status }) {
  if (!status) return null;
  return (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );
}

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("driver");
  const [carDetails, setCarDetails] = useState([]);
  const [editDriverId, setEditDriverId] = useState(null);

  const navigate = useNavigate();

  const handleEditDriver = (users_id) => {
    navigate(`/adminapp/edit-driver/${users_id}`); // ✅ Redirect to correct nested route
  };

  const handleCloseEdit = () => setEditDriverId(null);
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(api + "drivers");
        setDrivers(res.data);
      } catch (err) {
        setError("Failed to load driver data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const handleViewDocument = (url) => {
    if (url) window.open(url, "_blank");
    else alert("Document not available");
  };

  // const handleEditDriver = (users_id) => {
  //   alert(`Edit driver with user ID: ${users_id}`);
  // };

  const handleDeleteDriver = (users_id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      alert(`Delete driver with user ID: ${users_id}`);
    }
  };

  // Modal handlers
  const handleViewDriver = async (driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
    setSelectedTab("driver");

    try {
      const res = await axios.get(`${api}car_listing/user/${driver.users_id}`);
      setCarDetails(res.data.carListings || []);
    } catch (error) {
      console.error("Failed to fetch car details", error);
      setCarDetails([]);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDriver(null);
  };

  const downloadCSV = () => {
    if (drivers.length === 0) return;

    const headers = [
      "Name", "Last Name", "Email", "Phone", "Gender", "Role",
      "Customer Code", "User UID", "Address", "Current Address",
      "Status", "State", "Upload Date"
    ];

    const rows = drivers.map(d =>
      [
        d.name, d.lastName, d.email, d.phoneNumber, d.gender, d.role,
        d.customer_code, d.user_uid, d.address, d.current_address,
        d.status, d.state,
        d.document_upload_time ? new Date(d.document_upload_time).toLocaleDateString("en-GB") : ""
      ]
    );

    const csvContent = [
      headers.join(","),               // first line: headers
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")) // quote each cell
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "drivers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (loading) return <p className="p-6 text-gray-500">Loading drivers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="driver-table-container">
      <h1 className="driver-table-title">Driver Management Dashboard</h1>

      <p className="driver-table-subtitle">
        The Management System. Here, you can view, edit, and manage all registered drivers' personal information and uploaded documents. Use the actions on the right to review, update, or remove driver details as needed.
      </p>

      <div className="driver-table-scroll">
        <table className="driver-table">
          <thead>
            <tr>
              <th>Driver Info</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Documents</th>
              <th>Upload Date</th>
              <th>Actions</th>
              <button className="download-btn" onClick={downloadCSV}>
                ⬇️ Download CSV
              </button>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.users_id}>
                <td>
                  <div className="driver-info">
                    <img
                      src={d.profile_picture || "/images/placeholder.jpg"}
                      alt={d.name}
                      className="driver-avatar"
                    />
                    <div>
                      <span className="driver-name">{d.name} {d.lastName}</span>
                      <span className="driver-customer-id">{d.customer_code}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="driver-contact-email">{d.email}</span>
                  <span className="driver-contact-phone">{d.phoneNumber}</span>
                </td>
                <td>
                  {/* <StatusBadge status={d.status} /> */}
                  <span className="status-sub">{d.status}</span>
                </td>
                <td>
                  <div className="documents-list">
                    <button className="document-btn" onClick={() => handleViewDocument(d.id_copy)}>
                      <span className="document-icon">📄</span> ID
                    </button>
                    <button className="document-btn" onClick={() => handleViewDocument(d.driver_license)}>
                      <span className="document-icon">📄</span> License
                    </button>
                    <button className="document-btn" onClick={() => handleViewDocument(d.police_clearance)}>
                      <span className="document-icon">📄</span> Police
                    </button>
                  </div>
                </td>
                <td>
                  <span className="upload-date">
                    {d.document_upload_time ? new Date(d.document_upload_time).toLocaleDateString("en-GB") : ""}
                  </span>
                </td>
                <td>
                  <div className="actions-list">
                    <button className="action-btn" title="View" onClick={() => handleViewDriver(d)}>
                      <EyeIcon />
                    </button>
                    <button className="action-btn" title="Edit" onClick={() => handleEditDriver(d.users_id)}>
                      <EditIcon />
                    </button>
                    <button className="action-btn delete" title="Delete" onClick={() => handleDeleteDriver(d.users_id)}>
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#9ca3af" }}>
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal for viewing driver details */}
      {showModal && selectedDriver && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2 className="modal-title">Driver Details</h2>

            <div className="modal-tabs">
              <button
                className={selectedTab === "driver" ? "tab-active" : ""}
                onClick={() => setSelectedTab("driver")}
              >
                Driver Info
              </button>
              <button
                className={selectedTab === "car" ? "tab-active" : ""}
                onClick={() => setSelectedTab("car")}
              >
                Car Details
              </button>
            </div>

            {selectedTab === "driver" && (
              <div className="modal-details">
                <img
                  src={selectedDriver.profile_picture || "/placeholder-avatar.png"}
                  alt={selectedDriver.name}
                  className="modal-avatar"
                />
                <div>
                  <div><strong>Name:</strong> {selectedDriver.name} {selectedDriver.lastName}</div>
                  <div><strong>Email:</strong> {selectedDriver.email}</div>
                  <div><strong>Phone:</strong> {selectedDriver.phoneNumber}</div>
                  <div><strong>Gender:</strong> {selectedDriver.gender}</div>
                  <div><strong>Role:</strong> {selectedDriver.role}</div>
                  <div><strong>Customer Code:</strong> {selectedDriver.customer_code}</div>
                  <div><strong>User UID:</strong> {selectedDriver.user_uid}</div>
                  <div><strong>Address:</strong> {selectedDriver.address}</div>
                  <div><strong>Current Address:</strong> {selectedDriver.current_address}</div>
                  <div><strong>Status:</strong> {selectedDriver.status}</div>
                  <div><strong>State:</strong> {selectedDriver.state}</div>
                  <div><strong>Document Upload Time:</strong> {selectedDriver.document_upload_time ? new Date(selectedDriver.document_upload_time).toLocaleDateString("en-GB") : ""}</div>
                  <div><strong>ID Copy:</strong> <a href={selectedDriver.id_copy} target="_blank" rel="noopener noreferrer">View</a></div>
                  <div><strong>Driver License:</strong> <a href={selectedDriver.driver_license} target="_blank" rel="noopener noreferrer">View</a></div>
                  <div><strong>Police Clearance:</strong> <a href={selectedDriver.police_clearance} target="_blank" rel="noopener noreferrer">View</a></div>
                  <div><strong>PDP:</strong> <a href={selectedDriver.pdp} target="_blank" rel="noopener noreferrer">View</a></div>
                  <div><strong>Car Inspection:</strong> <a href={selectedDriver.car_inspection} target="_blank" rel="noopener noreferrer">View</a></div>
                </div>
              </div>
            )}

            {selectedTab === "car" && (
              <div className="modal-details">
                {carDetails.length > 0 ? (
                  carDetails.map((car, index) => (
                    <div key={index} className="car-card">
                      <img
                        src={car.car_image || "/placeholder-car.png"}
                        alt="Car"
                        className="car-image"
                      />
                      <p><strong>Class:</strong> {car.class === 1 ? "nthome_black" : car.class === 2 ? "nthome_x" : "Unknown"}</p>
                      <p><strong>Make:</strong> {car.car_make}</p>
                      <p><strong>Model:</strong> {car.car_model}</p>
                      <p><strong>Year:</strong> {car.car_year}</p>
                      <p><strong>Seats:</strong> {car.number_of_seats}</p>
                      <p><strong>Color:</strong> {car.car_colour}</p>
                      <p><strong>License Plate:</strong> {car.license_plate}</p>
                    </div>
                  ))
                ) : (
                  <p>No car details found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {editDriverId && (
        <EditDriverForm
          driverId={editDriverId}
          onClose={handleCloseEdit}
          onSave={() => {/* reload drivers if needed */ }}
        />
      )}
    </div>
  );
}

export default DriversPage;
