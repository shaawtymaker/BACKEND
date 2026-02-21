import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, User, AlertCircle } from "lucide-react";

const LoginView = () => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
    } catch {}
  };

  const quickLogin = async (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    try {
      await login(u, p);
    } catch {}
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6 glow-primary"
          >
            <Lock className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">
            SecureBank Search
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
            Privacy-preserving customer lookup via searchable encryption
          </p>
        </div>

        {/* Form */}
        <div className="glass rounded-xl p-6 space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 input-glow focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-foreground text-sm placeholder:text-muted-foreground/50 input-glow focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm btn-glow disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Quick Demo</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Quick login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => quickLogin("teller1", "teller1")}
              disabled={isLoading}
              className="py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-colors duration-200 disabled:opacity-40"
            >
              Login as Teller
            </button>
            <button
              onClick={() => quickLogin("auditor1", "auditor1")}
              disabled={isLoading}
              className="py-2 rounded-lg border border-secondary/30 text-secondary text-sm font-medium hover:bg-secondary/10 transition-colors duration-200 disabled:opacity-40"
            >
              Login as Auditor
            </button>
          </div>

          <p className="text-xs text-muted-foreground/60 text-center font-mono">
            Demo: teller1/teller1 · auditor1/auditor1
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;
