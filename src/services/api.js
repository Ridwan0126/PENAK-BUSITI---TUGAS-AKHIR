import axios from "axios";

/* =========================================
   RETRIBUSI API (FETCH)
========================================= */

const RETRIBUSI_BASE_URL = "/bapenda";

const retributiFetch = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const url = `${RETRIBUSI_BASE_URL}${endpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  console.log("Retribusi Request:", url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Retribusi Error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

/* =========================================
   LOCAL API (AXIOS)
========================================= */

const localAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

localAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

localAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

/* =========================================
   RETRIBUSI ENDPOINTS
========================================= */

export const retributiAPI_Endpoints = {
  getProducts: async (page = 1, limit = 20, filters = {}) => {
    const params = {
      limit,
      page,
      sort_by: "created_at",
      sort_order: "desc",
    };

    if (filters.search?.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.city?.trim()) {
      params.id_kota = filters.city;
    }

    if (filters.manager?.trim()) {
      params.id_opd = filters.manager;
    }

    if (filters.serviceType?.trim()) {
      params.id_jenis_retribusi = filters.serviceType.includes(".")
        ? filters.serviceType.split(".")[0]
        : filters.serviceType;
    }
    if (filters.is_laku !== undefined) {
      params.is_laku = filters.is_laku;
    }

    const data = await retributiFetch("/pepakraja/obyek", params);

    return {
      data,
    };
  },

  getProduct: async (id) => {
    const data = await retributiFetch(`/pepakraja/obyek/detail/${id}`);
    console.log("detals", data);

    return {
      data,
    };
  },

  getCities: async () => {
    const data = await retributiFetch("/penakbusiti/kota");

    return {
      data,
    };
  },

  getManagers: async () => {
    const data = await retributiFetch("/penakbusiti/opd");

    return {
      data,
    };
  },
};

/* =========================================
   AUTH API
========================================= */

export const authAPI = {
  login: (credentials) => localAPI.post("/auth/login", credentials),

  register: (userData) => localAPI.post("/auth/register", userData),

  logout: () => localAPI.post("/auth/logout"),
};

/* =========================================
   PRODUCT API
========================================= */

export const productAPI = {
  getProducts: (page = 1, limit = 20, filters = {}) =>
    retributiAPI_Endpoints.getProducts(page, limit, filters),

  getProduct: (id) => retributiAPI_Endpoints.getProduct(id),

  createProduct: (data) => localAPI.post("/products", data),

  updateProduct: (id, data) => localAPI.put(`/products/detail/${id}`, data),

  deleteProduct: (id) => localAPI.delete(`/products/detail/${id}`),
};

/* =========================================
   ORDER API
========================================= */

export const orderAPI = {
  getOrders: () => localAPI.get("/orders"),

  getOrder: (id) => localAPI.get(`/orders/${id}`),

  createOrder: (data) => localAPI.post("/orders", data),

  updateOrder: (id, data) => localAPI.put(`/orders/${id}`, data),
};

/* =========================================
   USER API
========================================= */

export const userAPI = {
  getProfile: () => localAPI.get("/users/profile"),

  updateProfile: (data) => localAPI.put("/users/profile", data),

  getUsers: (page = 1, limit = 20) =>
    localAPI.get("/users", {
      params: { page, limit },
    }),
};

/* =========================================
   PAYMENT API
========================================= */

export const paymentAPI = {
  createPaymentIntent: (amount) =>
    localAPI.post("/payments/create-intent", {
      amount,
    }),

  confirmPayment: (paymentIntentId) =>
    localAPI.post("/payments/confirm", {
      paymentIntentId,
    }),
};

export default localAPI;
