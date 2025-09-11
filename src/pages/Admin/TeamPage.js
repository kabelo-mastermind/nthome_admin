"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaDownload } from "react-icons/fa";
import { api } from "../../api";
import toast, { Toaster } from "react-hot-toast";
import "./TeamPage.css";

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
  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 5;

  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

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

  useEffect(() => { fetchAdmins(); }, []);

  const filteredAdmins = admins
    .filter(a => `${a.name} ${a.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a,b)=>{
      const fieldA = a[sortField]?.toLowerCase() || "";
      const fieldB = b[sortField]?.toLowerCase() || "";
      return sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    });

  const paginatedAdmins = filteredAdmins.slice((currentPage-1)*adminsPerPage, currentPage*adminsPerPage);
  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  // Modal handlers
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

  // Actions
  const handleAddSubmit = async e => {
    e.preventDefault();
    try { await axios.post(api + "admins", formData); toast.success("Admin added!"); fetchAdmins(); closeAddModal(); }
    catch { toast.error("Failed to add admin."); }
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try { await axios.put(api + "admins/" + currentAdmin.admin_id, formData); toast.success("Admin updated!"); fetchAdmins(); closeEditModal(); }
    catch { toast.error("Failed to update admin."); }
  };

  const handleDeleteAdmin = async id => {
    if(!window.confirm("Are you sure you want to delete this member?")) return;
    try { await axios.delete(api + "admins/" + id); toast.success("Admin deleted!"); fetchAdmins(); }
    catch { toast.error("Failed to delete admin."); }
  };

  const handleExportCSV = () => { window.open(api + "admins/export/csv"); };

  if (loading) return (
    <div className="loading-state">
      <div className="loading-spinner"></div>
      Loading team...
    </div>
  );

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="admin-rides-page">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="page-header">
        <h1>Team Members</h1>
        <div className="header-actions">
          <button className="export-csv-btn" onClick={handleExportCSV}><FaDownload /> Export CSV</button>
          <button className="filter-toggle" onClick={openAddModal}><FaPlus /> Add Member</button>
        </div>
      </div>

      {/* Filters */}
      <div className="controls-container">
        <div className="search-box">
          <input
            className="search-input"
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters-panel">
          <div className="filter-group">
            <label>Sort Field</label>
            <select className="filter-select" value={sortField} onChange={e=>setSortField(e.target.value)}>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort Order</label>
            <select className="filter-select" value={sortOrder} onChange={e=>setSortOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Cards */}
      <div className="rides-grid">
        {paginatedAdmins.length>0 ? paginatedAdmins.map(admin=>(
          <div className="ride-card" key={admin.admin_id}>
            <div className="card-header">
              <div className="ride-id">{admin.name} {admin.lastName}</div>
            </div>
            <div className="card-content">
              <div className="info-row"><span className="label">Email:</span> <span className="value">{admin.email}</span></div>
              <div className="info-row"><span className="label">Phone:</span> <span className="value">{admin.contacts}</span></div>
              <div className="info-row"><span className="label">Gender:</span> <span className="value">{admin.gender}</span></div>
              <div className="info-row"><span className="label">Address:</span> <span className="value">{admin.address}</span></div>
            </div>
            <div className="card-actions">
              <button className="view-details-btn" onClick={()=>openDetailsModal(admin)}><EyeIcon /> View</button>
              <button className="edit-btn" onClick={()=>openEditModal(admin)}><EditIcon /> Edit</button>
              <button className="delete-btn" onClick={()=>handleDeleteAdmin(admin.admin_id)}><TrashIcon /> Delete</button>
            </div>
          </div>
        )) : <p>No team members found.</p>}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({length: totalPages}, (_,i)=>(
          <button key={i} className={i+1===currentPage?"active":""} onClick={()=>setCurrentPage(i+1)}>{i+1}</button>
        ))}
      </div>

      {/* Details Modal */}
      {detailsModalOpen && currentAdmin && (
        <div className="modal-overlay" onClick={closeDetailsModal}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentAdmin.name} {currentAdmin.lastName}</h2>
              <button className="modal-close" onClick={closeDetailsModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-group">
                  <h3>Contact Info</h3>
                  <div className="detail-item"><span className="detail-label">Email:</span> <span className="detail-value">{currentAdmin.email}</span></div>
                  <div className="detail-item"><span className="detail-label">Phone:</span> <span className="detail-value">{currentAdmin.contacts}</span></div>
                </div>
                <div className="detail-group">
                  <h3>Personal Info</h3>
                  <div className="detail-item"><span className="detail-label">Gender:</span> <span className="detail-value">{currentAdmin.gender}</span></div>
                  <div className="detail-item"><span className="detail-label">Address:</span> <span className="detail-value">{currentAdmin.address}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={closeAddModal}>
          <div className="modal-content edit-modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Team Member</h2>
              <button className="modal-close" onClick={closeAddModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddSubmit}>
                {["name","lastName","email","phoneNumber","gender","address","profile_picture","password"].map(field=>(
                  <div className="form-group" key={field}>
                    <label>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                    <input type={field==="password"?"password":"text"} value={formData[field]} onChange={e=>setFormData({...formData,[field]:e.target.value})} required />
                  </div>
                ))}
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={closeAddModal}>Cancel</button>
                  <button type="submit" className="save-btn">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && currentAdmin && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content edit-modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit {currentAdmin.name}</h2>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                {["name","lastName","email","phoneNumber","gender","address","profile_picture","password"].map(field=>(
                  <div className="form-group" key={field}>
                    <label>{field.charAt(0).toUpperCase()+field.slice(1)}</label>
                    <input type={field==="password"?"password":"text"} value={formData[field]} onChange={e=>setFormData({...formData,[field]:e.target.value})} />
                  </div>
                ))}
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={closeEditModal}>Cancel</button>
                  <button type="submit" className="save-btn">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
