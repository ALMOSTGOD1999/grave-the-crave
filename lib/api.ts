"use client";

/**
 * Thin API client for the Grave the Crave backend.
 * Auth uses `Authorization: Bearer <token>` (localStorage-backed).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";

const TOKEN_KEY = "gtc-auth";

export interface AuthUser {
  id: number;
  fullName: string | null;
  email: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  buyingPrice: number;
  profitPercent: number;
  stockQty: number;
  lowStockLimit: number;
  isActive: boolean;
  sellingPrice: number;
  isLowStock: boolean;
}

export interface BillItem {
  id?: number;
  productId: number | null;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Bill {
  id: number;
  billNumber: string;
  customerName: string;
  customerAddress: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  subtotal: number;
  total: number;
  emailed: boolean;
  createdAt: string;
  items?: BillItem[];
}

export interface Promotion {
  id: number;
  subject: string;
  recipients: string | "all";
  sentCount: number;
  createdAt: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { method = "GET", body } = options;
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
      else if (data?.errors?.length) {
        message = data.errors
          .map((e: { field?: string; message: string }) =>
            e.field ? `${e.field}: ${e.message}` : e.message
          )
          .join("; ");
      }
    } catch {
      // non-JSON error body
    }
    throw new ApiError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/api/auth/register", {
      method: "POST",
      body: data,
    }),

  login: (data: { email: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/api/auth/login", {
      method: "POST",
      body: data,
    }),

  adminLogin: (data: { username: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/api/auth/admin/login", {
      method: "POST",
      body: data,
    }),

  me: () => request<{ user: AuthUser }>("/api/auth/me"),

  logoutRequest: () =>
    request<{ message: string }>("/api/auth/logout", { method: "POST" }),

  // Products (admin)
  products: () => request<{ products: Product[] }>("/api/products"),

  suggestProducts: (q: string) =>
    request<{ products: Product[] }>(
      `/api/products/suggest?q=${encodeURIComponent(q)}`
    ),

  lowStockProducts: () =>
    request<{ products: Product[] }>("/api/products/low-stock"),

  createProduct: (data: {
    name: string;
    buyingPrice?: number;
    profitPercent?: number;
    stockQty?: number;
    lowStockLimit?: number;
  }) => request<{ product: Product }>("/api/products", { method: "POST", body: data }),

  updateProduct: (
    id: number,
    data: Partial<{
      name: string;
      buyingPrice: number;
      profitPercent: number;
      stockQty: number;
      lowStockLimit: number;
      isActive: boolean;
    }>
  ) =>
    request<{ product: Product }>(`/api/products/${id}`, {
      method: "PUT",
      body: data,
    }),

  deleteProduct: (id: number) =>
    request<{ message: string }>(`/api/products/${id}`, { method: "DELETE" }),

  // Bills (admin)
  createBill: (data: {
    customerName: string;
    customerAddress?: string;
    customerPhone?: string;
    customerEmail?: string;
    /** false = record the bill without decrementing stock (default true). */
    deductStock?: boolean;
    items: { productId: number; quantity: number }[];
  }) =>
    request<{ bill: Bill; emailed: boolean; emailWarning?: string; pdfUrl: string }>(
      "/api/bills",
      { method: "POST", body: data }
    ),

  bills: (page = 1) =>
    request<{
      bills: {
        data: Bill[];
        meta: { total: number; perPage: number; currentPage: number; lastPage: number };
      };
    }>(`/api/bills?page=${page}`),

  /**
   * Fetch a bill PDF with the auth header and hand it to the browser as a
   * download. A bare `<a href>` cannot carry the Bearer token, so the API
   * answered 401 "Unauthorized access" and nothing downloaded.
   */
  downloadBillPdf: async (id: number, filename: string) => {
    const token = getToken();
    const res = await fetch(`${API_URL}/api/bills/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new ApiError(`PDF download failed (${res.status})`, res.status);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.toLowerCase().endsWith(".pdf") ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Give the browser plenty of time to start reading the blob before the
    // URL is revoked — revoking too early cancels the download.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  },

  // Promotions (admin)
  promotions: () => request<{ promotions: Promotion[] }>("/api/promotions"),

  createPromotion: (data: {
    subject: string;
    html: string;
    recipients: "all" | string[];
  }) =>
    request<{ promotion: Promotion }>("/api/promotions", {
      method: "POST",
      body: data,
    }),

  // Orders (customer)
  createOrder: (data: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    deliveryDate?: string;
    deliveryTime?: string;
    notes?: string;
    items: { id: string; name: string; price: number; quantity: number }[];
  }) => request<{ order: { id: number; total: number } }>("/api/orders", {
    method: "POST",
    body: data,
  }),
};
