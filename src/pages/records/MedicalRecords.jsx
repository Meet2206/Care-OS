import { useState } from "react"
import Button from "../../components/common/Button"
import Card from "../../components/common/Card"
import Modal from "../../components/common/Modal"
import PageIntro from "../../components/common/PageIntro"
import { medicalRecords } from "../../data/mockData"

function MedicalRecords() {
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [filter, setFilter] = useState("all")

    const visibleRecords = medicalRecords.filter((record) => {
        if (filter === "all") {
            return true
        }

        return record.type.toLowerCase().includes(filter)
    })

    const handleFilter = () => {
        setFilter((current) => {
            if (current === "all") return "consultation"
            if (current === "consultation") return "lab"
            if (current === "lab") return "imaging"
            return "all"
        })
    }

    const filterLabel =
        filter === "all"
            ? "All Records"
            : filter === "consultation"
                ? "Consultation Only"
                : filter === "lab"
                    ? "Lab Results"
                    : "Imaging Only"

    return (
        <>
            <div className="space-y-6">
                <PageIntro
                    eyebrow="Shared Module"
                    title="Medical Records"
                    description="Record summaries are displayed in a clean, accessible table with just enough detail to support a quick clinical read."
                    actions={<Button variant="subtle" onClick={handleFilter}>Filter: {filterLabel}</Button>}
                />

                <Card className="p-6">
                    <div className="overflow-hidden rounded-[24px] border border-[var(--line)]">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[var(--panel-muted)] text-[var(--muted)]">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Date</th>
                                    <th className="px-4 py-3 font-semibold">Record Type</th>
                                    <th className="px-4 py-3 font-semibold">Doctor</th>
                                    <th className="px-4 py-3 font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleRecords.map((record) => (
                                    <tr key={record.id} className="border-t border-[var(--line)] text-[var(--ink)]">
                                        <td className="px-4 py-4">{record.date}</td>
                                        <td className="px-4 py-4">{record.type}</td>
                                        <td className="px-4 py-4 text-[var(--muted)]">{record.doctorFull}</td>
                                        <td className="px-4 py-4">
                                            <Button variant="subtle" className="px-4 py-2" onClick={() => setSelectedRecord(record)}>
                                                View Summary
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {!visibleRecords.length ? (
                                    <tr className="border-t border-[var(--line)] text-[var(--muted)]">
                                        <td colSpan="4" className="px-4 py-6 text-center">No records matched the current filter.</td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Modal open={Boolean(selectedRecord)} onClose={() => setSelectedRecord(null)} title={selectedRecord?.type}>
                <p><strong>Date:</strong> {selectedRecord?.date}</p>
                <p><strong>Author:</strong> {selectedRecord?.doctorFull}</p>
                <p className="mt-4">{selectedRecord?.summary}</p>
            </Modal>
        </>
    )
}

export default MedicalRecords
