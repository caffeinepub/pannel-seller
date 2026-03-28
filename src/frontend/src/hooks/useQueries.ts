import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PanelProduct, SiteSettings, Testimonial } from "../backend";
import { useActor } from "./useActor";

export function useActivePanels() {
  const { actor, isFetching } = useActor();
  return useQuery<PanelProduct[]>({
    queryKey: ["activePanels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActivePanelProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllPanels() {
  const { actor, isFetching } = useActor();
  return useQuery<PanelProduct[]>({
    queryKey: ["allPanels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPanelProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useActiveTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["activeTestimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["allTestimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor)
        return {
          heroTitle: "",
          heroSubtitle: "",
          contactEmail: "",
          contactTelegram: "",
        };
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePanel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: PanelProduct) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPanelProduct(product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allPanels"] });
      qc.invalidateQueries({ queryKey: ["activePanels"] });
    },
  });
}

export function useUpdatePanel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      product,
    }: { productId: bigint; product: PanelProduct }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updatePanelProduct(productId, product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allPanels"] });
      qc.invalidateQueries({ queryKey: ["activePanels"] });
    },
  });
}

export function useDeletePanel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deletePanelProduct(productId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allPanels"] });
      qc.invalidateQueries({ queryKey: ["activePanels"] });
    },
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (t: Testimonial) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTestimonial(t);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTestimonials"] });
      qc.invalidateQueries({ queryKey: ["activeTestimonials"] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      testimonialId,
      testimonial,
    }: { testimonialId: bigint; testimonial: Testimonial }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTestimonial(testimonialId, testimonial);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTestimonials"] });
      qc.invalidateQueries({ queryKey: ["activeTestimonials"] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTestimonial(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allTestimonials"] });
      qc.invalidateQueries({ queryKey: ["activeTestimonials"] });
    },
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: SiteSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["siteSettings"] });
    },
  });
}
