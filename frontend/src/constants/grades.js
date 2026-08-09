// Supported classes across BiglypEnroll: LKG, UKG, then Class 1 to Class 12.
export const GRADES = ["LKG", "UKG", ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)];

// Short chip label, e.g. "Class 10" -> "C10" (LKG/UKG unchanged).
export const gradeShort = (g = "") => g.replace("Class ", "C");
