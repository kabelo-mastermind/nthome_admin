"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider")
  }
  return context
}

// Dummy data for search functionality
const dummyData = {
  drivers: [
    { id: 1, name: "John Smith", email: "john@example.com", phone: "+1234567890", status: "active", rating: 4.8 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", phone: "+1234567891", status: "active", rating: 4.6 },
    { id: 3, name: "Mike Davis", email: "mike@example.com", phone: "+1234567892", status: "inactive", rating: 4.2 },
    { id: 4, name: "Emily Brown", email: "emily@example.com", phone: "+1234567893", status: "active", rating: 4.9 },
    { id: 5, name: "David Wilson", email: "david@example.com", phone: "+1234567894", status: "suspended", rating: 3.8 },
  ],
  customers: [
    { id: 1, name: "Alice Cooper", email: "alice@example.com", phone: "+1234567895", totalRides: 45, status: "active" },
    { id: 2, name: "Bob Martin", email: "bob@example.com", phone: "+1234567896", totalRides: 23, status: "active" },
    {
      id: 3,
      name: "Carol White",
      email: "carol@example.com",
      phone: "+1234567897",
      totalRides: 67,
      status: "inactive",
    },
    {
      id: 4,
      name: "Daniel Green",
      email: "daniel@example.com",
      phone: "+1234567898",
      totalRides: 12,
      status: "active",
    },
    { id: 5, name: "Eva Black", email: "eva@example.com", phone: "+1234567899", totalRides: 89, status: "active" },
  ],
  rides: [
    {
      id: 1,
      from: "Downtown",
      to: "Airport",
      driver: "John Smith",
      customer: "Alice Cooper",
      status: "completed",
      fare: 25.5,
      date: "2024-01-15",
    },
    {
      id: 2,
      from: "Mall",
      to: "University",
      driver: "Sarah Johnson",
      customer: "Bob Martin",
      status: "ongoing",
      fare: 15.75,
      date: "2024-01-16",
    },
    {
      id: 3,
      from: "Hospital",
      to: "Home",
      driver: "Mike Davis",
      customer: "Carol White",
      status: "cancelled",
      fare: 18.25,
      date: "2024-01-14",
    },
    {
      id: 4,
      from: "Office",
      to: "Restaurant",
      driver: "Emily Brown",
      customer: "Daniel Green",
      status: "completed",
      fare: 12.0,
      date: "2024-01-16",
    },
    {
      id: 5,
      from: "Station",
      to: "Hotel",
      driver: "David Wilson",
      customer: "Eva Black",
      status: "scheduled",
      fare: 22.75,
      date: "2024-01-17",
    },
  ],
  vehicles: [
    { id: 1, type: "Sedan", model: "Toyota Camry", licensePlate: "ABC123", driver: "John Smith", status: "active" },
    { id: 2, type: "SUV", model: "Honda CR-V", licensePlate: "XYZ789", driver: "Sarah Johnson", status: "active" },
    {
      id: 3,
      type: "Hatchback",
      model: "Nissan Versa",
      licensePlate: "DEF456",
      driver: "Mike Davis",
      status: "maintenance",
    },
    { id: 4, type: "Sedan", model: "Hyundai Elantra", licensePlate: "GHI789", driver: "Emily Brown", status: "active" },
    { id: 5, type: "SUV", model: "Ford Escape", licensePlate: "JKL012", driver: "David Wilson", status: "inactive" },
  ],
}

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchCategory, setSearchCategory] = useState("all") // all, drivers, customers, rides, vehicles

  // Perform search
  const performSearch = (query, category = "all") => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Simulate API delay
    setTimeout(() => {
      const results = []
      const lowerQuery = query.toLowerCase()

      // Search in different categories
      if (category === "all" || category === "drivers") {
        const driverResults = dummyData.drivers
          .filter(
            (driver) =>
              driver.name.toLowerCase().includes(lowerQuery) ||
              driver.email.toLowerCase().includes(lowerQuery) ||
              driver.phone.includes(query),
          )
          .map((driver) => ({ ...driver, type: "driver" }))
        results.push(...driverResults)
      }

      if (category === "all" || category === "customers") {
        const customerResults = dummyData.customers
          .filter(
            (customer) =>
              customer.name.toLowerCase().includes(lowerQuery) ||
              customer.email.toLowerCase().includes(lowerQuery) ||
              customer.phone.includes(query),
          )
          .map((customer) => ({ ...customer, type: "customer" }))
        results.push(...customerResults)
      }

      if (category === "all" || category === "rides") {
        const rideResults = dummyData.rides
          .filter(
            (ride) =>
              ride.from.toLowerCase().includes(lowerQuery) ||
              ride.to.toLowerCase().includes(lowerQuery) ||
              ride.driver.toLowerCase().includes(lowerQuery) ||
              ride.customer.toLowerCase().includes(lowerQuery) ||
              ride.status.toLowerCase().includes(lowerQuery),
          )
          .map((ride) => ({ ...ride, type: "ride" }))
        results.push(...rideResults)
      }

      if (category === "all" || category === "vehicles") {
        const vehicleResults = dummyData.vehicles
          .filter(
            (vehicle) =>
              vehicle.type.toLowerCase().includes(lowerQuery) ||
              vehicle.model.toLowerCase().includes(lowerQuery) ||
              vehicle.licensePlate.toLowerCase().includes(lowerQuery) ||
              vehicle.driver.toLowerCase().includes(lowerQuery),
          )
          .map((vehicle) => ({ ...vehicle, type: "vehicle" }))
        results.push(...vehicleResults)
      }

      setSearchResults(results)
      setIsSearching(false)
    }, 300)
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery, searchCategory)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchCategory])

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchCategory,
    setSearchCategory,
    performSearch,
    clearSearch,
    dummyData,
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}
