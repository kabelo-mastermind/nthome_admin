"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./DriversPage.css";
import {
  
  FaDownload
} from "react-icons/fa";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";

// Icons
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


function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
   const [docModalOpen, setDocModalOpen] = useState(false);
  const [currentDocs, setCurrentDocs] = useState(null);
  const navigate = useNavigate();
  

  const handleEditDriver = (users_id) => {
    navigate(`/adminapp/edit-driver/${users_id}`);
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(api + "drivers");
        setDrivers(res.data.rows);
      } catch (err) {
        setError("Failed to load driver data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDocument = (url) => {
    if (url) window.open(url, "_blank");
    else alert("Document not available");
  };

  const handleDeleteDriver = (users_id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      alert(`Delete driver with user ID: ${users_id}`);
    }
  };
  const openDocModal = (driver) => {
    setCurrentDocs({
      id_copy: driver.id_copy,
      driver_license: driver.driver_license,
      police_clearance: driver.police_clearance,
      name: `${driver.name} ${driver.lastName}`,
    });
    setDocModalOpen(true);
  };

  const closeDocModal = () => {
    setDocModalOpen(false);
    setCurrentDocs(null);
  };

  if (loading) return <p className="p-6 text-gray-500">Loading drivers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="drivers-page">
      <h1>Drivers</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search drivers..."
        className="driver-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="driver-card-list">
        {filteredDrivers.length > 0 ? (
          filteredDrivers.map((d) => (
            <div className="driver-card" key={d.users_id}>
              {/* Header */}
              <div className="driver-card-header">
                <div className="driver-card-info">
                  <img
                    src={d.profile_picture || "/images/placeholder.jpg"}
                    alt={d.name}
                    className="driver-card-avatar"
                  />
                  <div>
                    <h2 className="driver-card-name">{d.name} {d.lastName}</h2>
                    <p className="driver-card-customer">{d.customer_code}</p>
                  </div>
                </div>
                
              </div>

              {/* Contact */}
              <div className="driver-card-section">
                <p><strong>Email:</strong> {d.email}</p>
                <p><strong>Phone:</strong> {d.phoneNumber}</p>
              </div>

              {/* Status */}
              <div className="driver-card-section">
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${d.status?.toLowerCase() === "approved" ? "status-approved" : "status-pending"}`}>
                    {d.status}
                  </span>
                </p>
              </div>

             
              {/* Upload date */}
              <div className="driver-card-section">
                <p><strong>Upload Date:</strong> {d.document_upload_time ? new Date(d.document_upload_time).toLocaleDateString("en-GB") : ""}</p>
              </div>

              {/* Documents Button */}
              <div className="driver-card-section">
                <button className="document-btn" onClick={() => openDocModal(d)}>
                  <FaDownload />View Documents
                </button>
              </div>
              {/*actiongs */}
               <div className="driver-card-actions">
                  <button className="action-btn" onClick={() => alert("View")}><EyeIcon /></button>
                  <button className="action-btn" onClick={() => handleEditDriver(d.users_id)}><EditIcon /></button>
                  <button className="action-btn delete" onClick={() => handleDeleteDriver(d.users_id)}><TrashIcon /></button>
                </div>
            </div>
          ))
        ) : (
          <p className="no-drivers">No drivers found.</p>
        )}
      </div>
      {/* Documents Modal */}
      {docModalOpen && currentDocs && (
        <div className="modal-overlay" onClick={closeDocModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Documents for {currentDocs.name}</h3>
            <ul className="doc-list">
              {currentDocs.id_copy ? (
                <li>
                  <button onClick={() => window.open(currentDocs.id_copy, "_blank")}>
                    View ID
                  </button>
                </li>
              ) : (
                <li>ID document not available</li>
              )}

              {currentDocs.driver_license ? (
                <li>
                  <button onClick={() => window.open(currentDocs.driver_license, "_blank")}>
                    View License
                  </button>
                </li>
              ) : (
                <li>Driver license not available</li>
              )}

              {currentDocs.police_clearance ? (
                <li>
                  <button onClick={() => window.open(currentDocs.police_clearance, "_blank")}>
                    View Police Clearance
                  </button>
                </li>
              ) : (
                <li>Police clearance not available</li>
              )}
            </ul>
            <button className="modal-close-btn" onClick={closeDocModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    
  );
}

export default DriversPage;
