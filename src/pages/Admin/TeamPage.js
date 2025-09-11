"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import "./TeamPage.css";
import { FaPlus, FaDownload } from "react-icons/fa";
import { api } from "../../api";
import toast, { Toaster } from "react-hot-toast";

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

export default function TeamPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

  // Sorting
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modals
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    address: "",
    profile_picture: "",
    password: "",
  });

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(api + "admins");
      setAdmins(res.data);
    } catch (err) {
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Search + Sort
  const filteredAdmins = admins
    .filter(a => `${a.name} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortField === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortField === "email") {
        return sortOrder === "asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      }
      return 0;
    });

  // Pagination slice
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * adminsPerPage,
    currentPage * adminsPerPage
  );
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  // ---------- MODAL HANDLERS ----------
  const openDetailsModal = admin => { setCurrentAdmin(admin); setDetailsModalOpen(true); };
  const closeDetailsModal = () => { setCurrentAdmin(null); setDetailsModalOpen(false); };
  const openEditModal = admin => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.contacts,
      gender: admin.gender,
      address: admin.address,
      profile_picture: admin.profile,
      password: "",
    });
    setEditModalOpen(true);
  };
  const closeEditModal = () => { setCurrentAdmin(null); setEditModalOpen(false); setFormData({name:"",lastName:"",email:"",phoneNumber:"",gender:"",address:"",profile_picture:"",password:""}); };
  const openAddModal = () => { setAddModalOpen(true); setFormData({name:"",lastName:"",email:"",phoneNumber:"",gender:"",address:"",profile_picture:"",password:""}); };
  const closeAddModal = () => setAddModalOpen(false);

  // ---------- ACTIONS ----------
  const handleAddSubmit = async e => {
    e.preventDefault();
    try { await axios.post(api + "admins", formData); toast.success("Admin added!"); fetchAdmins(); closeAddModal(); }
    catch (err) { toast.error("Failed to add admin."); }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try { await axios.put(api + "admins/" + currentAdmin.admin_id, formData); toast.success("Admin updated!"); fetchAdmins(); closeEditModal(); }
    catch (err) { toast.error("Failed to update admin."); }
  };

  const handleDeleteAdmin = async id => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try { await axios.delete(api + "admins/" + id); toast.success("Admin deleted!"); fetchAdmins(); }
    catch (err) { toast.error("Failed to delete admin."); }
  };

  const handleExportCSV = () => { window.open(api + "admins/export/csv"); };

  if (loading) return <p className="p-6 text-gray-500">Loading team...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="team-page">
      <Toaster position="top-right" />
      <div className="team-header">
        <h1>Team Members</h1>
        <div className="team-actions">
          <button className="add-btn" onClick={openAddModal}><FaPlus /> Add Member</button>
          <button className="download-btn" onClick={handleExportCSV}><FaDownload /> CSV</button>
        </div>
      </div>

      <div className="team-filters">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={sortField} onChange={e => setSortField(e.target.value)}>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div className="team-card-list">
        {paginatedAdmins.length > 0 ? paginatedAdmins.map(a => (
          <div className="team-card" key={a.admin_id}>
            <div className="team-card-header">
              <div className="team-card-info">
                <img
                  src={a.profile || "/images/placeholder.jpg"}
                  alt={a.name}
                  className="team-card-avatar"
                  title={`${a.name} ${a.lastName}\n${a.email}`}
                />
                <div>
                  <h2>{a.name} {a.lastName}</h2>
                  <p>{a.email}</p>
                </div>
              </div>
            </div>
            <div className="team-card-section">
              <p><strong>Phone:</strong> {a.contacts}</p>
              <p><strong>Gender:</strong> {a.gender}</p>
              <p><strong>Address:</strong> {a.address}</p>
            </div>
            <div className="team-card-actions">
              <button onClick={()=>openDetailsModal(a)}><EyeIcon /></button>
              <button onClick={()=>openEditModal(a)}><EditIcon /></button>
              <button className="delete" onClick={()=>handleDeleteAdmin(a.admin_id)}><TrashIcon /></button>
            </div>
          </div>
        )) : <p>No team members found.</p>}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({length: totalPages}, (_, i) => (
          <button
            key={i}
            className={i+1===currentPage?"active":""}
            onClick={()=>setCurrentPage(i+1)}
          >
            {i+1}
          </button>
        ))}
      </div>

      {/* Modals (Details / Add / Edit) */}
      {detailsModalOpen && currentAdmin && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>{currentAdmin.name} {currentAdmin.lastName}</h3>
            <ul>
              <li>Email: {currentAdmin.email}</li>
              <li>Phone: {currentAdmin.contacts}</li>
              <li>Gender: {currentAdmin.gender}</li>
              <li>Address: {currentAdmin.address}</li>
            </ul>
            <button onClick={closeDetailsModal}>Close</button>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>Add Admin</h3>
            <form onSubmit={handleAddSubmit}>
              <input placeholder="Name" required value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})}/>
              <input placeholder="Last Name" required value={formData.lastName} onChange={e=>setFormData({...formData,lastName:e.target.value})}/>
              <input placeholder="Email" type="email" required value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})}/>
              <input placeholder="Phone" value={formData.phoneNumber} onChange={e=>setFormData({...formData,phoneNumber:e.target.value})}/>
              <input placeholder="Gender" value={formData.gender} onChange={e=>setFormData({...formData,gender:e.target.value})}/>
              <input placeholder="Address" value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})}/>
              <input placeholder="Profile URL" value={formData.profile_picture} onChange={e=>setFormData({...formData,profile_picture:e.target.value})}/>
              <input placeholder="Password" type="password" required value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})}/>
              <button type="submit">Save</button>
            </form>
            <button onClick={closeAddModal}>Close</button>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3>Edit Admin</h3>
            <form onSubmit={handleEditSubmit}>
              <input placeholder="Name" required value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})}/>
              <input placeholder="Last Name" required value={formData.lastName} onChange={e=>setFormData({...formData,lastName:e.target.value})}/>
              <input placeholder="Email" type="email" required value={formData.email} onChange={e=>setFormData({...formData,email:e.target.value})}/>
              <input placeholder="Phone" value={formData.phoneNumber} onChange={e=>setFormData({...formData,phoneNumber:e.target.value})}/>
              <input placeholder="Gender" value={formData.gender} onChange={e=>setFormData({...formData,gender:e.target.value})}/>
              <input placeholder="Address" value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})}/>
              <input placeholder="Profile URL" value={formData.profile_picture} onChange={e=>setFormData({...formData,profile_picture:e.target.value})}/>
              <button type="submit">Update</button>
            </form>
            <button onClick={closeEditModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
