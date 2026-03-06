import type {Milestone, MilestoneCategory} from "@/types/milestone"

export function filterMilestones(
    milestones: Milestone[],
    category?: MilestoneCategory,
    age?: number
): Milestone[] {

    return milestones.filter((m) => {
        const categoryMatch = category ? m.category === category : true
        const ageMatch = age !== undefined ? m.recommendedAge <= age : true
        return categoryMatch && ageMatch
    })
}
