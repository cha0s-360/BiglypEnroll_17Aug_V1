// Role guards mirrored from the original App.js route definitions.
export const STAFF = ['super_admin', 'school_admin', 'finance', 'counsellor', 'manager', 'admission', 'legal', 'credit_ops'];
export const CREDIT_STAFF = ['super_admin', 'credit_ops', 'school_admin', 'finance', 'manager', 'counsellor'];
export const CREDIT_VIEW = [...CREDIT_STAFF, 'lender'];
export const ADMIN_ONLY = ['super_admin', 'school_admin'];
export const TEAM_ROLES = ['super_admin', 'school_admin', 'manager'];
export const POLICY_ROLES = ['super_admin', 'credit_ops'];
export const PARENT = ['parent'];
