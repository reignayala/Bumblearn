import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  completeOnboarding,
  fetchMe,
  getToken,
  login as apiLogin,
  logoutRequest,
  setToken,
  signup as apiSignup,
  updateRoles,
  type AuthUser,
  type RoleChoice,
} from "./api";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    roleChoice: RoleChoice;
  }) => Promise<AuthUser>;
  login: (input: { email: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  finishOnboarding: (payload: {
    bio?: string;
    educator?: AuthUser["educator"];
    learner?: AuthUser["learner"];
  }) => Promise<AuthUser>;
  switchRoles: (roleChoice: RoleChoice) => Promise<AuthUser>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: next } = await fetchMe();
      setUser(next);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refresh,
      async signup(input) {
        const result = await apiSignup(input);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      async login(input) {
        const result = await apiLogin(input);
        setToken(result.token);
        setUser(result.user);
        return result.user;
      },
      async logout() {
        try {
          await logoutRequest();
        } catch {
          // ignore network errors on logout
        }
        setToken(null);
        setUser(null);
      },
      async finishOnboarding(payload) {
        const { user: next } = await completeOnboarding(payload);
        setUser(next);
        return next;
      },
      async switchRoles(roleChoice) {
        const { user: next } = await updateRoles(roleChoice);
        setUser(next);
        return next;
      },
    }),
    [user, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
