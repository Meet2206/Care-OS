import { useState } from "react"
import Button from "../../components/common/Button"
import Card from "../../components/common/Card"
import MetricCard from "../../components/common/MetricCard"
import PageIntro from "../../components/common/PageIntro"
import OperationsPanel from "../../components/modules/admin/OperationsPanel"
import { adminMetrics, adminPanels } from "../../data/mockData"

function AdminDashboard() {
    const [exportMessage, setExportMessage] = useState("")

    const handleExportSummary = () => {
        const report = [
            "CareOS Admin Summary",
            "",
            ...adminMetrics.map((metric) => `${metric.label}: ${metric.value} (${metric.note})`),
            "",
            "Recent System Logs:",
            ...adminPanels.systemLogs.map((log) => `- ${log}`),
        ].join("\n")

        const blob = new Blob([report], { type: "text/plain;charset=utf-8" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = "careos-admin-summary.txt"
        link.click()
        URL.revokeObjectURL(link.href)
        setExportMessage("Admin summary exported as a text file.")
    }

    return (
        <div className="space-y-6">
            <PageIntro
                eyebrow="Quadrant 1"
                title="Overview & System Health"
                description="High-level metrics, operational pressure points, and system visibility shaped for a hospital admin who needs clarity immediately."
                actions={<Button variant="subtle" onClick={handleExportSummary}>Export Summary</Button>}
            />

            {exportMessage ? (
                <div className="rounded-2xl border border-[#d4e7d9] bg-[#eef8f0] px-4 py-3 text-sm text-[#4c6a56]">
                    {exportMessage}
                </div>
            ) : null}

            <div className="grid gap-4 xl:grid-cols-4">
                {adminMetrics.map((metric, index) => (
                    <MetricCard
                        key={metric.label}
                        {...metric}
                        tone={index === 0 ? "blue" : index === 1 ? "green" : index === 2 ? "sky" : "blue"}
                    />
                ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.5fr_0.9fr]">
                <Card className="p-6">
                    <h2 className="font-display text-3xl text-[var(--ink)]">Recent System Logs</h2>
                    <div className="mt-5 space-y-4">
                        {adminPanels.systemLogs.map((log) => (
                            <div key={log} className="rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--muted)]">
                                {log}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-4">
                    <Card className="p-6">
                        <h2 className="font-display text-3xl text-[var(--ink)]">Patients by Ward</h2>
                        <div className="mt-5 space-y-4">
                            {adminPanels.operationalItems.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-2xl bg-[var(--panel-muted)] px-4 py-4">
                                    <span className="text-sm text-[var(--muted)]">{item.label}</span>
                                    <span className="font-display text-3xl text-[var(--ink)]">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h2 className="font-display text-3xl text-[var(--ink)]">Doctors by Specialization</h2>
                        <div className="mt-5 space-y-4">
                            {adminPanels.specialization.map((item) => (
                                <div key={item.label}>
                                    <div className="mb-2 flex items-center justify-between text-sm text-[var(--muted)]">
                                        <span>{item.label}</span>
                                        <span>{item.value}</span>
                                    </div>
                                    <div className="h-3 rounded-full bg-[#e7edf2]">
                                        <div className="h-3 rounded-full bg-[linear-gradient(90deg,#1aa4b7_0%,#8fd1af_100%)]" style={{ width: `${item.value * 2}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <OperationsPanel departments={adminPanels.departments} doctors={adminPanels.doctors} />
        </div>
    )
}

export default AdminDashboard
