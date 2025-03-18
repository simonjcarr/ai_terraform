"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "data-theme",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remove transition temporarily if disableTransitionOnChange is true
    if (disableTransitionOnChange) {
      root.classList.add("no-transitions")
    }

    // Remove all theme classes/attributes
    root.classList.remove("light", "dark")
    const attributeValues = root.getAttribute(attribute)?.split(" ") || []
    attributeValues.forEach((value) => {
      if (value === "light" || value === "dark") {
        root.removeAttribute(attribute)
      }
    })

    // Apply the new theme
    let appliedTheme = theme
    if (theme === "system" && enableSystem) {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }

    // Apply theme as class or attribute based on the 'attribute' prop
    if (attribute === "class") {
      root.classList.add(appliedTheme)
    } else {
      root.setAttribute(attribute, appliedTheme)
    }

    // Re-enable transitions after theme is applied
    if (disableTransitionOnChange) {
      setTimeout(() => {
        root.classList.remove("no-transitions")
      }, 0)
    }
  }, [theme, attribute, disableTransitionOnChange, enableSystem])

  // Listen for system theme changes if enableSystem is true
  useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        // Force a re-render
        setTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [enableSystem, theme])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
