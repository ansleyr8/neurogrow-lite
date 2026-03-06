"use client"

import {useEffect, useMemo, useState} from "react"
import MilestoneCard from "@/components/MilestoneCard"
import type { Milestone, MilestoneCategory } from "@/types/milestone"
import {filterMilestones} from "@/utils/filterMilestones"

const categories: Array<MilestoneCategory | "All"> = ["All", "Cognitive", "Motor", "Social"]

export default function MilestonesPage() {
    const [milestones, setMilestones] = useState<Milestone[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("All")
    const [ageYears, setAgeYears] = useState<string>("")
    const [parsedAge, setParsedAge] = useState<number | undefined>(undefined)
    const [ageError, setAgeError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch("/api/milestones")
                if (!res.ok) throw new Error(`Request failed: ${res.status}`)
                const data: Milestone[] = await res.json()
                setMilestones(data)
            } catch (e) {
                setError(e instanceof Error ? e.message : "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    useEffect(() => {
        const rawAge = ageYears.trim()

        if (!rawAge) {
            setParsedAge(undefined)
            setAgeError(null)
            return
        }

        const ageNumber = Number(rawAge)

        if (Number.isNaN(ageNumber)) {
            setParsedAge(undefined)
            setAgeError("Please enter a valid number.")
            return
        }

        if (ageNumber < 0 || ageNumber > 18) {
            setParsedAge(undefined)
            setAgeError("Please enter an age between 0 and 18 years.")
            return
        }

        setParsedAge(ageNumber)
        setAgeError(null)
    }, [ageYears])
    
    const filtered = useMemo(() => {
        if (ageError) return []

        const result = filterMilestones(
            milestones,
            selectedCategory === "All" ? undefined : selectedCategory,
            parsedAge
        )

        if (parsedAge !== undefined) {
            return [...result].sort((a, b) => b.recommendedAge - a.recommendedAge)
        }

        return result
        }, [milestones, selectedCategory, parsedAge, ageError])

    const resultCountText = `${filtered.length} milestone${filtered.length === 1 ? "" : "s"} found`

    const hasCategoryFilter = selectedCategory !== "All"
    const hasAgeFilter = parsedAge !== undefined

    const activeFiltersText = hasCategoryFilter && hasAgeFilter
        ? `Showing ${selectedCategory} milestones for age \u2264 ${parsedAge} years`
        : hasCategoryFilter
            ? `Showing ${selectedCategory} milestones`
            : hasAgeFilter
                ? `Showing milestones for age \u2264 ${parsedAge} years`
                : null

        return (
            <>
            <a
              href="#milestone-list"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded focus:ring-2 focus:ring-indigo-500"
            >
              Skip to milestone list
            </a>
            <main className="mx-auto max-w-3xl px-4 py-10">
                <header className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Developmental Milestones</h1>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        Browse milestones by category and recommended age.
                    </p>
                </header>

                <section
                    className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    aria-label="Milestone filters"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-900">
                            Category
                        </label>
                        <select
                            id="category"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as (typeof categories)[number])}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-900">
                            Child age (years)
                    </label>
                    <input
                        id="age"
                        type="number"
                        min={0}
                        max={18}
                        step={1}
                        placeholder="e.g. 8"
                        value={ageYears}
                        onChange={(e) => setAgeYears(e.target.value)}
                        className={`mt-1 w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                            ageError
                                ? "border border-red-300 focus:ring-red-500"
                                : "border border-gray-300 focus:ring-indigo-500"
                        }`}
                        aria-invalid={Boolean(ageError)}
                        aria-describedby={ageError ? "age-help age-error" : "age-help"}
                    />
                    <p id ="age-help" className="mt-1 text-xs text-gray-600">
                        Shows milestones with recommended age &le; entered age.
                    </p>
                    {ageError && (
                        <p id="age-error" className="mt-1 text-xs text-red-600">
                            {ageError}
                        </p>
                    )}
                </div>
              </div>
            </section>

            <div aria-live="polite">
                {loading && <p className="text-sm text-gray-700"> Loading milestones...</p>}
                
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                    {error}
                    </div>
                )}
                </div>

            {!loading && !error && (
                <>
                    <div className="mb-4 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
                        <p className="font-medium">{resultCountText}</p>
                        {activeFiltersText && (
                            <p className="mt-1 text-indigo-800">{activeFiltersText}</p>
                        )}
                    </div>

                    <section
                        id="milestone-list"
                        className="space-y-3"
                        aria-label="Milestone list"
                    >
                        {filtered.length === 0 ? (
                            ageError ? (
                                <p className="text-sm text-gray-700"> Enter an age between 0 and 18 years to filter milestones. </p>
                            ) : (
                                <p className="text-sm text-gray-700"> No milestones match your filters. </p>
                            )
                        ) : (
                            filtered.map((m) => <MilestoneCard key={m.id} milestone={m} />)
                        )}
                    </section>
                </>
            )}
        </main>
        </>
    )
}
