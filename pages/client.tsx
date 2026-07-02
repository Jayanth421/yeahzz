import Head from "next/head";
import { useState, useEffect } from "react";
import { useSubmissions, type Submission } from "../src/hooks/useSubmissions";
import { usePortfolio, type Project } from "../src/hooks/usePortfolio";
import { LogOut, Search, Clock, CheckCircle2, Briefcase, Mail, Phone, ExternalLink, RefreshCw } from "lucide-react";

import fintechImg from "../src/assets/portfolio-fintech.jpg";
import fashionImg from "../src/assets/portfolio-fashion.jpg";
import realestateImg from "../src/assets/portfolio-realestate.jpg";
import appImg from "../src/assets/portfolio-app.jpg";
import marketingImg from "../src/assets/portfolio-marketing.jpg";

const imageMap: Record<string, string> = {
  "src/assets/portfolio-fintech.jpg": fintechImg.src,
  "src/assets/portfolio-fashion.jpg": fashionImg.src,
  "src/assets/portfolio-realestate.jpg": realestateImg.src,
  "src/assets/portfolio-app.jpg": appImg.src,
  "src/assets/portfolio-marketing.jpg": marketingImg.src,
};

const getImg = (path: string) => imageMap[path] ?? path;

const getProjectUrl = (url?: string) => {
  if (!url?.trim()) return "";
  return /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
};

const serviceLabels: Record<string, string> = {
  web: "Web Development",
  ecommerce: "eCommerce",
  seo: "SEO Optimization",
  marketing: "Digital Marketing",
  branding: "Branding",
  app: "App Development",
};

// ── helpers ────────────────────────────────────────────────────────────────

const SESSION_KEY = "client_auth";

function loadSession(): { email: string; code: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(email: string, code: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, code }));
}

function clearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

// ── main component ─────────────────────────────────────────────────────────

export default function ClientPortalPage() {
  const { submissions, loading: loadingSubmissions } = useSubmissions();
  const { projects, loading: loadingProjects } = usePortfolio();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [session, setSession] = useState<{ email: string; code: string } | null>(null);

  // Restore session on mount
  useEffect(() => {
    setSession(loadSession());
  }, []);

  // Find the submission that matches the logged-in client
  const mySubmission: Submission | undefined = session
    ? submissions.find(
        (s) =>
          s.email.toLowerCase() === session.email.toLowerCase() &&
          (s.clientCode ?? "").toUpperCase() === session.code.toUpperCase()
      )
    : undefined;

  // Projects linked to this client (those whose title or tags contains the client email domain or submission id)
  // In a simple setup the admin sets WebsiteUrl or tags to reference clients — here we show all projects
  // until more advanced linking is implemented. Filter can be extended later.
  const myProjects: Project[] = projects; // show all public portfolio for now

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingSubmissions) return;

    const match = submissions.find(
      (s) =>
        s.email.toLowerCase() === email.trim().toLowerCase() &&
        (s.clientCode ?? "").toUpperCase() === code.trim().toUpperCase()
    );

    if (match) {
      saveSession(email.trim(), code.trim().toUpperCase());
      setSession({ email: email.trim(), code: code.trim().toUpperCase() });
      setAuthError("");
    } else {
      setAuthError("No matching inquiry found. Check your email and access code.");
    }
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
    setEmail("");
    setCode("");
  };

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!session) {
    return (
      <>
        <Head>
          <title>Client Portal — Yeahzz</title>
          <meta name="robots" content="noindex,nofollow" />
        </Head>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative font-sans">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          <div className="max-w-md w-full bg-card border-3 border-foreground rounded-3xl p-8 shadow-[6px_6px_0px_0px_var(--color-border)] relative z-10">
            <div className="text-center mb-8">
              <div className="size-16 bg-neo-violet border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#000]">
                <Briefcase className="size-8 text-white" />
              </div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
                Client <span className="text-gradient">Portal</span>
              </h2>
              <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1.5 font-mono">
                Enter your email &amp; access code
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block font-mono">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/30 font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block font-mono">
                  Access Code
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={10}
                  className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm tracking-widest text-center outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/30 font-mono text-white"
                />
                <p className="text-[10px] font-mono text-muted-foreground mt-1.5">
                  Your access code was emailed after your inquiry was submitted.
                </p>
              </div>

              {authError && (
                <p className="text-xs font-mono text-red-400 border border-red-500/30 bg-red-950/20 rounded-xl px-3 py-2">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={loadingSubmissions}
                className="w-full py-4 bg-neo-violet text-white border-2 border-black rounded-xl font-mono font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingSubmissions ? "Loading…" : "Access Portal"}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  // ── Authenticated view ────────────────────────────────────────────────────

  const isLoading = loadingSubmissions || loadingProjects;

  return (
    <>
      <Head>
        <title>Client Portal — Yeahzz</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* Topbar */}
        <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b-2 border-foreground/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-neo-violet border-2 border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <Briefcase className="size-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-white">
                Yeahzz <span className="text-gradient">Client Portal</span>
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border-2 border-foreground/30 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white hover:border-foreground transition-colors cursor-pointer"
            >
              <LogOut className="size-3.5" /> Sign Out
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <RefreshCw className="size-8 text-neo-violet animate-spin" />
            </div>
          ) : (
            <>
              {/* Welcome */}
              <section>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  Welcome back<span className="text-gradient">,</span>
                </h1>
                <p className="font-mono text-sm text-muted-foreground">{session.email}</p>
              </section>

              {/* Inquiry Status */}
              <section>
                <h2 className="font-display text-xl font-extrabold text-white mb-4 flex items-center gap-2">
                  <Search className="size-5 text-neo-violet" /> Your Inquiry
                </h2>

                {mySubmission ? (
                  <div className="bg-card border-3 border-black rounded-3xl p-6 shadow-[4px_4px_0px_0px_#000] space-y-4">
                    {/* Status badge */}
                    <div className="flex items-center gap-3">
                      {mySubmission.status === "resolved" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-500/40 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                          <CheckCircle2 className="size-3" /> Resolved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-500/40 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
                          <Clock className="size-3" /> In Progress
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {new Date(mySubmission.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Details grid */}
                    <div className="grid sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1">Name</div>
                        <div className="font-semibold text-sm text-white">{mySubmission.name}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1">Service</div>
                        <div className="font-semibold text-sm text-white">
                          {serviceLabels[mySubmission.service] ?? mySubmission.service}
                        </div>
                      </div>
                      {mySubmission.phone && (
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 flex items-center gap-1">
                            <Phone className="size-3" /> Phone
                          </div>
                          <div className="font-semibold text-sm text-white">{mySubmission.phone}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1 flex items-center gap-1">
                          <Mail className="size-3" /> Email
                        </div>
                        <div className="font-semibold text-sm text-white">{mySubmission.email}</div>
                      </div>
                    </div>

                    {mySubmission.message && (
                      <div className="pt-2 border-t-2 border-foreground/10">
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">Your Message</div>
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                          {mySubmission.message}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t-2 border-foreground/10 text-[10px] font-mono text-muted-foreground">
                      Access code: <span className="text-neo-violet font-bold">{mySubmission.clientCode}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border-2 border-foreground/20 rounded-3xl p-6 text-center text-sm text-muted-foreground font-mono">
                    No inquiry details found for this account.
                  </div>
                )}
              </section>

              {/* Portfolio */}
              <section>
                <h2 className="font-display text-xl font-extrabold text-white mb-4 flex items-center gap-2">
                  <Briefcase className="size-5 text-neo-pink" /> Our Portfolio
                </h2>
                <p className="text-sm font-mono text-muted-foreground mb-6">
                  Browse our completed projects. Your project will appear here once it goes live.
                </p>

                {myProjects.length === 0 ? (
                  <p className="text-sm font-mono text-muted-foreground">No projects available yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myProjects.map((project, i) => {
                      const url = getProjectUrl(project.websiteUrl);
                      const cardCls =
                        "group bg-white dark:bg-card border-3 border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] transition-all";

                      const inner = (
                        <>
                          <div className="relative aspect-video overflow-hidden border-b-3 border-black bg-neo-cream">
                            <img
                              src={getImg(project.image)}
                              alt={project.title}
                              width={800}
                              height={500}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {url && (
                              <div className="absolute inset-4 bg-black/80 border-2 border-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="flex items-center gap-2 text-xs font-mono font-extrabold uppercase tracking-wider text-white bg-neo-pink px-4 py-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_#000]">
                                  View Live <ExternalLink className="size-3.5" />
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="font-display text-base font-extrabold mb-2 group-hover:text-neo-pink transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 border border-black rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-white text-black shadow-[1px_1px_0px_0px_#000]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      );

                      return url ? (
                        <a
                          key={project.id || i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${cardCls} cursor-pointer`}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={project.id || i} className={`${cardCls} cursor-default`}>
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* CTA */}
              <section className="bg-neo-violet border-3 border-black rounded-3xl p-8 shadow-[5px_5px_0px_0px_#000] text-center">
                <h3 className="font-display text-2xl font-extrabold text-white mb-2">
                  Questions about your project?
                </h3>
                <p className="font-mono text-sm text-white/70 mb-6">
                  Reach out to us and we'll get back to you within 24 hours.
                </p>
                <a
                  href="mailto:hello@yeahzz.in"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black border-2 border-black rounded-xl font-mono font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                >
                  <Mail className="size-4" /> hello@yeahzz.in
                </a>
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
