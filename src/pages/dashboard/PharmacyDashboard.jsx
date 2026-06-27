import { useMemo, useState } from "react"
import Card from "../../components/common/Card"
import PageIntro from "../../components/common/PageIntro"
import PharmacyQueuePanel from "../../components/modules/pharmacy/PharmacyQueuePanel"
import { pharmacyAlerts, pharmacyOrders } from "../../data/mockData"
import { loadQueuedPharmacyOrders, saveQueuedPharmacyOrders } from "../../utils/pharmacyOrders"

function PharmacyDashboard() {
    const initialOrders = useMemo(() => [...loadQueuedPharmacyOrders(), ...pharmacyOrders], [])
    const [orders, setOrders] = useState(initialOrders)

    const updateOrders = (updater) => {
        setOrders((current) => {
            const next = typeof updater === "function" ? updater(current) : updater
            const queuedOnly = next.filter((order) => order.status === "Needs packing" || order.status === "Packed" || order.doctor)
            saveQueuedPharmacyOrders(queuedOnly.filter((order) => order.doctor))
            return next
        })
    }

    const handlePack = (token) => {
        updateOrders((current) =>
            current.map((order) => (order.token === token ? { ...order, status: "Packed" } : order)),
        )
    }

    const handleDispense = (token) => {
        updateOrders((current) =>
            current.map((order) => (order.token === token ? { ...order, status: "Dispensed" } : order)),
        )
    }

    return (
        <div className="flex h-[calc(100vh-12rem)] min-h-[500px] flex-col space-y-6">
            <PageIntro
                className="shrink-0"
                eyebrow="Pharmacy Operations"
                title="Dispense, Pickup, and Delivery"
                description="Track order tokens, process QR-based pickup, and manage partial medicine requests from a single dispensing workspace."
            />

            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <PharmacyQueuePanel className="flex min-h-0 flex-col" orders={orders} onPack={handlePack} onDispense={handleDispense} />

                <Card className="flex flex-col p-6">
                    <h2 className="shrink-0 font-display text-3xl text-[var(--ink)]">Counter Alerts</h2>
                    <div className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
                        {pharmacyAlerts.map((alert) => (
                            <div key={alert} className="rounded-2xl bg-[var(--panel-muted)] px-4 py-4 text-sm leading-7 text-[var(--muted)]">
                                {alert}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default PharmacyDashboard
