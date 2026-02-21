export const USE_MOCK_API = true;

export type Role = "bank_staff" | "compliance";

export interface User {
  username: string;
  role: Role;
  token: string;
}

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
}

export interface StaffResult {
  name: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
}

export interface ComplianceResult {
  recordId: string;
  status: string;
}

const MOCK_CUSTOMERS: Customer[] = [
  { id: "REC-001", name: "Rahul Sharma", accountNumber: "ACC123456", accountType: "Savings", branchCode: "BR-MUM-01" },
  { id: "REC-002", name: "Priya Patel", accountNumber: "ACC789012", accountType: "Current", branchCode: "BR-DEL-03" },
  { id: "REC-003", name: "Amit Kumar", accountNumber: "ACC345678", accountType: "Savings", branchCode: "BR-BLR-02" },
  { id: "REC-004", name: "Sneha Gupta", accountNumber: "ACC901234", accountType: "Fixed Deposit", branchCode: "BR-CHN-01" },
  { id: "REC-005", name: "Vikram Singh", accountNumber: "ACC567890", accountType: "Current", branchCode: "BR-HYD-04" },
  { id: "REC-006", name: "Ananya Reddy", accountNumber: "ACC112233", accountType: "Savings", branchCode: "BR-PUN-02" },
  { id: "REC-007", name: "Rajesh Nair", accountNumber: "ACC445566", accountType: "NRI", branchCode: "BR-KOC-01" },
  { id: "REC-008", name: "Deepa Menon", accountNumber: "ACC778899", accountType: "Savings", branchCode: "BR-MUM-03" },
];

const MOCK_USERS: Record<string, { password: string; role: Role }> = {
  bankstaff1: { password: "bankstaff1", role: "bank_staff" },
  compliance1: { password: "compliance1", role: "compliance" },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(username: string, password: string): Promise<User> {
  await delay(800);
  const user = MOCK_USERS[username];
  if (!user || user.password !== password) {
    throw new Error("Invalid credentials");
  }
  return { username, role: user.role, token: `mock-jwt-${username}-${Date.now()}` };
}

export async function mockSearch(
  query: string,
  role: Role
): Promise<StaffResult[] | ComplianceResult[]> {
  await delay(1000);
  const q = query.toLowerCase();
  const matches = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.accountNumber.toLowerCase().includes(q)
  );

  if (role === "bank_staff") {
    return matches.map((c) => ({
      name: c.name,
      accountNumber: c.accountNumber,
      accountType: c.accountType,
      branchCode: c.branchCode,
    }));
  }

  return matches.map((c) => ({
    recordId: c.id,
    status: "Encrypted match — plaintext hidden",
  }));
}

// Real API placeholders
export async function realLogin(username: string, password: string): Promise<User> {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function realSearch(query: string, token: string): Promise<StaffResult[] | ComplianceResult[]> {
  const res = await fetch("/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function login(username: string, password: string): Promise<User> {
  if (USE_MOCK_API) return mockLogin(username, password);
  return realLogin(username, password);
}

export async function search(query: string, user: User): Promise<StaffResult[] | ComplianceResult[]> {
  if (USE_MOCK_API) return mockSearch(query, user.role);
  return realSearch(query, user.token);
}
