"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import "./PushNotifications.css"
import { api } from "../../api"

function PushNotification() {
  const [role, setRole] = useState("customer")
  const [message, setMessage] = useState("")
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const location = useLocation()

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Filter notifications when search query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNotifications(notifications)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = notifications.filter(notification => 
        notification.Message.toLowerCase().includes(query) ||
        notification.MessageTo.toLowerCase().includes(query) ||
        formatDate(notification.DateSent).toLowerCase().includes(query)
      )
      setFilteredNotifications(filtered)
    }
  }, [searchQuery, notifications])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(api+'notifications')
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications)
        setFilteredNotifications(data.notifications)
      } else {
        setError('Failed to fetch notifications')
      }
    } catch (err) {
      setError('Error fetching notifications')
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(api+'send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, message }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message)
        setMessage("")
        // Refresh notifications list
        fetchNotifications()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error sending notification')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="push-notification-page">
      <h1>Push Notifications</h1>
      <p>Send messages to customers or drivers</p>

      <div className="notification-container">
        <div className="send-notification-card">
          <h2>Send Notification</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">Send to:</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="customer">Customers</option>
                <option value="driver">Drivers</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="5"
                placeholder="Type your message here..."
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
          </form>
        </div>

        <div className="notification-history">
          <div className="notification-history-header">
            <h2>Sent Notifications</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          {filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              {notifications.length === 0 ? (
                <p>No notifications sent yet.</p>
              ) : (
                <p>No notifications match your search.</p>
              )}
            </div>
          ) : (
            <div className="notifications-list scrollable">
              {filteredNotifications.map(notification => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-header">
                    <span className="recipient">
                      To: {notification.MessageTo}
                    </span>
                    <span className="date">
                      {formatDate(notification.DateSent)}
                    </span>
                  </div>
                  <div className="notification-message">
                    {notification.Message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PushNotification