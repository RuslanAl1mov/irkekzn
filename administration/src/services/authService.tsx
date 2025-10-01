import { customGet, customPost, API_DOMAIN } from "../api/http";

export interface User {
  id: number;
  email: string;
  name: string;
  permissions?: string[];
  photo?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

type Listener<T> = (payload: T) => void;

class Emitter<T> {
  #listeners = new Set<Listener<T>>();

  emit(p: T) {
    this.#listeners.forEach((fn) => fn(p));
  }

  subscribe(fn: Listener<T>): () => void {
    this.#listeners.add(fn);
    return () => {
      this.#listeners.delete(fn);
    };
  }
}

class AuthService {
  isAuthenticated = false;
  user: User | null = null;

  #events = new Emitter<AuthState>();
  #ready: Promise<User | null> = Promise.resolve(null);

  constructor() {
    this.#ready = this.checkAuth().catch(() => null);
  }

  onChange(fn: Listener<AuthState>) {
    const unsub = this.#events.subscribe(fn);
    fn({ isAuthenticated: this.isAuthenticated, user: this.user });
    return unsub; // теперь это () => void
  }

  #notify() {
    this.#events.emit({ isAuthenticated: this.isAuthenticated, user: this.user });
  }

  async checkAuth(): Promise<User | null> {
    const res = await customGet(`${API_DOMAIN}/auth/me/`);
    if (!res || !res.ok) {
      this.user = null;
      this.isAuthenticated = false;
      this.#notify();
      throw new Error("not authenticated");
    }

    const data = await res.json();
    this.user = data.result as User;
    this.isAuthenticated = true;
    this.#notify();
    return this.user;
  }

  async login(email: string, password: string): Promise<User | null> {
    const res = await customPost(`${API_DOMAIN}/auth/employee/login/`, {
      email,
      password,
    });
    if (!res.ok) throw new Error("Login failed");
    return this.checkAuth();
  }

  async logout(): Promise<void> {
    await customPost(`${API_DOMAIN}/auth/logout/`, {}); // передаём {}
    this.user = null;
    this.isAuthenticated = false;
    this.#notify();
  }

  ready(): Promise<User | null> {
    return this.#ready;
  }
}

const authService = new AuthService();
export default authService;
