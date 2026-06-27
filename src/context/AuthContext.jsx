/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react"
import { roleOptions } from "../data/mockData"

const AuthContext = createContext(null)

const roleByEmail = Object.values(roleOptions).reduce((accumulator, role) => {
    accumulator[role.email] = role
    return accumulator
}, {})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    const value = useMemo(() => ({
        user,
        login: (email) => {
            const match = roleByEmail[email.trim().toLowerCase()]

            if (!match) {
                return { ok: false, message: "Use admin@careos.com, doctor@careos.com, or patient@careos.com." }
            }

            const nextUser = {
                email: match.email,
                name: match.name,
                role: Object.keys(roleOptions).find((key) => roleOptions[key].email === match.email),
                title: match.title,
                dashboardPath: match.dashboardPath,
            }

            setUser(nextUser)
            return { ok: true, user: nextUser }
        },
        logout: () => setUser(null),
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
