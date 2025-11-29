// Fix: Add React import to ensure consistent type resolution for React.FC and related types.
import React from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  accountType: 'user' | 'business';
  phone?: string;
  address?: string;
  rating?: {
    average: number;
    count: number;
  };
  favoriteSellers?: number[];
  isAdmin?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  iconName?: string; // New field for SVG mapping
  subCategories?: {
    id: string;
    name:string;
    icon: string;
    iconName?: string; // New field for SVG mapping
  }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  imageUrls: string[];
  seller: User;
  postedDate: string;
  status: 'active' | 'pending_payment' | 'expired' | 'sold';
  expiryDate?: string;
  details?: {
    brand?: string;
    year?: number;
    fuel?: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
    kms?: number;
    ram?: string;
    storage?: string;
    material?: string;
    condition?: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
    author?: string;
    genre?: string;
    // Property Details
    type?: 'Apartment' | 'House' | 'Plot' | 'Office' | 'Shop' | 'Other';
    bedrooms?: number;
    bathrooms?: number;
    area?: number; // in sqft
    furnishing?: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
    listedBy?: 'Owner' | 'Dealer';
    // Pet Details
    breed?: string;
    age?: string;
  };
}

export interface PurchaseRecord {
  id: number;
  buyer_id: number;
  product: Product;
  purchaseDate: string;
  reviewSubmitted: boolean;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  cancellationReason?: string;
  returnReason?: string;
  arrivalDate?: string;
}

export interface Review {
  id: string;
  sellerId: number;
  reviewerId: number;
  reviewerName: string;
  rating: number;
  text: string;
  listingTitle: string;
  date: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Short {
  id: string;
  videoUrl: string;
}