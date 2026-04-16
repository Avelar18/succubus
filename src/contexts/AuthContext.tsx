import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

const USERS_KEY = "succubus-users";
const SESSION_KEY = "succubus-session";

// Admin accounts (in production, these would be server-side)
const ADMIN_EMAILS = ["admin@succubus.com"];
const ADMIN_DEFAULT_PASSWORD = "Admin@2026";

const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "succubus-salt-v1");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const getUsers = (): Array<User & { passwordHash: string }> => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
};

const saveUsers = (users: Array<User & { passwordHash: string }>) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize admin account on first load
  useEffect(() => {
    const init = async () => {
      const users = getUsers();
      const hasAdmin = users.some(u => ADMIN_EMAILS.includes(u.email));
      if (!hasAdmin) {
        const hash = await hashPassword(ADMIN_DEFAULT_PASSWORD);
        users.push({
          id: "admin-001",
          name: "Administrador",
          email: "admin@succubus.com",
          role: "admin",
          createdAt: new Date().toISOString(),
          passwordHash: hash,
        });
        saveUsers(users);
      }

      // Restore session
      const sessionId = localStorage.getItem(SESSION_KEY);
      if (sessionId) {
        const found = users.find(u => u.id === sessionId);
        if (found) {
          const { passwordHash, ...userData } = found;
          setUser(userData);
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getUsers();
    const hash = await hashPassword(password);
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hash);
    if (!found) return { success: false, error: "Email ou senha incorretos" };
    const { passwordHash, ...userData } = found;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, userData.id);
    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (name.trim().length < 2) return { success: false, error: "Nome muito curto" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: "Email inválido" };
    if (password.length < 6) return { success: false, error: "Senha deve ter no mínimo 6 caracteres" };

    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Este email já está cadastrado" };
    }

    const hash = await hashPassword(password);
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: "user" as const,
      createdAt: new Date().toISOString(),
      passwordHash: hash,
    };
    users.push(newUser);
    saveUsers(users);

    const { passwordHash, ...userData } = newUser;
    setUser(userData);
    localStorage.setItem(SESSION_KEY, userData.id);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};
