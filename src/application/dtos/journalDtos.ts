interface JournalRequest {
    Query: {
        limit: string,
        offset: string,
    }
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
        limit: string
        offset: string
    },
    Body: {
        title: string
        text: string
        about: string
        journal_id: string
        views: number
    }
}

