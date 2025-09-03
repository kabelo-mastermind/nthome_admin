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
  const [recentFeedback, setRecentFeedback] = useState([])
  const [userCache, setUserCache] = useState({})

  // Fetch user info by ID (driver or customer)
  const fetchUser = async (id) => {
    if (!id) return null
    if (userCache[id]) return userCache[id] // return cached data
    try {
      const res = await axios.get(`${api}customer?id=${id}`)
      const user = res.data
      setUserCache((prev) => ({ ...prev, [id]: user }))
      return user
    } catch (err) {
      console.error(`Failed to fetch user ${id}:`, err)
      return null
    }
  }

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
          axios.get(api + "count_drivers"),
          axios.get(api + "payment/summary"),
          axios.get(api + "count_subscriptions"),
        ])

        // Fetch feedback list
        const feedbackListRes = await axios.get(api + "app/feedbacks")
        const feedbacks = Array.isArray(feedbackListRes.data)
          ? feedbackListRes.data
          : feedbackListRes.data.feedbacks || []

        // Enrich feedbacks with user details
        const enrichedFeedbacks = await Promise.all(
          feedbacks.map(async (fb) => {
            if (!fb.userId) return { ...fb, user: null }
            const user = await fetchUser(fb.userId)
            return { ...fb, user }
          })
        )

        // Save enriched feedbacks
        setRecentFeedback(enrichedFeedbacks)

        // Save stats
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
            title: "Total Drivers",
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
          },
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

  // CSV Export function
  const exportFeedbackToCSV = () => {
    if (!recentFeedback.length) return

    const headers = ["User", "Email", "Role", "Rating", "Feedback", "Date"]
    // Map feedback data rows
    const rows = recentFeedback.map((fb) => [
      fb.user?.name || "N/A",
      fb.user?.email || "N/A",
      fb.role,
      fb.rating,
      fb.content.replace(/(\r\n|\n|\r)/gm, " "), // Remove line breaks for CSV
      new Date(fb.createdAt).toLocaleDateString(),
    ])

    // Build CSV string with proper escaping
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((field) => `"${field.replace(/"/g, '""')}"`) // Escape quotes by doubling them
          .join(",")
      ),
    ].join("\n")

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "feedback.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "var(--text-primary)",
        }}
      >
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
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "600",
          marginTop: "40px",
          marginBottom: "16px",
        }}
      >
        Subscription Trends
      </h2>
      <SubscriptionTrendsChart />
      <div style={{ maxHeight: "400px", overflowY: "auto", marginTop: "40px" }}>
        {/* Flex container for Recent Feedback title and CSV export button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <h2
            style={{ fontSize: "1.5rem", fontWeight: "600", margin: 0 }}
          >
            Recent Feedback
          </h2>
          <button
            onClick={exportFeedbackToCSV}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Export CSV
          </button>
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f2f2f2",
                textAlign: "left",
                color: "#000",
              }}
            >
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
                <td style={{ padding: "10px" }}>
                  {feedback.user?.name || "N/A"}
                </td>
                <td style={{ padding: "10px" }}>
                  {feedback.user?.email || "N/A"}
                </td>
                <td
                  style={{ padding: "10px", textTransform: "capitalize" }}
                >
                  {feedback.role}
                </td>
                <td style={{ padding: "10px" }}>{feedback.rating}⭐</td>
                <td style={{ padding: "10px" }}>{feedback.content}</td>
                <td style={{ padding: "10px" }}>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminHome
