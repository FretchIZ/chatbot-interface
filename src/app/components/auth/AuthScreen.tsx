import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ArrowRight, Shield, Eye, EyeOff } from "lucide-react";
import type { AuthUser } from "../../types";

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill="#1877F2"/>
      <path d="M16.5 12H14V10c0-.55.45-1 1-1h1.5V6.5H14c-1.93 0-3.5 1.57-3.5 3.5v2H8.5v3H10.5v7.5h3V15h2l.5-3z" fill="white"/>
    </svg>
  );
}

function SocialButton({
  icon, label, loading, disabled, onClick, style,
}: {
  icon: React.ReactNode; label: string; loading: boolean; disabled: boolean;
  onClick: () => void; style: React.CSSProperties;
}) {
  return (
    <motion.button
      onClick={onClick} disabled={disabled}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium text-foreground/80 hover:text-foreground hover:brightness-125 transition-all disabled:cursor-not-allowed disabled:opacity-70"
      style={style}
      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
    >
      {loading ? (
        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
      ) : icon}
      <span>{loading ? "Signing in…" : label}</span>
    </motion.button>
  );
}

export function AuthScreen({ onAuth }: { onAuth: (user: AuthUser) => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const simulateAuth = (provider: AuthUser["provider"], name: string, email: string, avatar: string) => {
    setLoading(provider);
    setError("");
    setTimeout(() => {
      setLoading(null);
      onAuth({ name, email, avatar, provider });
    }, 1400);
  };

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    simulateAuth("email", email.split("@")[0], email, "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#0e0e0f" }}
    >
      <div className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(217,119,87,0.10) 0%, transparent 65%)" }} />

      <motion.div
        className="relative w-full max-w-[400px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="rounded-3xl border border-white/8 px-8 py-10"
          style={{ background: "linear-gradient(160deg, #161618 0%, #111113 100%)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          <motion.div className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          >
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-150" />
              <motion.div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center"
                animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={24} className="text-primary" />
              </motion.div>
            </div>
            <AnimatePresence mode="wait">
              <motion.h1 key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="text-2xl font-light text-foreground leading-tight mb-1"
                style={{ fontFamily: "'DM Serif Display', serif", letterSpacing: "-0.02em" }}
              >
                {mode === "login" ? "Welcome back" : "Create account"}
              </motion.h1>
            </AnimatePresence>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Sign in to continue to Agent" : "Start your free conversation today"}
            </p>
          </motion.div>

          <motion.div className="space-y-2.5 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <SocialButton icon={<GoogleIcon size={17} />} label="Continue with Google"
              loading={loading === "google"} disabled={!!loading}
              onClick={() => simulateAuth("google", "Alex Chen", "alex.chen@gmail.com", "AC")}
              style={{ background: loading === "google" ? "rgba(66,133,244,0.12)" : "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
            />
            <SocialButton icon={<FacebookIcon size={17} />} label="Continue with Facebook"
              loading={loading === "facebook"} disabled={!!loading}
              onClick={() => simulateAuth("facebook", "Alex Chen", "alex@facebook.com", "AC")}
              style={{ background: loading === "facebook" ? "rgba(24,119,242,0.12)" : "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.10)" }}
            />
          </motion.div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-muted-foreground/40 font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleEmail} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground/70 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full bg-white/[0.04] border border-white/8 text-sm text-foreground placeholder:text-muted-foreground/30 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground/70 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/8 text-sm text-foreground placeholder:text-muted-foreground/30 rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-red-400/80 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-muted-foreground/50 hover:text-primary transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <motion.button type="submit" disabled={!!loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            >
              {loading === "email" ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>{mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={14} /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-muted-foreground/50 mt-5">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <div className="flex items-center justify-center gap-1.5 mt-5 pt-5 border-t border-white/5">
            <Shield size={11} className="text-muted-foreground/30" />
            <span className="text-[10px] text-muted-foreground/30">Secured with end-to-end encryption · SOC 2 Type II</span>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/25 mt-4 leading-relaxed">
          By continuing you agree to our{" "}
          <span className="underline cursor-pointer hover:text-muted-foreground/50 transition-colors">Terms</span> and{" "}
          <span className="underline cursor-pointer hover:text-muted-foreground/50 transition-colors">Privacy Policy</span>.
        </p>
      </motion.div>
    </div>
  );
}
