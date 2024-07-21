interface JournalRequest {
    Params: {
        id: string
    },
    Body: {
        title: string
    }
}


interface NewsRequest {
    Params: {
        id: string
    },
    Query: {
        old?: string;
        popular?: string
        journalId?: string;
    },
    Body: {
        title: string
        text: string
        about: string
        journal_id: string
        preview_path: string
        views: number
    }
}

