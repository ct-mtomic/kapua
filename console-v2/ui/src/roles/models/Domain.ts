interface Domain {
    type: string;
    id: string;
    createdOn: string;
    createdBy: string;
    name: string;
    serviceName: string;
    actions: {
        action: string[];
    };
}