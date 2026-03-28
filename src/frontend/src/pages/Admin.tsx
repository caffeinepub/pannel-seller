import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { PanelProduct, SiteSettings, Testimonial } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllPanels,
  useAllTestimonials,
  useCreatePanel,
  useCreateTestimonial,
  useDeletePanel,
  useDeleteTestimonial,
  useIsAdmin,
  useSiteSettings,
  useUpdatePanel,
  useUpdateSiteSettings,
  useUpdateTestimonial,
} from "../hooks/useQueries";

const emptyPanel: PanelProduct = {
  productId: BigInt(0),
  name: "",
  description: "",
  price: 0,
  badge: "",
  features: [],
  isActive: true,
  sortOrder: BigInt(0),
};

const emptyTestimonial: Testimonial = {
  customerId: BigInt(0),
  author: "",
  role: "",
  content: "",
  rating: BigInt(5),
  isActive: true,
  createdAt: BigInt(0),
};

function PanelForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: PanelProduct;
  onSave: (p: PanelProduct) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<PanelProduct>(initial);
  const [featureInput, setFeatureInput] = useState("");

  const set = (k: keyof PanelProduct, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm((p) => ({ ...p, features: [...p.features, featureInput.trim()] }));
    setFeatureInput("");
  };

  const removeFeature = (i: number) =>
    setForm((p) => ({
      ...p,
      features: p.features.filter((_, idx) => idx !== i),
    }));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  return (
    <div
      data-ocid="admin.panel.modal"
      className="glass-card rounded-2xl p-6 flex flex-col gap-4"
    >
      <h3 className="text-lg font-bold text-foreground">
        {initial.productId === BigInt(0) ? "Add New Panel" : "Edit Panel"}
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Name</Label>
          <Input
            data-ocid="admin.panel_name.input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Badge</Label>
          <Input
            data-ocid="admin.panel_badge.input"
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            className="admin-input"
            placeholder="e.g. POPULAR"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">Description</Label>
          <Textarea
            data-ocid="admin.panel_description.textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="admin-input resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Price ($)</Label>
          <Input
            data-ocid="admin.panel_price.input"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              set("price", Number.parseFloat(e.target.value) || 0)
            }
            className="admin-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Sort Order</Label>
          <Input
            data-ocid="admin.panel_sort.input"
            type="number"
            value={Number(form.sortOrder)}
            onChange={(e) =>
              set("sortOrder", BigInt(Number.parseInt(e.target.value) || 0))
            }
            className="admin-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs text-muted-foreground">Features</Label>
        <div className="flex gap-2">
          <Input
            data-ocid="admin.panel_feature.input"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add feature and press Enter"
            className="admin-input flex-1"
          />
          <Button
            data-ocid="admin.panel_add_feature.button"
            type="button"
            onClick={addFeature}
            size="sm"
            className="gold-gradient text-[oklch(0.09_0.018_250)] font-bold"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.features.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
              style={{
                background: "oklch(0.75 0.12 75 / 0.15)",
                border: "1px solid oklch(0.75 0.12 75 / 0.3)",
                color: "oklch(0.88 0.14 85)",
              }}
            >
              {f}
              <button
                type="button"
                onClick={() => removeFeature(form.features.indexOf(f))}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          data-ocid="admin.panel_active.switch"
          checked={form.isActive}
          onCheckedChange={(v) => set("isActive", v)}
        />
        <Label className="text-sm text-foreground">Active</Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          data-ocid="admin.panel.save_button"
          onClick={() => onSave(form)}
          disabled={isSaving}
          className="gold-gradient text-[oklch(0.09_0.018_250)] font-bold flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Panel
        </Button>
        <Button
          data-ocid="admin.panel.cancel_button"
          variant="outline"
          onClick={onCancel}
          className="border-muted-foreground text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function TestimonialForm({
  initial,
  onSave,
  onCancel,
  isSaving,
}: {
  initial: Testimonial;
  onSave: (t: Testimonial) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Testimonial>(initial);
  const set = (k: keyof Testimonial, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <div
      data-ocid="admin.testimonial.modal"
      className="glass-card rounded-2xl p-6 flex flex-col gap-4"
    >
      <h3 className="text-lg font-bold text-foreground">
        {initial.customerId === BigInt(0)
          ? "Add Testimonial"
          : "Edit Testimonial"}
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Author Name</Label>
          <Input
            data-ocid="admin.testimonial_author.input"
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Role / Title</Label>
          <Input
            data-ocid="admin.testimonial_role.input"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className="admin-input"
          />
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <Label className="text-xs text-muted-foreground">
            Review Content
          </Label>
          <Textarea
            data-ocid="admin.testimonial_content.textarea"
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={3}
            className="admin-input resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs text-muted-foreground">Rating (1–5)</Label>
          <Input
            data-ocid="admin.testimonial_rating.input"
            type="number"
            min={1}
            max={5}
            value={Number(form.rating)}
            onChange={(e) =>
              set("rating", BigInt(Number.parseInt(e.target.value) || 5))
            }
            className="admin-input"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          data-ocid="admin.testimonial_active.switch"
          checked={form.isActive}
          onCheckedChange={(v) => set("isActive", v)}
        />
        <Label className="text-sm text-foreground">Active</Label>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          data-ocid="admin.testimonial.save_button"
          onClick={() => onSave(form)}
          disabled={isSaving}
          className="gold-gradient text-[oklch(0.09_0.018_250)] font-bold flex items-center gap-2"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </Button>
        <Button
          data-ocid="admin.testimonial.cancel_button"
          variant="outline"
          onClick={onCancel}
          className="border-muted-foreground text-muted-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function LoginWall() {
  const { login, isLoggingIn } = useInternetIdentity();
  const goHome = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-card rounded-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="flex items-center gap-2 mb-2">
          <Shield
            className="w-8 h-8"
            style={{ color: "oklch(0.75 0.12 75)" }}
          />
          <div>
            <div className="text-xs font-bold tracking-[0.2em] gold-text">
              TRUSTED
            </div>
            <div className="text-sm font-bold tracking-[0.12em] text-foreground">
              PANNEL SELLER
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-serif text-foreground">Admin Login</h1>
        <p
          className="text-sm text-center"
          style={{ color: "oklch(0.72 0.02 240)" }}
        >
          Sign in with your Internet Identity to access the admin dashboard.
        </p>
        <Button
          data-ocid="admin.login.button"
          onClick={login}
          disabled={isLoggingIn}
          className="w-full gold-gradient text-[oklch(0.09_0.018_250)] font-bold rounded-full flex items-center gap-2"
        >
          {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isLoggingIn ? "Signing in..." : "Sign In"}
        </Button>
        <button
          type="button"
          onClick={goHome}
          className="text-xs flex items-center gap-1 transition-colors"
          style={{ color: "oklch(0.72 0.02 240)" }}
        >
          <ChevronLeft className="w-3 h-3" /> Back to site
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const { identity, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();

  const { data: panels = [], isLoading: loadingPanels } = useAllPanels();
  const { data: testimonials = [], isLoading: loadingTestimonials } =
    useAllTestimonials();
  const { data: settings } = useSiteSettings();

  const createPanel = useCreatePanel();
  const updatePanel = useUpdatePanel();
  const deletePanel = useDeletePanel();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const updateSettings = useUpdateSiteSettings();

  const [editingPanel, setEditingPanel] = useState<PanelProduct | null>(null);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);

  const goHome = () => {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  if (!identity) return <LoginWall />;
  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2
          data-ocid="admin.loading_state"
          className="w-8 h-8 animate-spin"
          style={{ color: "oklch(0.75 0.12 75)" }}
        />
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          data-ocid="admin.error_state"
          className="glass-card rounded-2xl p-8 text-center max-w-sm"
        >
          <p className="text-foreground mb-4">You do not have admin access.</p>
          <Button onClick={clear} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  const handleSavePanel = async (form: PanelProduct) => {
    try {
      if (form.productId === BigInt(0)) {
        await createPanel.mutateAsync(form);
        toast.success("Panel created!");
      } else {
        await updatePanel.mutateAsync({
          productId: form.productId,
          product: form,
        });
        toast.success("Panel updated!");
      }
      setEditingPanel(null);
    } catch {
      toast.error("Failed to save panel.");
    }
  };

  const handleDeletePanel = async (id: bigint) => {
    if (!confirm("Delete this panel?")) return;
    try {
      await deletePanel.mutateAsync(id);
      toast.success("Panel deleted.");
    } catch {
      toast.error("Failed to delete panel.");
    }
  };

  const handleSaveTestimonial = async (form: Testimonial) => {
    try {
      if (form.customerId === BigInt(0)) {
        await createTestimonial.mutateAsync(form);
        toast.success("Testimonial created!");
      } else {
        await updateTestimonial.mutateAsync({
          testimonialId: form.customerId,
          testimonial: form,
        });
        toast.success("Testimonial updated!");
      }
      setEditingTestimonial(null);
    } catch {
      toast.error("Failed to save testimonial.");
    }
  };

  const handleDeleteTestimonial = async (id: bigint) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success("Testimonial deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleSaveSettings = async () => {
    if (!settingsForm) return;
    try {
      await updateSettings.mutateAsync(settingsForm);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  const currentSettings = settingsForm ||
    settings || {
      heroTitle: "",
      heroSubtitle: "",
      contactEmail: "",
      contactTelegram: "",
    };

  return (
    <div className="min-h-screen bg-background">
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: "oklch(0.10 0.02 250 / 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "oklch(0.75 0.12 75 / 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield
              className="w-6 h-6"
              style={{ color: "oklch(0.75 0.12 75)" }}
            />
            <span className="font-bold tracking-wide text-foreground">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="admin.back_to_site.link"
              onClick={goHome}
              className="text-sm flex items-center gap-1"
              style={{ color: "oklch(0.72 0.02 240)" }}
            >
              <ChevronLeft className="w-4 h-4" /> Back to site
            </button>
            <Button
              data-ocid="admin.logout.button"
              onClick={clear}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 border-muted-foreground text-muted-foreground"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="panels">
          <TabsList
            data-ocid="admin.tabs.panel"
            className="mb-8"
            style={{
              background: "oklch(0.14 0.022 250)",
              border: "1px solid oklch(0.75 0.12 75 / 0.2)",
            }}
          >
            <TabsTrigger
              data-ocid="admin.panels.tab"
              value="panels"
              className="data-[state=active]:gold-gradient data-[state=active]:text-[oklch(0.09_0.018_250)] data-[state=active]:font-bold"
            >
              Panels
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.testimonials.tab"
              value="testimonials"
              className="data-[state=active]:gold-gradient data-[state=active]:text-[oklch(0.09_0.018_250)] data-[state=active]:font-bold"
            >
              Testimonials
            </TabsTrigger>
            <TabsTrigger
              data-ocid="admin.settings.tab"
              value="settings"
              className="data-[state=active]:gold-gradient data-[state=active]:text-[oklch(0.09_0.018_250)] data-[state=active]:font-bold"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="panels" className="flex flex-col gap-6">
            {editingPanel ? (
              <PanelForm
                initial={editingPanel}
                onSave={handleSavePanel}
                onCancel={() => setEditingPanel(null)}
                isSaving={createPanel.isPending || updatePanel.isPending}
              />
            ) : (
              <Button
                data-ocid="admin.add_panel.button"
                onClick={() => setEditingPanel(emptyPanel)}
                className="self-start gold-gradient text-[oklch(0.09_0.018_250)] font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Panel
              </Button>
            )}

            {loadingPanels ? (
              <div
                data-ocid="admin.panels.loading_state"
                className="flex justify-center py-10"
              >
                <Loader2
                  className="w-6 h-6 animate-spin"
                  style={{ color: "oklch(0.75 0.12 75)" }}
                />
              </div>
            ) : panels.length === 0 ? (
              <div
                data-ocid="admin.panels.empty_state"
                className="glass-card rounded-2xl p-10 text-center"
              >
                <p style={{ color: "oklch(0.72 0.02 240)" }}>
                  No panels yet. Add your first panel above.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {panels.map((panel, i) => (
                  <div
                    key={panel.productId.toString()}
                    data-ocid={`admin.panels.item.${i + 1}`}
                    className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {panel.name}
                        </span>
                        {panel.badge && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: "oklch(0.75 0.12 75 / 0.15)",
                              color: "oklch(0.88 0.14 85)",
                            }}
                          >
                            {panel.badge}
                          </span>
                        )}
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: panel.isActive
                              ? "oklch(0.4 0.15 145 / 0.2)"
                              : "oklch(0.5 0 0 / 0.2)",
                            color: panel.isActive
                              ? "oklch(0.7 0.15 145)"
                              : "oklch(0.6 0 0)",
                          }}
                        >
                          {panel.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div
                        className="text-sm mt-0.5"
                        style={{ color: "oklch(0.72 0.02 240)" }}
                      >
                        ${panel.price.toFixed(2)} · {panel.features.length}{" "}
                        features
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        data-ocid={`admin.panels.edit_button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPanel(panel)}
                        className="border-muted-foreground text-muted-foreground hover:text-gold"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        data-ocid={`admin.panels.delete_button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePanel(panel.productId)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="testimonials" className="flex flex-col gap-6">
            {editingTestimonial ? (
              <TestimonialForm
                initial={editingTestimonial}
                onSave={handleSaveTestimonial}
                onCancel={() => setEditingTestimonial(null)}
                isSaving={
                  createTestimonial.isPending || updateTestimonial.isPending
                }
              />
            ) : (
              <Button
                data-ocid="admin.add_testimonial.button"
                onClick={() => setEditingTestimonial(emptyTestimonial)}
                className="self-start gold-gradient text-[oklch(0.09_0.018_250)] font-bold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </Button>
            )}

            {loadingTestimonials ? (
              <div
                data-ocid="admin.testimonials.loading_state"
                className="flex justify-center py-10"
              >
                <Loader2
                  className="w-6 h-6 animate-spin"
                  style={{ color: "oklch(0.75 0.12 75)" }}
                />
              </div>
            ) : testimonials.length === 0 ? (
              <div
                data-ocid="admin.testimonials.empty_state"
                className="glass-card rounded-2xl p-10 text-center"
              >
                <p style={{ color: "oklch(0.72 0.02 240)" }}>
                  No testimonials yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {testimonials.map((t, i) => (
                  <div
                    key={t.customerId.toString()}
                    data-ocid={`admin.testimonials.item.${i + 1}`}
                    className="glass-card rounded-xl px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {t.author}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: "oklch(0.72 0.02 240)" }}
                        >
                          {t.role}
                        </span>
                        <span className="text-xs gold-text">
                          ★ {t.rating.toString()}
                        </span>
                      </div>
                      <p
                        className="text-sm mt-0.5 truncate"
                        style={{ color: "oklch(0.72 0.02 240)" }}
                      >
                        {t.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        data-ocid={`admin.testimonials.edit_button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingTestimonial(t)}
                        className="border-muted-foreground text-muted-foreground hover:text-gold"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        data-ocid={`admin.testimonials.delete_button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTestimonial(t.customerId)}
                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 max-w-lg">
              <h3 className="text-lg font-bold text-foreground">
                Site Settings
              </h3>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">
                  Hero Title
                </Label>
                <Input
                  data-ocid="admin.settings_hero_title.input"
                  value={currentSettings.heroTitle}
                  onChange={(e) =>
                    setSettingsForm({
                      ...currentSettings,
                      heroTitle: e.target.value,
                    })
                  }
                  className="admin-input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">
                  Hero Subtitle
                </Label>
                <Textarea
                  data-ocid="admin.settings_hero_subtitle.textarea"
                  value={currentSettings.heroSubtitle}
                  onChange={(e) =>
                    setSettingsForm({
                      ...currentSettings,
                      heroSubtitle: e.target.value,
                    })
                  }
                  rows={2}
                  className="admin-input resize-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">
                  Contact Email
                </Label>
                <Input
                  data-ocid="admin.settings_email.input"
                  value={currentSettings.contactEmail}
                  onChange={(e) =>
                    setSettingsForm({
                      ...currentSettings,
                      contactEmail: e.target.value,
                    })
                  }
                  className="admin-input"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground">
                  Telegram Handle
                </Label>
                <Input
                  data-ocid="admin.settings_telegram.input"
                  value={currentSettings.contactTelegram}
                  onChange={(e) =>
                    setSettingsForm({
                      ...currentSettings,
                      contactTelegram: e.target.value,
                    })
                  }
                  className="admin-input"
                  placeholder="@yourhandle"
                />
              </div>
              <Button
                data-ocid="admin.settings.save_button"
                onClick={handleSaveSettings}
                disabled={updateSettings.isPending}
                className="self-start gold-gradient text-[oklch(0.09_0.018_250)] font-bold flex items-center gap-2"
              >
                {updateSettings.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
