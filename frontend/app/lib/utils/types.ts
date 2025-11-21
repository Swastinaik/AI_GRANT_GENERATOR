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

export type GrantType = {
    id: string;
    title: string;
    agency: string;
    agencyCode: string;
    openDate: string;
    closeDate: string;
    link: string;
    score?: string
}


export interface DownloadProps {
    file?: Blob | null
    fileName?: string | null
}












