export type cardType = { 
    review: string;
    imgPath: string;
    logoPath: string;
    title: string;
    date: string;
    responsibilities: string[];
}


export type AI_Response = {
    section: string;
    answer: string;
}

export type Grant = {
    id: string;
    title: string;
    agency: string;
    agencyCode: string;
    openDate: string;
    closeDate: string;
    link: string;
    score?: string
}














