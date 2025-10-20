import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface Asset {
  id: string;
  name: string;
  category: string;
  categoryId?: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  specifications: Record<string, string>;
  isAvailable?: boolean;
  companyId?: string;
  maxInstallments?: number;
  createdAt?: string;
  photos?: string[];
}

export interface AssetQuery {
  companyId?: string;
  categoryId?: string;
  isAvailable?: boolean;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface AssetCreate {
  name: string;
  description: string;
  basePrice: number;
  availableQuantity: number;
  categoryId?: string;
  companyId: string;
  maxInstallments?: number;
  photos?: string[];
}

export interface AssetUpdate {
  name?: string;
  description?: string;
  basePrice?: number;
  availableQuantity?: number;
  categoryId?: string;
  maxInstallments?: number;
  photos?: string[];
  isAvailable?: boolean;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('assethub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transform API response to frontend format
const transformAsset = (apiAsset: any): Asset => {
  return {
    id: apiAsset.id,
    name: apiAsset.name,
    category: apiAsset.categoryId || 'Uncategorized',
    categoryId: apiAsset.categoryId,
    price: apiAsset.basePrice || 0,
    image: apiAsset.photos && apiAsset.photos.length > 0 ? apiAsset.photos[0] : '/placeholder.jpg',
    description: apiAsset.description || '',
    quantity: apiAsset.availableQuantity || 0,
    specifications: {},
    isAvailable: apiAsset.isAvailable,
    companyId: apiAsset.companyId,
    maxInstallments: apiAsset.maxInstallments,
    createdAt: apiAsset.createdAt,
    photos: apiAsset.photos || []
  };
};

export const assetService = {
  async getAll(): Promise<Asset[]> {
    try {
      const response = await api.get('/assets');
      // API returns { data: [...] }
      const assets = response.data.data || response.data;
      return Array.isArray(assets) ? assets.map(transformAsset) : [];
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Asset> {
    try {
      const response = await api.get(`/assets/${id}`);
      const asset = response.data.data || response.data;
      return transformAsset(asset);
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  },

  async create(data: AssetCreate): Promise<Asset> {
    try {
      const payload = {
        companyId: data.companyId || 'temp-company-id',
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        maxInstallments: data.maxInstallments,
        availableQuantity: data.availableQuantity,
        photos: data.photos || []
      };
      
      const response = await api.post('/assets', payload);
      const asset = response.data.data || response.data;
      return transformAsset(asset);
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  async update(id: string, data: AssetUpdate): Promise<Asset> {
    try {
      const payload: any = {};
      
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if (data.basePrice !== undefined) payload.basePrice = data.basePrice;
      if (data.availableQuantity !== undefined) payload.availableQuantity = data.availableQuantity;
      if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
      if (data.maxInstallments !== undefined) payload.maxInstallments = data.maxInstallments;
      if (data.photos !== undefined) payload.photos = data.photos;
      if (data.isAvailable !== undefined) payload.isAvailable = data.isAvailable;
      
      const response = await api.put(`/assets/${id}`, payload);
      const asset = response.data.data || response.data;
      return transformAsset(asset);
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/assets/${id}`);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },
};
