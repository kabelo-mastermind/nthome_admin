"use client"

import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme, default to 'light'
    const savedTheme = localStorage.getItem("theme")
    return savedTheme || "light"
  })

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem("theme", theme)

    // Apply theme class to document
    document.documentElement.className = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  const value = {
    theme,
    toggleTheme,
    isLight: theme === "light",
    isDark: theme === "dark",
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
