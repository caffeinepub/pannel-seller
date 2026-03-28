import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PanelProduct {
    features: Array<string>;
    sortOrder: bigint;
    name: string;
    description: string;
    productId: bigint;
    isActive: boolean;
    badge: string;
    price: Float;
}
export interface SiteSettings {
    contactTelegram: string;
    heroSubtitle: string;
    contactEmail: string;
    heroTitle: string;
}
export type Time = bigint;
export type Float = number;
export interface Testimonial {
    content: string;
    createdAt: Time;
    role: string;
    isActive: boolean;
    author: string;
    customerId: bigint;
    rating: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPanelProduct(product: PanelProduct): Promise<bigint>;
    createTestimonial(testimonial: Testimonial): Promise<bigint>;
    deletePanelProduct(productId: bigint): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    getActivePanelProducts(): Promise<Array<PanelProduct>>;
    getActiveTestimonials(): Promise<Array<Testimonial>>;
    getAllPanelProducts(): Promise<Array<PanelProduct>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserRole(): Promise<UserRole>;
    getPanelProduct(productId: bigint): Promise<PanelProduct>;
    getSiteSettings(): Promise<SiteSettings>;
    isCallerAdmin(): Promise<boolean>;
    seedData(): Promise<void>;
    updatePanelProduct(productId: bigint, product: PanelProduct): Promise<void>;
    updateSiteSettings(settings: SiteSettings): Promise<void>;
    updateTestimonial(testimonialId: bigint, testimonial: Testimonial): Promise<void>;
}
