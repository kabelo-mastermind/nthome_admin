"use client"

import { useTheme } from "../../contexts/ThemeContext"
import { useEffect, useState } from "react"
import axios from "axios"
import { api } from "../../api"
import SubscriptionTrendsChart from "../../components/SubscriptionTrendsChart"

function AdminHome() {
  const { isDark } = useTheme()

  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [
          totalRidesRes,
          activeDriversRes,
          newCustomersRes,
          newDriversRes,
          revenueSummaryRes,
          subscriptionRes,
        ] = await Promise.all([
          axios.get(api + "count_trips"),
          axios.get(api + "approved_drivers"),
          axios.get(api + "count_customers"),
          axios.get(api + "count_drivers"), // <-- fixed here
          axios.get(api + "payment/summary"),
          axios.get(api + "count_subscriptions"),

        ])
        const feedbackListRes = await axios.get(api + "feedback/recent-with-user");
        setRecentFeedback(feedbackListRes.data);

        setStats([
          {
            title: "Total Rides",
            value: totalRidesRes.data.count,
            description: "All taken trips",
            icon: "🚗",
          },
          {
            title: "Active Drivers",
            value: activeDriversRes.data.count,
            description: "All approved drivers",
            icon: "👥",
          },
          {
            title: "Total Drivers",  // <-- added this new stat
            value: newDriversRes.data.count,
            description: "All registered drivers",
            icon: "🚙",
          },
          {
            title: "Total Customers",
            value: newCustomersRes.data.count,
            description: "All registered customers",
            icon: "⭐",
          },
          {
            title: "Revenue",
            value: `R${Number(revenueSummaryRes.data.totalRevenue).toLocaleString()}`,
            description: "All driver earnings",
            icon: "💰",
          },
          {
            title: "Subscribers",
            value: subscriptionRes.data.uniqueSubscribers,
            description: `${subscriptionRes.data.totalSubscriptions} total subscriptions (including plan changes)`,
            icon: "📦",
          }

        ])
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err)
        setError("Something went wrong while loading dashboard stats.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])



  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-primary)" }}>
        Dashboard Overview
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Welcome to your admin dashboard! Here's what's happening.
      </p>

      {loading ? (
        <p>Loading stats...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "24px",
          }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="dashboard-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 className="card-title">{stat.title}</h3>
                <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
              </div>
              <div className="card-value">{stat.value}</div>
              <p className="card-description">{stat.description}</p>
            </div>
          ))}
        </div>
      )}
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginTop: "40px", marginBottom: "16px" }}>
        Subscription Trends
      </h2>
      <SubscriptionTrendsChart />

      <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "40px" }}>

        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "10px" }}>Recent Feedback</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left", color: "#000" }}>
              <th style={{ padding: "10px" }}>User</th>
              <th style={{ padding: "10px" }}>Email</th>
              <th style={{ padding: "10px" }}>Role</th>
              <th style={{ padding: "10px" }}>Rating</th>
              <th style={{ padding: "10px" }}>Feedback</th>
              <th style={{ padding: "10px" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentFeedback.map((feedback) => (
              <tr key={feedback.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{feedback.name || "N/A"}</td>
                <td style={{ padding: "10px" }}>{feedback.email || "N/A"}</td>
                <td style={{ padding: "10px", textTransform: "capitalize" }}>{feedback.role}</td>
                <td style={{ padding: "10px" }}>{feedback.rating}⭐</td>
                <td style={{ padding: "10px" }}>{feedback.content}</td>
                <td style={{ padding: "10px" }}>{new Date(feedback.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AdminHome
