import Card from "../../common/Card"
import StatusPill from "../../common/StatusPill"

function OperationsPanel({ departments, doctors }) {
    return (
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card className="p-6">
                <h2 className="font-display text-3xl text-[var(--ink)]">Department Watch</h2>
                <div className="mt-5 space-y-4">
                    {departments.map((department) => (
                        <div key={department.name} className="flex items-center justify-between rounded-2xl bg-[var(--panel-muted)] px-4 py-4">
                            <div>
                                <p className="font-semibold text-[var(--ink)]">{department.name}</p>
                                <p className="mt-1 text-sm text-[var(--muted)]">{department.doctors} doctors • Queue {department.queue}</p>
                            </div>
                            <StatusPill tone={department.status === "Stable" ? "green" : "amber"}>{department.status}</StatusPill>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6">
                <h2 className="font-display text-3xl text-[var(--ink)]">Doctor Availability</h2>
                <div className="mt-5 space-y-4">
                    {doctors.map((doctor) => (
                        <div key={doctor.name} className="rounded-2xl bg-[var(--panel-muted)] px-4 py-4">
                            <p className="font-semibold text-[var(--ink)]">{doctor.name}</p>
                            <p className="mt-1 text-sm text-[var(--muted)]">{doctor.department}</p>
                            <p className="mt-2 text-sm text-[var(--muted)]">{doctor.mode}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default OperationsPanel
