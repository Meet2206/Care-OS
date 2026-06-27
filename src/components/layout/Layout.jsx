import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

function Layout() {
    return (
        <div className="min-h-screen bg-[var(--shell)] px-4 py-4 text-[var(--ink)] lg:px-5">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1560px] gap-4">
                <Sidebar />
                <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <Topbar />
                    <main className="flex-1 overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#f3fbf7_48%,#edf4fb_100%)] p-6 shadow-[0_18px_50px_rgba(28,46,74,0.07)] lg:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout
