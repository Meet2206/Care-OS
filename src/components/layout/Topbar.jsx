import { useState, useRef, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const titles = {
    "/admin": "Admin Dashboard",
    "/doctor": "Doctor Dashboard",
    "/patient": "Patient Dashboard",
    "/pharmacy": "Pharmacy Dashboard",
    "/records": "Medical Records",
    "/ai": "CareAI",
}

function Topbar() {
    const location = useLocation()
    const { user, logout } = useAuth()
    const [showAlerts, setShowAlerts] = useState(false)
    const panelRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                panelRef.current && !panelRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)
            ) {
                setShowAlerts(false)
            }
        }
        if (showAlerts) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showAlerts])

    const alerts = [
        "2 pending lab reviews need confirmation.",
        "1 appointment was rescheduled in Clinic B.",
        "System sync completed successfully at 07:37 PM.",
    ]

    return (
        <header className="relative flex min-h-[76px] items-center justify-between rounded-[30px] border border-white/70 bg-white/88 px-6 shadow-[0_12px_30px_rgba(28,46,74,0.06)]">
            <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Shared Login Page</p>
                <h1 className="mt-2 font-display text-[30px] leading-none text-[var(--ink)]">
                    {titles[location.pathname] ?? "CareOS"}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => setShowAlerts((current) => !current)}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel-muted)] text-[var(--muted)]"
                    aria-label="Toggle alerts"
                >
                    <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#f46d61]" />
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
                        <path d="M10.2 19a2 2 0 0 0 3.6 0" />
                    </svg>
                </button>

                <div className="flex items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#c7def5_0%,#e4f3e5_100%)] text-sm font-semibold text-[var(--ink)]">
                        {user?.name?.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{user?.name}</p>
                        <p className="text-xs text-[var(--muted)]">{user?.title}</p>
                    </div>
                    <button type="button" onClick={logout} className="pl-4 text-sm font-semibold text-[var(--muted)]">
                        Logout
                    </button>
                </div>
            </div>

            {showAlerts ? (
                <div ref={panelRef} className="absolute right-6 top-[88px] z-20 w-[340px] rounded-[24px] border border-white/80 bg-white/96 p-4 shadow-[0_18px_50px_rgba(28,46,74,0.14)]">
                    <div className="flex items-center justify-between">
                        <p className="font-display text-2xl text-[var(--ink)]">Alerts</p>
                        <button type="button" onClick={() => setShowAlerts(false)} className="text-sm font-semibold text-[var(--muted)]">
                            Close
                        </button>
                    </div>
                    <div className="mt-4 space-y-3">
                        {alerts.map((alert) => (
                            <div key={alert} className="rounded-2xl bg-[var(--panel-muted)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                                {alert}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </header>
    )
}

export default Topbar
