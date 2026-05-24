import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortfolio, Project } from "../hooks/usePortfolio";
import {
  Mail,
  Phone,
  Trash2,
  Download,
  RefreshCw,
  Search,
  LayoutDashboard,
  ChevronLeft,
  Eye,
  Check,
  X,
  FileText,
  CheckCircle2,
  User,
  Clock,
  Briefcase,
  Lock,
  Unlock,
  EyeOff,
  LogOut,
  Plus,
  Edit2,
  AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminDashboard,
});

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: "active" | "resolved";
}

const serviceLabels: Record<string, string> = {
  web: "Web Development",
  ecommerce: "eCommerce",
  seo: "SEO Optimization",
  marketing: "Digital Marketing",
  branding: "Branding",
  app: "App Development",
};

const serviceColors: Record<string, string> = {
  web: "border-cyan-500/40 text-cyan-400 bg-cyan-950/40",
  ecommerce: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40",
  seo: "border-indigo-500/40 text-indigo-400 bg-indigo-950/40",
  marketing: "border-pink-500/40 text-pink-400 bg-pink-950/40",
  branding: "border-amber-500/40 text-amber-400 bg-amber-950/40",
  app: "border-purple-500/40 text-purple-400 bg-purple-950/40",
};

function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"inquiries" | "portfolio">("inquiries");

  // Portfolio hook
  const {
    projects,
    loading: loadingProjects,
    addProject,
    updateProject,
    deleteProject,
    isFirebaseConnected,
  } = usePortfolio();

  // Portfolio Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    category: "Website",
    image: "",
    tags: "",
    websiteUrl: "",
  });

  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Load from localStorage & sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("nexus_craft_submissions");
        if (stored) {
          setSubmissions(JSON.parse(stored));
        }

        const auth = sessionStorage.getItem("admin_authenticated");
        if (auth === "true") {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Failed to load submissions or auth from storage:", err);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "4218") {
      setIsAuthenticated(true);
      setAuthError("");
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem("admin_authenticated", "true");
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      setAuthError("ACCESS DENIED: INVALID PASSKEY");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("admin_authenticated");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const updateSubmissions = (newSubmissions: Submission[]) => {
    setSubmissions(newSubmissions);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nexus_craft_submissions", JSON.stringify(newSubmissions));
      } catch (err) {
        console.error("Failed to save submissions to localStorage:", err);
      }
    }
  };

  const deleteSubmission = (id: string) => {
    if (confirm("Are you sure you want to delete this submission?")) {
      const filtered = submissions.filter((s) => s.id !== id);
      updateSubmissions(filtered);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const toggleStatus = (id: string) => {
    const updated = submissions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === "resolved" ? ("active" as const) : ("resolved" as const),
        };
      }
      return s;
    });
    updateSubmissions(updated);
    if (selectedSubmission?.id === id) {
      const current = updated.find((s) => s.id === id);
      if (current) setSelectedSubmission(current);
    }
  };

  const clearAll = () => {
    if (confirm("Are you sure you want to clear ALL submissions? This action cannot be undone.")) {
      updateSubmissions([]);
      setSelectedSubmission(null);
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Service", "Message", "Timestamp", "Status"];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.name.replace(/"/g, '""')}"`,
      s.email,
      s.phone || "",
      s.service,
      `"${s.message.replace(/"/g, '""')}"`,
      s.timestamp,
      s.status,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexus_craft_submissions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Portfolio actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = projectForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectData = {
      title: projectForm.title,
      category: projectForm.category,
      image: projectForm.image || "src/assets/portfolio-fintech.jpg",
      tags: tagsArray,
      websiteUrl: projectForm.websiteUrl,
    };

    if (editingProject) {
      await updateProject({ id: editingProject.id, ...projectData });
      setEditingProject(null);
    } else {
      await addProject(projectData);
    }

    setProjectForm({
      title: "",
      category: "Website",
      image: "",
      tags: "",
      websiteUrl: "",
    });
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
      setProjectForm({
        title: project.title,
        category: project.category,
        image: project.image,
        tags: project.tags.join(", "),
        websiteUrl: project.websiteUrl || "",
      });
  };

  // Filter calculations for inquiries
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm));

    const matchesService = serviceFilter === "all" || s.service === serviceFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  // Stat metrics for inquiries
  const totalCount = submissions.length;
  const activeCount = submissions.filter((s) => s.status === "active").length;
  const resolvedCount = submissions.filter((s) => s.status === "resolved").length;

  const serviceDistribution = Object.keys(serviceLabels).reduce(
    (acc, key) => {
      const count = submissions.filter((s) => s.service === key).length;
      acc[key] = {
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
      };
      return acc;
    },
    {} as Record<string, { count: number; percentage: number }>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative font-sans">
        {/* Background grid */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="max-w-md w-full bg-card border-3 border-foreground rounded-3xl p-8 shadow-[6px_6px_0px_0px_var(--color-border)] relative z-10 animate-in fade-in zoom-in-95 duration-250">
          <div className="text-center mb-8">
            <div className="size-16 bg-neo-violet border-2 border-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#000]">
              <Lock className="size-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white">
              Secure <span className="text-gradient">Portal</span>
            </h2>
            <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1.5 font-mono">
              Authorization Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 block font-mono">
                Enter Admin Passkey
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  required
                  className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-4 text-sm text-center tracking-widest outline-none focus:bg-neo-cream focus:text-black transition-colors placeholder:text-muted-foreground/30 font-mono text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="text-center text-xs font-mono font-bold text-destructive animate-bounce border border-destructive/20 bg-destructive/5 rounded-lg py-2">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-neo-violet text-white border-2 border-foreground rounded-xl font-bold text-sm uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_var(--color-border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--color-border)] transition-all cursor-pointer"
            >
              <Unlock className="size-4" /> Authenticate
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-white transition-colors flex items-center justify-center gap-1.5 font-mono"
            >
              <ChevronLeft className="size-3" /> [ Back to Site ]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative font-sans">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-background border-b-3 border-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-neo-violet border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                <LayoutDashboard className="size-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white">Yeahzz Portal</span>
                <span className="hidden sm:inline-block font-mono text-[9px] text-neo-green uppercase ml-2 px-1.5 py-0.5 border border-neo-green/30 rounded">
                  Admin
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2 border border-white/5"
              >
                <ChevronLeft className="size-4" /> Back to Website
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider text-destructive hover:bg-destructive/10 transition-colors rounded-lg flex items-center gap-2 border border-destructive/20 cursor-pointer"
              >
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 relative z-10">
        
        {/* Firebase connectivity banner */}
        <div className={`mb-8 border-2 rounded-2xl p-4 flex items-center gap-3 shadow-[3px_3px_0px_0px_#000] ${
          isFirebaseConnected 
            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400" 
            : "bg-amber-950/20 border-amber-500/40 text-amber-400"
        }`}>
          <AlertCircle className="size-5 flex-shrink-0" />
          <div className="text-xs font-mono font-semibold">
            {isFirebaseConnected 
              ? "Connected to Firebase Firestore. All portfolio updates are synced in real-time." 
              : "Firebase configuration not active. Running on Local Storage fallback. Updates are saved locally."}
          </div>
        </div>

        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Inquiry & <span className="text-gradient">Content Manager</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              Admin console to read client forms and modify portfolio projects.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b-2 border-foreground mb-8 gap-2">
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-6 py-3 font-mono font-extrabold text-xs uppercase tracking-wider border-t-2 border-x-2 border-black rounded-t-xl transition-all cursor-pointer ${
              activeTab === "inquiries"
                ? "bg-neo-violet text-white translate-y-[2px]"
                : "bg-card text-muted-foreground hover:text-white"
            }`}
          >
            Client Inquiries ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-6 py-3 font-mono font-extrabold text-xs uppercase tracking-wider border-t-2 border-x-2 border-black rounded-t-xl transition-all cursor-pointer ${
              activeTab === "portfolio"
                ? "bg-neo-pink text-black translate-y-[2px]"
                : "bg-card text-muted-foreground hover:text-white"
            }`}
          >
            Portfolio Editor ({projects.length})
          </button>
        </div>

        {activeTab === "inquiries" ? (
          <>
            {/* Inquiries Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Stat card 1: Total */}
              <div className="border-3 border-foreground bg-card rounded-2xl p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_var(--color-border)]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                      Total Inquiries
                    </span>
                    <h3 className="text-4xl font-extrabold font-display mt-2 text-white">
                      {totalCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-neo-blue border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_0px_#000]">
                    <FileText className="size-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="text-emerald-400 font-semibold">{resolvedCount}</span> resolved
                  inquiries.
                </div>
              </div>

              {/* Stat card 2: Active */}
              <div className="border-3 border-foreground bg-card rounded-2xl p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_var(--color-border)]">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                      Active Inquiries
                    </span>
                    <h3 className="text-4xl font-extrabold font-display mt-2 text-neo-pink">
                      {activeCount}
                    </h3>
                  </div>
                  <div className="p-3 bg-neo-pink border-2 border-black rounded-xl text-black shadow-[2px_2px_0px_0px_#000]">
                    <Clock className="size-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <span className="text-neo-pink font-semibold">{activeCount}</span> pending replies.
                </div>
              </div>

              {/* Stat card 3: Service breakdown */}
              <div className="border-3 border-foreground bg-card rounded-2xl p-6 relative overflow-hidden shadow-[4px_4px_0px_0px_var(--color-border)]">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono block mb-3">
                  Service Distribution
                </span>
                <div className="space-y-2 max-h-[105px] overflow-y-auto pr-1">
                  {Object.entries(serviceLabels).map(([key, label]) => {
                    const dist = serviceDistribution[key] || { count: 0, percentage: 0 };
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-semibold text-white">
                            {dist.count} ({dist.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              key === "web"
                                ? "bg-cyan-500"
                                : key === "ecommerce"
                                  ? "bg-emerald-500"
                                  : key === "seo"
                                    ? "bg-indigo-500"
                                    : key === "marketing"
                                      ? "bg-pink-500"
                                      : key === "branding"
                                        ? "bg-amber-500"
                                        : "bg-purple-500"
                            }`}
                            style={{ width: `${dist.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Inquiries Table Controls */}
            <div className="border-3 border-foreground bg-card rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_var(--color-border)]">
              {/* Search & Filter Bar */}
              <div className="p-4 sm:p-6 border-b border-border/50 bg-white/[0.01] flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by name, email, details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border-2 border-foreground rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:bg-neo-cream focus:text-black transition-all placeholder:text-muted-foreground/50 shadow-[2px_2px_0px_0px_#000] font-mono"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Service:</span>
                    <select
                      value={serviceFilter}
                      onChange={(e) => setServiceFilter(e.target.value)}
                      className="bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none text-white min-w-[150px] font-mono shadow-[2px_2px_0px_0px_#000]"
                    >
                      <option value="all">All Services</option>
                      {Object.entries(serviceLabels).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground uppercase font-mono">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none text-white min-w-[130px] font-mono shadow-[2px_2px_0px_0px_#000]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={exportToCSV}
                    disabled={totalCount === 0}
                    className="px-4 py-2 bg-neo-blue border-2 border-black text-xs font-mono font-extrabold text-black rounded-xl hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Download className="size-4 inline-block mr-1.5" />
                    Export CSV
                  </button>
                  
                  <button
                    onClick={clearAll}
                    disabled={totalCount === 0}
                    className="px-4 py-2 bg-destructive border-2 border-black text-xs font-mono font-extrabold text-white rounded-xl hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Trash2 className="size-4 inline-block mr-1.5" />
                    Clear Inquiries
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {filteredSubmissions.length === 0 ? (
                  <div className="text-center py-20 px-4">
                    <div className="size-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white mb-1">
                      No submissions found
                    </h3>
                    <p className="text-muted-foreground text-xs font-mono max-w-xs mx-auto">
                      Submit queries on the home contact form to get started.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-border/50 text-muted-foreground text-xs uppercase tracking-wider bg-white/[0.005]">
                        <th className="py-4 px-6 font-bold">Client</th>
                        <th className="py-4 px-6 font-bold">Requested Service</th>
                        <th className="py-4 px-6 font-bold">Date Submitted</th>
                        <th className="py-4 px-6 font-bold">Status</th>
                        <th className="py-4 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30 text-sm">
                      {filteredSubmissions.map((s) => (
                        <tr
                          key={s.id}
                          className="hover:bg-white/[0.015] transition-colors group/row"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-white group-hover/row:text-neo-blue transition-colors">
                              {s.name}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5 flex flex-col gap-0.5">
                              <span className="flex items-center gap-1.5">
                                <Mail className="size-3 text-muted-foreground/60" /> {s.email}
                              </span>
                              {s.phone && (
                                <span className="flex items-center gap-1.5">
                                  <Phone className="size-3 text-muted-foreground/60" /> {s.phone}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border-2 border-black ${
                                serviceColors[s.service] || "border-white/10 text-white bg-white/5"
                              }`}
                            >
                              {serviceLabels[s.service] || s.service}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-xs text-muted-foreground">
                            <div>{new Date(s.timestamp).toLocaleDateString()}</div>
                            <div className="opacity-70 mt-0.5">
                              {new Date(s.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>

                          <td className="py-4 px-6">
                            <button
                              onClick={() => toggleStatus(s.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer border-2 border-black transition-all ${
                                s.status === "active"
                                  ? "bg-neo-yellow text-black"
                                  : "bg-neo-green text-black"
                              }`}
                              title={`Click to mark as ${s.status === "active" ? "resolved" : "active"}`}
                            >
                              {s.status === "active" ? (
                                <>
                                  <Clock className="size-3" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <Check className="size-3" />
                                  Resolved
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedSubmission(s)}
                                className="p-2 bg-white/5 hover:bg-neo-blue border-2 border-black rounded-lg text-white hover:text-black transition-all cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                onClick={() => toggleStatus(s.id)}
                                className={`p-2 bg-white/5 border-2 border-black rounded-lg text-white transition-all cursor-pointer ${
                                  s.status === "active"
                                    ? "hover:bg-neo-green hover:text-black"
                                    : "hover:bg-neo-yellow hover:text-black"
                                }`}
                                title={s.status === "active" ? "Mark Resolved" : "Mark Active"}
                              >
                                <CheckCircle2 className="size-4" />
                              </button>
                              <button
                                onClick={() => deleteSubmission(s.id)}
                                className="p-2 bg-white/5 hover:bg-destructive border-2 border-black rounded-lg text-white transition-all cursor-pointer"
                                title="Delete Submission"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Portfolio Editor view */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form to Add/Edit project */}
            <div className="lg:col-span-5 border-3 border-foreground bg-card rounded-2xl p-6 shadow-[4px_4px_0px_0px_var(--color-border)]">
              <h2 className="font-display text-xl font-extrabold mb-4 text-white flex items-center gap-2">
                <Briefcase className="size-5 text-neo-pink" />
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              
              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none focus:bg-neo-cream focus:text-black transition-colors font-mono text-white shadow-[2px_2px_0px_0px_#000]"
                    placeholder="e.g. FitTrack App"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Category
                  </label>
                  <select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none transition-colors font-mono text-white shadow-[2px_2px_0px_0px_#000]"
                  >
                    <option value="Website">Website</option>
                    <option value="eCommerce">eCommerce</option>
                    <option value="Branding">Branding</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Image URL / Asset Path
                  </label>
                  <input
                    type="text"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                    className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none focus:bg-neo-cream focus:text-black transition-colors font-mono text-white shadow-[2px_2px_0px_0px_#000]"
                    placeholder="e.g. src/assets/portfolio-fintech.jpg"
                  />
                  <p className="text-[10px] text-muted-foreground/60 font-mono mt-1 leading-relaxed">
                    Leave blank to use default. You can input any image URL or map it to a local asset:
                    <br />
                    - <code className="text-neo-blue">src/assets/portfolio-fintech.jpg</code>
                    <br />
                    - <code className="text-neo-blue">src/assets/portfolio-app.jpg</code>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.websiteUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, websiteUrl: e.target.value })}
                    className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none focus:bg-neo-cream focus:text-black transition-colors font-mono text-white shadow-[2px_2px_0px_0px_#000]"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground mb-2 block">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="w-full bg-black/40 border-2 border-foreground rounded-xl px-4 py-3 text-sm outline-none focus:bg-neo-cream focus:text-black transition-colors font-mono text-white shadow-[2px_2px_0px_0px_#000]"
                    placeholder="e.g. React, UI/UX, SEO"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-neo-pink text-black border-2 border-black rounded-xl font-mono font-extrabold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#000] transition-all cursor-pointer"
                  >
                    {editingProject ? "Update Project" : "Add Project"}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({ title: "", category: "Website", image: "", tags: "", websiteUrl: "" });
                      }}
                      className="px-4 py-3 bg-white hover:bg-neo-cream text-black border-2 border-black rounded-xl font-mono font-extrabold text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Column: List of current projects */}
            <div className="lg:col-span-7 border-3 border-foreground bg-card rounded-2xl p-6 shadow-[4px_4px_0px_0px_var(--color-border)]">
              <h2 className="font-display text-xl font-extrabold mb-4 text-white">
                Current Projects ({projects.length})
              </h2>

              {loadingProjects ? (
                <div className="flex justify-center items-center py-20">
                  <RefreshCw className="size-8 text-neo-pink animate-spin" />
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 bg-black/20 border-2 border-foreground rounded-2xl p-4 shadow-[2px_2px_0px_0px_var(--color-border)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
                    >
                      <div className="size-16 rounded-xl border-2 border-black overflow-hidden bg-neo-cream flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs text-black">
                        {project.title.substring(0, 2).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-sm text-white truncate">{project.title}</h4>
                        <span className="inline-block text-[9.5px] font-mono font-extrabold text-neo-pink uppercase mt-0.5">
                          {project.category}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 border border-foreground/50 rounded-md text-[8px] font-mono font-semibold bg-white/5 text-muted-foreground uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {project.websiteUrl && (
                          <div className="mt-2">
                            <a
                              href={project.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1 bg-neo-pink text-black rounded-full text-[10px] font-mono font-bold hover:bg-neo-pink/80 transition-colors"
                            >
                              Visit Site
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleEditClick(project)}
                          className="p-2 bg-white/5 hover:bg-neo-yellow border-2 border-black rounded-lg text-white hover:text-black transition-all cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit2 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-2 bg-white/5 hover:bg-destructive border-2 border-black rounded-lg text-white transition-all cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* View Inquiry Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-card border-3 border-foreground rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button
              onClick={() => setSelectedSubmission(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/5 hover:bg-white/10 border-2 border-black rounded-xl text-muted-foreground hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="size-12 bg-neo-violet border-2 border-black rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <FileText className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white leading-tight">
                  Inquiry Details
                </h3>
                <p className="text-muted-foreground text-xs mt-0.5 font-mono">
                  ID: <span className="font-bold">{selectedSubmission.id}</span>
                </p>
              </div>
            </div>

            <div className="space-y-6 font-mono">
              <div className="grid sm:grid-cols-2 gap-4 bg-black/40 border-2 border-black rounded-2xl p-4">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                    <User className="size-3.5" /> Client Info
                  </span>
                  <div>
                    <h4 className="font-extrabold text-white">{selectedSubmission.name}</h4>
                    <a
                      href={`mailto:${selectedSubmission.email}`}
                      className="text-xs text-neo-blue hover:underline block mt-1"
                    >
                      {selectedSubmission.email}
                    </a>
                    {selectedSubmission.phone && (
                      <a
                        href={`tel:${selectedSubmission.phone}`}
                        className="text-xs text-muted-foreground hover:text-white block mt-0.5"
                      >
                        {selectedSubmission.phone}
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:border-l sm:border-black/30 sm:pl-4">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                    <Clock className="size-3.5" /> Metadata
                  </span>
                  <div className="text-xs space-y-1">
                    <div className="text-white">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          selectedSubmission.status === "active" ? "text-neo-yellow" : "text-neo-green"
                        }`}
                      >
                        {selectedSubmission.status === "active" ? "Active" : "Resolved"}
                      </span>
                    </div>
                    <div className="text-muted-foreground mt-1">
                      Date: {new Date(selectedSubmission.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-muted-foreground">
                      Time: {new Date(selectedSubmission.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="size-3.5" /> Service
                </span>
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-bold border-2 border-black ${
                      serviceColors[selectedSubmission.service] || "border-white/10 text-white bg-white/5"
                    }`}
                  >
                    {serviceLabels[selectedSubmission.service] || selectedSubmission.service}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                  <FileText className="size-3.5" /> Details
                </span>
                <div className="bg-black/40 border-2 border-black rounded-2xl p-5 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedSubmission.message || (
                    <span className="text-muted-foreground italic">No details provided.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/30 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => toggleStatus(selectedSubmission.id)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-xl border-2 border-black transition-all cursor-pointer ${
                  selectedSubmission.status === "active"
                    ? "bg-neo-green text-black"
                    : "bg-neo-yellow text-black"
                }`}
              >
                {selectedSubmission.status === "active" ? "Mark Resolved" : "Mark Active"}
              </button>
              <button
                onClick={() => {
                  deleteSubmission(selectedSubmission.id);
                }}
                className="px-4 py-2 bg-destructive border-2 border-black text-xs font-mono font-bold text-white rounded-xl transition-all cursor-pointer"
              >
                Delete Inquiry
              </button>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-white hover:bg-neo-cream border-2 border-black text-xs font-mono font-bold text-black rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
