export default interface Customer {
    CustomerID: number;
    Email: string;
    PhoneNumber: string | null;
    CreatedAt: string; 
    FullName: string;
    Responses?: any; 
    total?: number;
}

