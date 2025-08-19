import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaEnvelope,
  FaPhoneAlt,
  FaAddressBook,
  FaDownload
} from "react-icons/fa";
import "./CustomerPage.css";
import "./editpopup.css";
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
          {filteredCustomers.map((c, idx) => (
            <div className="customer-card" key={c.id || idx}>
              <div className="customer-card-list">
                {filteredCustomers.map((c) => (
                  <div className="customer-card" key={c.id}>
                    {/* Avatar + Name */}
                    <div className="customer-card-header">
                      <img src={c.profile_picture || "/images/placeholder.jpg"} alt={c.name} className="customer-avatar" />
                      <div>
                        <h2>{c.name} {c.lastname}</h2>
                        <p>{c.email}</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="customer-card-body">
                      <p><FaPhoneAlt /> {c.phoneNumber || "-"}</p>
                      <p><FaAddressBook /> {c.current_address || "-"}</p>
                      {/* Optional status badge */}
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-badge ${c.status?.toLowerCase() === "active" ? "status-active" : "status-inactive"
                            }`}
                        >
                          {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Inactive"}
                        </span>
                      </p>



                    </div>

                    {/* Actions */}
                    <div className="customer-card-actions">
                      <button className="customer-card-icons" onClick={() => openRideHistory(c.id)} title="Ride History"><FaHistory /></button>
                      <button className="customer-card-icons" onClick={() => editCustomer(c)} title="Edit"><EditIcon /></button>
                      <button className="customer-card-icons icon-delete" onClick={() => deleteCustomer(c.id)} title="Delete"><TrashIcon /></button>
                    </div>
                  </div>
                ))}
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
            ) : (
              <table className="ride-history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Trip ID</th>
                    <th>Pickup Location</th>
                    <th>Dropoff Location</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tripHistory.map((trip, i) => (
                    <tr key={trip.id || i}>
                      <td>{i + 1}</td>
                      <td>{trip.id}</td>
                      <td>{trip.pickup_location || "-"}</td>
                      <td>{trip.dropoff_location || "-"}</td>
                      <td>{trip.statuses || trip.status || "-"}</td>
                      <td>{trip.trip_date || trip.created_at || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Customer</h2>
            <form onSubmit={submitEditForm} className="edit-form">
              <label>First Name:<input type="text" name="name" value={editFormData.name} onChange={handleEditInputChange} required /></label>
              <label>Last Name:<input type="text" name="lastname" value={editFormData.lastname} onChange={handleEditInputChange} required /></label>
              <label>Email:<input type="email" name="email" value={editFormData.email} onChange={handleEditInputChange} required /></label>
              <label>Phone Number:<input type="text" name="phoneNumber" value={editFormData.phoneNumber} onChange={handleEditInputChange} /></label>
              <label>Address:<input type="text" name="current_address" value={editFormData.current_address} onChange={handleEditInputChange} /></label>
              {editError && <p className="error-text">{editError}</p>}
              <div className="form-buttons">
                <button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save"}</button>
                <button type="button" onClick={() => setShowEditModal(false)} disabled={editLoading}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
