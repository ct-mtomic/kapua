interface Permission {
    type: string;
    id: string;
    scopeId: string;
    createdOn: Date;
    createdBy: string;
    roleId: string;
    permission: {
        domain: string;
    }
}