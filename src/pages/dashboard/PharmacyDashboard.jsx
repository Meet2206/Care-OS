import { useMemo, useState } from "react"
import { jsPDF } from "jspdf"
import Button from "../../components/common/Button"
import Card from "../../components/common/Card"
import Modal from "../../components/common/Modal"
import PageIntro from "../../components/common/PageIntro"
import PharmacyQueuePanel from "../../components/modules/pharmacy/PharmacyQueuePanel"
import { pharmacyAlerts, pharmacyOrders } from "../../data/mockData"
import { loadQueuedPharmacyOrders, saveQueuedPharmacyOrders } from "../../utils/pharmacyOrders"

function PharmacyDashboard() {
    const initialOrders = useMemo(() => [...loadQueuedPharmacyOrders(), ...pharmacyOrders], [])
    const [orders, setOrders] = useState(initialOrders)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [queueMessage, setQueueMessage] = useState("")

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
        setSelectedOrder((current) => (current?.token === token ? { ...current, status: "Packed" } : current))
        setQueueMessage(`${token} marked as packed and ready for pickup or delivery.`)
    }

    const handleDispense = (token) => {
        updateOrders((current) =>
            current.map((order) => (order.token === token ? { ...order, status: "Dispensed" } : order)),
        )
        setSelectedOrder((current) => (current?.token === token ? { ...current, status: "Dispensed" } : current))
        setQueueMessage(`${token} marked as dispensed.`)
    }

    const downloadReceipt = (order) => {
        if (!order) {
            return
        }

        const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
        pdf.setFillColor(246, 241, 232)
        pdf.rect(0, 0, 595, 842, "F")
        pdf.setFillColor(255, 250, 244)
        pdf.setDrawColor(216, 206, 193)
        pdf.roundedRect(36, 36, 523, 420, 18, 18, "FD")
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(10)
        pdf.setTextColor(110, 116, 111)
        pdf.text("CAREOS PHARMACY RECEIPT", 60, 68)
        pdf.setFont("times", "bold")
        pdf.setFontSize(26)
        pdf.setTextColor(45, 50, 56)
        pdf.text(order.token, 60, 106)
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(12)
        pdf.text(`Patient: ${order.patient}`, 60, 148)
        pdf.text(`Patient ID: ${order.patientId}`, 60, 174)
        pdf.text(`Mode: ${order.mode}`, 60, 200)
        pdf.text(`Status: ${order.status}`, 60, 226)
        pdf.text(`Items: ${order.items}`, 60, 252)
        if (order.doctor) {
            pdf.text(`Prescribed by: ${order.doctor}`, 60, 278)
        }
        if (order.medicines?.length) {
            pdf.setFont("helvetica", "bold")
            pdf.text("Medicines", 60, 318)
            pdf.setFont("helvetica", "normal")
            order.medicines.forEach((item, index) => {
                pdf.text(`${index + 1}. ${item.medicine} - ${item.tablets} tablets - ${item.times}`, 60, 344 + index * 22)
            })
        }
        pdf.save(`${order.token}-pharmacy-receipt.pdf`)
    }

    return (
        <>
        <div className="flex min-h-[500px] flex-col space-y-6 xl:h-[calc(100vh-12rem)]">
            <PageIntro
                className="shrink-0"
                eyebrow="Pharmacy Operations"
                title="Dispense, Pickup, and Delivery"
                description="Track order tokens, process QR-based pickup, and manage partial medicine requests from a single dispensing workspace."
            />

            {queueMessage ? (
                <div className="rounded-2xl border border-[#d4e7d9] bg-[#eef8f0] px-4 py-3 text-sm text-[#4c6a56]">
                    {queueMessage}
                </div>
            ) : null}

            <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.35fr_0.65fr]">
                <PharmacyQueuePanel
                    className="flex min-h-0 flex-col"
                    orders={orders}
                    onPack={handlePack}
                    onDispense={handleDispense}
                    onView={setSelectedOrder}
                />

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

        <Modal
            open={Boolean(selectedOrder)}
            onClose={() => setSelectedOrder(null)}
            title={selectedOrder?.token}
            eyebrow="Pharmacy Order"
            maxWidthClass="max-w-2xl"
        >
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        ["Patient", selectedOrder?.patient],
                        ["Patient ID", selectedOrder?.patientId],
                        ["Mode", selectedOrder?.mode],
                        ["Status", selectedOrder?.status],
                        ["Items", selectedOrder?.items],
                        ["Doctor", selectedOrder?.doctor || "Counter order"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-[var(--panel-muted)] px-4 py-4">
                            <p className="text-xs uppercase tracking-[0.16em]">{label}</p>
                            <p className="mt-2 font-semibold text-[var(--ink)]">{value}</p>
                        </div>
                    ))}
                </div>

                {selectedOrder?.medicines?.length ? (
                    <div className="rounded-2xl bg-[var(--panel-muted)] px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.16em]">Medicines</p>
                        <div className="mt-3 space-y-3">
                            {selectedOrder.medicines.map((item) => (
                                <div key={item.medicine} className="rounded-xl bg-white px-4 py-3">
                                    <p className="font-semibold text-[var(--ink)]">{item.medicine}</p>
                                    <p>{item.tablets} tablets • {item.times}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    {selectedOrder?.status === "Needs packing" ? (
                        <Button variant="subtle" onClick={() => handlePack(selectedOrder.token)}>Mark Packed</Button>
                    ) : selectedOrder?.status !== "Dispensed" ? (
                        <Button variant="subtle" onClick={() => handleDispense(selectedOrder.token)}>Mark Dispensed</Button>
                    ) : null}
                    <Button onClick={() => downloadReceipt(selectedOrder)}>Download Receipt</Button>
                </div>
            </div>
        </Modal>
        </>
    )
}

export default PharmacyDashboard
