export type MilestoneCategory = "Cognitive" | "Motor" | "Social" 

export type Milestone = {
    id: string;
    title: string;
    recommendedAge: number;
    category: MilestoneCategory;
}