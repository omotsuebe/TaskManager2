import { User } from "./User";

export interface Task {
    id: string;
    user?: User;
    title: string;
    status: 'incomplete' | 'complete';
    category: 'Frontend' | 'Backend' | 'Documentation' | 'Database' | 'Testing' | 'Deployment'|'General';
    priority: 'low' | 'medium' | 'high';
    created_at?: Date;
    updated_at?: Date;
    canDelete?: boolean;
    canShare?: boolean;
}