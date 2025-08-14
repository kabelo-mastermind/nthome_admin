"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./VehicleType.css";
import { api } from "../../api";

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
  const [editingId, setEditingId] = useState(null); // track which vehicle is being edited
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`${api}all_car_listing`);
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
    `${v.car_make} ${v.car_model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Start editing a vehicle
  const startEdit = (v) => {
    setEditingId(v.id);
    setEditData({
      number_of_seats: v.number_of_seats,
      car_colour: v.car_colour,
      license_plate: v.license_plate,
      car_image: v.car_image,
      class: v.class
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Update input values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      await axios.put(`${api}car_listing/${id}`, editData);
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...editData } : v));
      cancelEdit();
      alert("Vehicle updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update vehicle.");
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await axios.delete(`${api}car_listing/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
      alert("Vehicle deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete vehicle.");
    }
  };

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="vehicles-page">
      <h1>Vehicles</h1>
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
              <div className="vehicle-card-header">
                <div className="vehicle-card-info">
                  <img
                    src={v.car_image || "/images/placeholder.jpg"}
                    alt={`${v.car_make} ${v.car_model}`}
                    className="vehicle-card-avatar"
                  />
                  <div>
                    <h2 className="vehicle-card-name">{v.car_make} {v.car_model}</h2>
                    <p className="vehicle-card-year">{v.car_year}</p>
                  </div>
                </div>
                <div className="vehicle-card-actions">
                  {editingId === v.id ? (
                    <>
                      <button className="save-btn" onClick={() => saveEdit(v.id)}>Save</button>
                      <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="action-btn" onClick={() => startEdit(v)}><EditIcon /></button>
                      <button className="action-btn delete" onClick={() => handleDeleteVehicle(v.id)}><TrashIcon /></button>
                    </>
                  )}
                </div>
              </div>

              <div className="vehicle-card-section">
                {editingId === v.id ? (
                  <div className="vehicle-card-edit">
                    <label>
                      Seats
                      <input
                        type="number"
                        name="number_of_seats"
                        value={editData.number_of_seats}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Colour
                      <input
                        type="text"
                        name="car_colour"
                        value={editData.car_colour}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      License Plate
                      <input
                        type="text"
                        name="license_plate"
                        value={editData.license_plate}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Car Image URL
                      <input
                        type="text"
                        name="car_image"
                        value={editData.car_image}
                        onChange={handleChange}
                      />
                    </label>
                    <label>
                      Class
                      <input
                        type="number"
                        name="class"
                        value={editData.class}
                        onChange={handleChange}
                      />
                    </label>

                    <div className="edit-buttons">
                      <button className="save-btn" onClick={() => saveEdit(v.id)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p><strong>Seats:</strong> {v.number_of_seats}</p>
                    <p><strong>Colour:</strong> {v.car_colour}</p>
                    <p><strong>License Plate:</strong> {v.license_plate}</p>
                    <p><strong>Class:</strong> {v.class}</p>
                  </>
                )}
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
