import { useState, useEffect } from "react"
import axios from "axios"
import "./Setting.css"
import { api } from "../../api";

const Setting = () => {
  const [generalInfo, setGeneralInfo] = useState({
    companyName: "",
    supportEmail: "",
    supportPhone: "",
  })

  const [notifications, setNotifications] = useState({
    driverNotifications: false,
    riderNotifications: false,
    promoNotifications: false,
  })

  const [fareSettings, setFareSettings] = useState({
    baseFareBlack: 0,
    baseFareX: 0,
    perKMRateBlack: 0,
    perKMRateX: 0,
    perMonthRate: 0,
    perWeekRate: 0,
    workingHours: 0,
    cancellationFee: 0,
  })

  const [isLoading, setIsLoading] = useState(false)

  // ✅ Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(api+"update_settings")
        const data = res.data

        setGeneralInfo({
          companyName: data.companyName || "",
          supportEmail: data.supportEmail || "",
          supportPhone: data.supportPhone || "",
        })

        setNotifications({
          driverNotifications: Boolean(data.driverNotifications),
          riderNotifications: Boolean(data.riderNotifications),
          promoNotifications: Boolean(data.promoNotifications),
        })

        setFareSettings({
          baseFareBlack: data.baseFareBlack || 0,
          baseFareX: data.baseFareX || 0,
          perKMRateBlack: data.perKMRateBlack || 0,
          perKMRateX: data.perKMRateX || 0,
          perMonthRate: data.perMonthRate || 0,
          perWeekRate: data.perWeekRate || 0,
          workingHours: data.workingHours || 0,
          cancellationFee: data.cancellationFee || 0,
        })
      } catch (error) {
        console.error("❌ Failed to fetch settings:", error)
      }
    }

    fetchSettings()
  }, [])

  // Handlers
  const handleGeneralInfoChange = (e) => {
    const { name, value } = e.target
    setGeneralInfo({ ...generalInfo, [name]: value })
  }

  const handleNotificationsChange = (name) => {
    setNotifications({ ...notifications, [name]: !notifications[name] })
  }

  const handleFareSettingsChange = (e) => {
    const { name, value } = e.target
    setFareSettings({ ...fareSettings, [name]: Number.parseFloat(value) || 0 })
  }

  // ✅ Save settings
  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      await axios.post(api+"update_settings", {
        ...generalInfo,
        ...notifications,
        ...fareSettings,
      })

      alert("✅ Settings updated successfully")
    } catch (error) {
      console.error("❌ Failed to update settings:", error)
      alert("❌ Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Manage your application preferences and configurations</p>
      </div>

      <div className="settings-content">
        {/* General Information Card */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">General Information</h2>
              <p className="card-description">Basic company and contact details</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                value={generalInfo.companyName}
                onChange={handleGeneralInfoChange}
                placeholder="Enter company name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                className="form-input"
                value={generalInfo.supportEmail}
                onChange={handleGeneralInfoChange}
                placeholder="Enter support email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Phone</label>
              <input
                type="text"
                name="supportPhone"
                className="form-input"
                value={generalInfo.supportPhone}
                onChange={handleGeneralInfoChange}
                placeholder="Enter support phone"
              />
            </div>
          </div>
        </div>

        {/* Notifications Card */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">Notification Preferences</h2>
              <p className="card-description">Control which notifications you receive</p>
            </div>
          </div>

          <div className="notification-list">
            <div className="notification-item">
              <div className="notification-info">
                <h3 className="notification-title">Driver Notifications</h3>
                <p className="notification-description">Receive updates about driver activities</p>
              </div>
              <div
                className={`toggle-switch ${notifications.driverNotifications ? "active" : ""}`}
                onClick={() => handleNotificationsChange("driverNotifications")}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3 className="notification-title">Rider Notifications</h3>
                <p className="notification-description">Get notified about rider requests and updates</p>
              </div>
              <div
                className={`toggle-switch ${notifications.riderNotifications ? "active" : ""}`}
                onClick={() => handleNotificationsChange("riderNotifications")}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3 className="notification-title">Promotional Notifications</h3>
                <p className="notification-description">Receive marketing and promotional messages</p>
              </div>
              <div
                className={`toggle-switch ${notifications.promoNotifications ? "active" : ""}`}
                onClick={() => handleNotificationsChange("promoNotifications")}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Fare Settings Card */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h2 className="card-title">Fare Settings</h2>
              <p className="card-description">Configure pricing for different ride types</p>
            </div>
          </div>

          <div className="fare-sections">
            <div className="fare-section">
              <h3 className="section-title">Ride Pricing</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Per KM Rate - Nthome Black (R)</label>
                  <input
                    type="number"
                    name="perKMRateBlack"
                    className="form-input"
                    value={fareSettings.perKMRateBlack}
                    onChange={handleFareSettingsChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Per KM Rate - Nthome X (R)</label>
                  <input
                    type="number"
                    name="perKMRateX"
                    className="form-input"
                    value={fareSettings.perKMRateX}
                    onChange={handleFareSettingsChange}
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Base Fare - Nthome Black (R)</label>
                  <input
                    type="number"
                    name="baseFareBlack"
                    className="form-input"
                    value={fareSettings.baseFareBlack}
                    onChange={handleFareSettingsChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Base Fare - Nthome X (R)</label>
                  <input
                    type="number"
                    name="baseFareX"
                    className="form-input"
                    value={fareSettings.baseFareX}
                    onChange={handleFareSettingsChange}
                  />
                </div>
              </div>
            </div>

            <div className="fare-section">
              <h3 className="section-title">Driver Settings</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Working Hours (Daily)</label>
                  <input
                    type="number"
                    name="workingHours"
                    className="form-input"
                    value={fareSettings.workingHours}
                    onChange={handleFareSettingsChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Per Week Rate (R)</label>
                  <input
                    type="number"
                    name="perWeekRate"
                    className="form-input"
                    value={fareSettings.perWeekRate}
                    onChange={handleFareSettingsChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Per Month Rate (R)</label>
                  <input
                    type="number"
                    name="perMonthRate"
                    className="form-input"
                    value={fareSettings.perMonthRate}
                    onChange={handleFareSettingsChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cancellation Fee (R)</label>
                  <input
                    type="number"
                    name="cancellationFee"
                    className="form-input"
                    value={fareSettings.cancellationFee}
                    onChange={handleFareSettingsChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    {/* Save Button */}
      <div className="settings-footer">
        <button
          className={`save-button ${isLoading ? "loading" : ""}`}
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Saving...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17,21 17,13 7,13 7,21" />
                <polyline points="7,3 7,8 15,8" />
              </svg>
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Setting
