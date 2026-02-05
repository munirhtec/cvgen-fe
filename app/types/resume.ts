export interface ResumeData {
    contact: {
        name: string;
        email: string;
        phone: string;
        location: string;
    };
    summary: string;
    skills: string[];
    experience: {
        title: string;
        company: string;
        duration: string;
        bullets: string[];
    }[];
    education: {
        degree: string;
        school: string;
        year: string;
    }[];
}

export interface Changes {
    modifiedSummary: boolean;
    addedSkills: string[];
    removedSkills: string[];
    modifiedExperience: number;
}

export interface TailoredContent {
    changes: Changes;
    // Add other properties if known, or use index signature if dynamic
    [key: string]: any;
}
