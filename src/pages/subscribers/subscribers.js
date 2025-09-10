"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Subscribers.css";
import { FaDownload } from "react-icons/fa";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import {
  FaUsers,
  FaCheckCircle,
  FaCalendarWeek,
  FaCalendarAlt,
} from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa"; // ✅ add this at the top
import Swal from "sweetalert2"; // ✅ SweetAlert2 import

// Icons
const EyeIcon = () => (
  <svg
    className="icon"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg
    className="icon"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M15.232 5.232l3.536 3.536M9 13l6-6M3 21h18" />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="icon"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z" />
  </svg>
);
const API_BASE = "https://tech-wise-server-brown.vercel.app/api";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [currentDocs, setCurrentDocs] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const handleViewDocuments = (subscriber) => {
    setSelectedSubscriber(subscriber);
    setShowDocsModal(true);
  };

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/drivers/subscriptions`
        );
        setSubscribers(res.data.drivers || []);
      } catch (err) {
        setError("Failed to load subscriber data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch =
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan =
      filterPlan === "All" || subscriber.plan_name === filterPlan;
    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "active" && subscriber.subscription_status === 1) ||
      (filterStatus === "inactive" && subscriber.subscription_status !== 1);

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const plans = ["All", "Weekly", "Monthly"];
  const statuses = ["All", "active", "inactive"];

  // ✅ Delete Subscriber with SweetAlert
  const handleDeleteSubscriber = async (subscription_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `${API_BASE}/drivers/subscription?id=${subscription_id}`,
            {
              method: "DELETE",
            }
          );

          if (res.ok) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Subscriber has been deleted.",
              confirmButtonColor: "#3085d6",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: "Could not delete subscriber.",
              confirmButtonColor: "#3085d6",
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Something went wrong while deleting.",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    });
  };

  const openDocModal = (subscriber) => {
    setCurrentDocs({
      id: subscriber.user_id,
      name: `${subscriber.name} ${subscriber.lastName}`,
      plan_name: subscriber.plan_name,
      created_at: subscriber.subscription_date || subscriber.created_at,
      subscription_status: subscriber.subscription_status,
      payment_proof: subscriber.payment_proof || null,
    });
    setDocModalOpen(true);
  };

  const closeDocModal = () => {
    setDocModalOpen(false);
    setCurrentDocs(null);
  };

  const downloadSubscriptionDoc = (subscription) => {
    const doc = new jsPDF();

    // === Header ===
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(currentDocs.name + " Reciept", 105, 20, { align: "center" });

    // === Line under header ===
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // === Company/Issuer Info ===
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("NthomeRides", 20, 35);
    doc.text("info@NthomeRides.co.za", 20, 41);
    doc.text("Tel: +27 785 254 1547", 20, 47);

    // === Receipt box ===
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(20, 55, 170, 100); // main box

    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text("Subscription Details", 25, y);
    y += 10;

    // === Subscription Info ===
    doc.setFont("helvetica", "normal");
    doc.text(`Plan: ${subscription.plan_name}`, 25, y);
    y += 10;
    doc.text(
      `Description: ${
        subscription.plan_name?.toLowerCase() === "monthly"
          ? "Every month"
          : "Every week"
      }`,
      25,
      y
    );
    y += 10;
    doc.text(
      `Amount: ${
        subscription.plan_name?.toLowerCase() === "monthly" ? "R1500" : "R400"
      }`,
      25,
      y
    );
    y += 10;
    doc.text(
      `Billing Cycle: ${
        subscription.plan_name?.toLowerCase() === "monthly"
          ? "Monthly"
          : "Weekly"
      }`,
      25,
      y
    );
    y += 10;
    doc.text(
      `Start Date: ${
        subscription.created_at
          ? new Date(subscription.created_at).toLocaleDateString()
          : "N/A"
      }`,
      25,
      y
    );
    y += 10;
    doc.text(`Subscription ID: ${subscription.id || "Not available"}`, 25, y);
    y += 10;
    doc.text(`Payment Details: Pending / Not available`, 25, y);

    // === Footer ===
    doc.setLineWidth(0.5);
    doc.line(20, 165, 190, 165);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your subscription!", 105, 175, {
      align: "center",
    });

    // === Save File ===
    doc.save(`subscription_${subscription.id || "unknown"}.pdf`);

    // ✅ SweetAlert confirmation
    Swal.fire({
      icon: "success",
      title: "Download Ready",
      text: "Subscription document has been generated.",
      confirmButtonColor: "#3085d6",
    });
  };

  // ✅ Export CSV with SweetAlerts
  const exportSubscribersAsCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "No subscriber data to export.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // === Define CSV headers ===
    const headers = [
      "User ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Plan",
      "Status",
      "Subscription Date",
    ];

    // === Build rows ===
    const rows = subscribers.map((s) => [
      s.user_id,
      s.name || "",
      s.lastName || "",
      s.email || "",
      s.phoneNumber || "N/A",
      s.plan_name || "N/A",
      s.subscription_status === 1 ? "Active" : "Inactive",
      s.subscription_date
        ? new Date(s.subscription_date).toLocaleDateString("en-GB")
        : "N/A",
    ]);

    // === Convert to CSV string ===
    const csvArray = [headers, ...rows];
    const csvContent = csvArray
      .map((row) =>
        row
          .map((value) => {
            const str = value.toString().replace(/"/g, '""');
            return str.includes(",") ? `"${str}"` : str;
          })
          .join(",")
      )
      .join("\n");

    // === Trigger download ===
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "subscribers.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "Export Successful",
      text: "Subscribers exported to CSV file.",
      confirmButtonColor: "#3085d6",
    });
  };

  if (loading)
    return <p className="p-6 text-gray-500">Loading subscribers...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="subscribers-page">
      <h1>Subscribers</h1>
      <p className="page-description">
        Manage your driver subscribers and their subscription plans
      </p>

      {/* Stats */}
      <div className="subscribers-stats">
        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <h3>{subscribers.length}</h3>
              <p
                style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}
              >
                Total Subscribers
              </p>
            </div>
            <FaUsers className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <h3>
                {subscribers.filter((s) => s.subscription_status === 1).length}
              </h3>
              <p
                style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}
              >
                Active Subscribers
              </p>
            </div>
            <FaCheckCircle className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <h3>
                {subscribers.filter((s) => s.plan_name === "Weekly").length}
              </h3>
              <p
                style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}
              >
                Weekly Plans
              </p>
            </div>
            <FaCalendarWeek className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <h3>
                {subscribers.filter((s) => s.plan_name === "Monthly").length}
              </h3>
              <p
                style={{ fontWeight: "bold", color: "black", fontSize: "16px" }}
              >
                Monthly Plans
              </p>
            </div>
            <FaCalendarAlt className="stat-icon" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search subscribers..."
          className="subscriber-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-group">
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
          >
            {plans.map((plan) => (
              <option key={plan} value={plan}>
                {plan} Plan
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          className="w3-button w3-white w3-border w3-border-green w3-round-large"
          style={{ height: "40px" }}
          onClick={exportSubscribersAsCSV}
        >
          Export Subscribers (CSV)
        </button>
      </div>

      {/* Subscriber Cards */}
      <div className="subscriber-list-card">
        <div className="subscriber-card-container">
          <div className="subscriber-card-list">
            {filteredSubscribers.length > 0 ? (
              filteredSubscribers.map((s) => (
                <div className="subscriber-card" key={s.user_id}>
                  <div className="subscriber-card-header">
                    <div className="subscriber-card-info">
                      {s.profile_picture ? (
                        <img
                          src={s.profile_picture}
                          alt={s.name}
                          className="subscriber-card-avatar"
                        />
                      ) : (
                        <FaUserCircle className="subscriber-card-icon" />
                      )}
                      <div style={{ backgroundColor: "white" }}>
                        <h2 className="subscriber-card-name">
                          {s.name} {s.lastName}
                        </h2>
                        <p className="subscriber-card-email">{s.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="subscriber-card-section">
                    <p>
                      <strong>Phone:</strong> {s.phoneNumber || "N/A"}
                    </p>
                    <p>
                      <strong>Plan:</strong>
                      <span className={`plan-badge ${s.plan_name?.toLowerCase()}`}>
                        {s.plan_name}
                      </span>
                    </p>
                  </div>

                  <div className="subscriber-card-section">
                    <p>
                      <strong>Status:</strong>
                      <span
                        className={`status-badge ${
                          s.subscription_status === 1
                            ? "status-approved"
                            : "status-pending"
                        }`}
                      >
                        {s.subscription_status === 1 ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>

                  <div className="subscriber-card-section">
                    <p>
                      <strong>Subscription Date:</strong>{" "}
                      {s.subscription_date
                        ? new Date(s.subscription_date).toLocaleDateString("en-GB")
                        : "N/A"}
                    </p>
                  </div>

                  <div className="subscriber-card-section">
                    <button
                      className="document-btn"
                      onClick={() => openDocModal(s)}
                    >
                      <FaDownload />
                      View Subscription
                    </button>
                  </div>

                  <div className="subscriber-card-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleViewDocuments(s)}
                    >
                      <EyeIcon />
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteSubscriber(s.subscription_id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-subscribers">No subscribers found.</p>
            )}
          </div>
        </div>
      </div>

      {showDocsModal && selectedSubscriber &&
     ( <div className="modal-overlay"> <div className="modal"> 
     <h2>Documents for {selectedSubscriber.name}</h2> 
     <div className="doc-list"> {selectedSubscriber.id_copy ? 
     ( <a href={selectedSubscriber.id_copy} target="_blank" rel="noopener noreferrer" className="document-btn" > View ID Copy </a> ) 
     : ( <p>No ID Copy uploaded</p> )} {selectedSubscriber.police_clearance ? 
      ( <a href={selectedSubscriber.police_clearance} target="_blank" rel="noopener noreferrer" className="document-btn" > View Police Clearance </a> ) 
      : ( <p>No Police Clearance uploaded</p> )} {selectedSubscriber.pdp ? ( <a href={selectedSubscriber.pdp} 
        target="_blank" rel="noopener noreferrer" className="document-btn" > View PDP </a> ) : 
        ( <p>No PDF uploaded</p> )} </div> 
        <button className="close-btn" onClick={() => setShowDocsModal(false)}> Close </button> </div> </div> )} 

        {/* Documents Modal */} 
        {docModalOpen && currentDocs && (
           <div className="modal-overlay" onClick={closeDocModal} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} >
             <div className="modal-content" onClick={(e) => e.stopPropagation()} 
             style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", width: "400px", maxWidth: "90%" }}>
             <h3>Subscription for {currentDocs.name}</h3> <ul className="doc-list"> 
              <li> <strong>Plan:</strong> {currentDocs.plan_name} </li> <li> 
                <strong>Description:</strong>{" "} {currentDocs.plan_name?.toLowerCase() === "monthly" ? "Every month" : "Every week"} 
                </li> <li> <strong>Amount:</strong>{" "} {currentDocs.plan_name?.toLowerCase() === "monthly" ? "R1500" : "R400"} </li> 
                <li> <strong>Billing cycle:</strong> {currentDocs.plan_name} </li> 
                <li> <strong>Start date:</strong>{" "} {currentDocs.created_at ? new Date(currentDocs.created_at).toLocaleDateString() : "N/A"} </li> 
                <li> <strong>Subscriber ID:</strong> {currentDocs.id} </li> <li> <strong>Payment details:</strong> Pending / Not available </li> 
                </ul> <button className="modal-download-btn" onClick={() => downloadSubscriptionDoc(currentDocs)} > Download Subscription Document </button>
                 <button className="modal-close-btn" onClick={closeDocModal}> Close </button> </div> </div> )} </div> 
                 
        ); 
                 
       };

export default Subscribers;
