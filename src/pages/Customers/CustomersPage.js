import React, { useState, useEffect } from "react";
import {
  FaHistory,
  FaEdit,
  FaTrash,
  FaArrowLeft,
} from "react-icons/fa";
import "./CustomerPage.css";
import './editpopup.css';


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

  // New state for edit modal & form
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

  // Ride history functions (unchanged)
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

  // Delete customer (unchanged)
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

  // Open edit modal & populate form
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

  // Handle input changes in edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit edited customer data
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: id,
          name,
          lastname,
          email,
          phoneNumber,
          current_address,
        }),
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
        className="search-input"
      />

      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="error-text">Error: {error}</p>
      ) : filteredCustomers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Lastname</th>
                <th>Email</th>
                <th>Contact No</th>
                <th>Address</th>
                <th>Other Actions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, idx) => (
                <tr key={c.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.lastname || "-"}</td>
                  <td>{c.email}</td>
                  <td>{c.phoneNumber || "-"}</td>
                  <td>{c.current_address || "-"}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => openRideHistory(c.id)}
                      title="View Ride History"
                    >
                      <FaHistory />
                    </button>
                  </td>
                  <td>
                    <button
                      className="icon-btn edit-btn"
                      onClick={() => editCustomer(c)}
                      title="Edit Customer"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => deleteCustomer(c.id)}
                      title="Delete Customer"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ride History Modal */}
      {showRideHistory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={closeRideHistory}
              title="Close Ride History"
            >
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

      {/* Edit Customer Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Customer</h2>
            <form onSubmit={submitEditForm} className="edit-form">
              <label>
                First Name:
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastname"
                  value={editFormData.lastname}
                  onChange={handleEditInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditInputChange}
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="current_address"
                  value={editFormData.current_address}
                  onChange={handleEditInputChange}
                />
              </label>

              {editError && <p className="error-text">{editError}</p>}

              <div className="form-buttons">
                <button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
