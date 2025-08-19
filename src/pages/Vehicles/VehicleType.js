"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./VehicleType.css";
import { api } from "../../api";
import { FaDownload } from "react-icons/fa";

// Icons
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

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${api}get-all-vehicles`);
        setVehicles(res.data.rows);
      } catch (err) {
        setError("Failed to load vehicles.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteVehicle = (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      alert(`Delete vehicle with ID: ${id}`);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Loading vehicles...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="vehicles-page">
      <h1>Vehicles</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search vehicles..."
        className="vehicle-search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="vehicle-card-list">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((v) => (
            <div className="vehicle-card" key={v.id}>
              {/* Header */}
              <div className="vehicle-card-header">
                <div className="vehicle-card-info">
                  <img
                    src={v.image || "/images/placeholder.jpg"}
                    alt={v.name}
                    className="vehicle-card-avatar"
                  />
                  <div>
                    <h2 className="vehicle-card-name">{v.name}</h2>
                    <p className="vehicle-card-customer">{v.description}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="vehicle-card-section">
                <p><strong>Cost/Km:</strong> R {v.costPerKm}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${v.status?.toLowerCase() === "active" ? "status-approved" : "status-pending"}`}>
                    {v.status || "Active"}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="vehicle-card-actions">
                <button className="action-btn"><EditIcon /></button>
                <button className="action-btn delete" onClick={() => handleDeleteVehicle(v.id)}><TrashIcon /></button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-vehicles">No vehicles found.</p>
        )}
      </div>
    </div>
  );
}

export default VehiclesPage;
