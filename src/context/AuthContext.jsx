/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react"
import { roleOptions } from "../data/mockData"

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = "careos-demo-user"

const roleByEmail = Object.values(roleOptions).reduce((accumulator, role) => {
    accumulator[role.email] = role
    return accumulator
}, {})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        if (typeof window === "undefined") {
            return null
        }

        try {
            const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
            return stored ? JSON.parse(stored) : null
        } catch {
            return null
        }
    })

    const persistUser = (nextUser) => {
        setUser(nextUser)

        if (typeof window !== "undefined") {
            if (nextUser) {
                window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
            } else {
                window.localStorage.removeItem(AUTH_STORAGE_KEY)
            }
        }
    }

    const value = useMemo(() => ({
        user,
        login: (email) => {
            const match = roleByEmail[email.trim().toLowerCase()]

            if (!match) {
                return { ok: false, message: "Use admin@careos.com, doctor@careos.com, patient@careos.com, or pharmacy@careos.com." }
            }

            const nextUser = {
                email: match.email,
                name: match.name,
                role: Object.keys(roleOptions).find((key) => roleOptions[key].email === match.email),
                title: match.title,
                dashboardPath: match.dashboardPath,
            }

            persistUser(nextUser)
            return { ok: true, user: nextUser }
        },
        logout: () => persistUser(null),
    }), [user])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    return context
}
