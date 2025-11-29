
import { supabase } from './supabase';
import type { User, Product, PurchaseRecord, Review } from '../types';

// This file now interacts with a Supabase backend.
// In a real application, RLS (Row Level Security) would be enabled on the Supabase project.

/**
 * Helper function to transform a user object from the database
 * to the User type expected by the frontend.
 */
const dbUserToUser = (dbUser: any): User | null => {
    if (!dbUser) return null;
    const { rating_average, rating_count, is_admin, account_type, favorite_sellers, ...rest } = dbUser;
    return {
        ...rest,
        rating: { 
            average: rating_average || 0,
            count: rating_count || 0 
        },
        favoriteSellers: favorite_sellers || [],
        isAdmin: is_admin || false,
        accountType: account_type || 'user',
    };
};

/**
 * Helper function to transform a product object from the database
 * to the Product type expected by the frontend.
 */
const dbProductToProduct = (dbProduct: any): Product | null => {
    if (!dbProduct) return null;
    
    const { 
        image_urls, 
        image_url, 
        imageUrl, // CamelCase check
        expiry_date, 
        posted_date,
        status, 
        seller,
        details,
        ...rest 
    } = dbProduct;

    // Robustly handle image URLs which might come as array, JSON string, or single string
    let finalImageUrls: string[] = [];
    
    // Check all potential column names
    const rawImages = image_urls || image_url || imageUrl;
    
    if (Array.isArray(rawImages)) {
        finalImageUrls = rawImages;
    } else if (typeof rawImages === 'string') {
        try {
            if (rawImages.trim().startsWith('[')) {
                const parsed = JSON.parse(rawImages);
                if (Array.isArray(parsed)) finalImageUrls = parsed;
            } else {
                finalImageUrls = [rawImages];
            }
        } catch (e) {
            finalImageUrls = [rawImages];
        }
    }

    // FILTER: Remove nulls, empty strings, or strings that are too short to be valid URLs
    finalImageUrls = finalImageUrls.filter(url => url && typeof url === 'string' && url.length > 10);

    // If ABSOLUTELY empty, provide a placeholder to prevent UI breakage
    if (finalImageUrls.length === 0) {
        finalImageUrls = ['https://placehold.co/400x300?text=No+Image'];
    }

    return {
        ...rest,
        // Map snake_case DB columns to camelCase Frontend props
        imageUrls: finalImageUrls, 
        expiryDate: expiry_date,
        postedDate: posted_date,
        status: status || 'active',
        details: details || {},
        seller: dbUserToUser(seller),
    } as unknown as Product;
}

export const api = {
  login: async (details: {
    email: string;
    name: string;
    phone: string;
    address: string;
    accountType: 'user' | 'business';
  }): Promise<User> => {
    const { email, name, phone, address, accountType } = details;

    if (!email || email.trim() === '') {
        throw new Error("Email cannot be empty.");
    }
    const lowerCaseEmail = email.toLowerCase();

    // 1. Try to select the user first.
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', lowerCaseEmail)
      .maybeSingle();

    if (selectError) {
      console.error("Error fetching user:", selectError.message, selectError);
      throw selectError;
    }

    if (existingUser) {
      return dbUserToUser(existingUser) as User;
    }

    // 2. User not found, so try to create a new one.
    const nameFromEmail = email.split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
    
    const newUserPayload = {
        name: name || nameFromEmail || 'New User',
        email: lowerCaseEmail,
        avatar: `https://picsum.photos/seed/${lowerCaseEmail}/100/100`,
        favorite_sellers: [], 
        phone: phone || null,
        address: address || null,
        rating_average: 0,
        rating_count: 0,
        is_admin: false,
    };

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert(newUserPayload)
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        console.warn("Insert failed due to duplicate email. Re-fetching user.");
        const { data: userAfterInsertFail, error: secondSelectError } = await supabase
          .from('users')
          .select('*')
          .eq('email', lowerCaseEmail)
          .single();

        if (secondSelectError) throw secondSelectError;
        return dbUserToUser(userAfterInsertFail) as User;
      } else {
        console.error("Error creating user:", insertError.message);
        throw insertError;
      }
    }

    const processedUser = dbUserToUser(newUser) as User;
    return { ...processedUser, accountType: accountType };
  },

  fetchData: async (userId: number): Promise<{ users: User[], products: Product[], purchases: PurchaseRecord[], reviews: Review[], wishlist: string[] }> => {
    const [usersRes, productsRes, purchasesRes, reviewsRes, wishlistRes] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('listings').select('*, seller:seller_id(*)'),
        supabase.from('purchases').select('*'), 
        supabase.from('reviews').select('*'),
        supabase.from('wishlists').select('listing_id').eq('user_id', userId)
    ]);

    const errors = [usersRes.error, productsRes.error, purchasesRes.error, reviewsRes.error, wishlistRes.error].filter(Boolean);
    if (errors.length > 0) {
        if (errors[0]?.code !== 'PGRST204') {
             console.error("Errors fetching data:", JSON.stringify(errors, null, 2));
        }
    }

    const users = (usersRes.data || []).map(dbUser => dbUserToUser(dbUser)).filter((u): u is User => u !== null);
    const products = (productsRes.data || []).map(dbProductToProduct).filter((p): p is Product => p !== null && p.seller !== null);
    
    const productsMap = new Map<string, Product>(products.map(p => [p.id, p]));

    const purchases = (purchasesRes.data || []).map(p => {
        const product = productsMap.get(p.listing_id);
        if (!product) return null;
        return {
            id: p.id,
            buyer_id: p.buyer_id,
            product: product,
            purchaseDate: p.purchase_date,
            reviewSubmitted: p.review_submitted || false,
            orderStatus: p.order_status,
            cancellationReason: p.cancellation_reason,
            returnReason: p.return_reason,
            arrivalDate: p.arrival_date
        } as PurchaseRecord;
    }).filter((p): p is PurchaseRecord => p !== null);

    const reviews = (reviewsRes.data || []).map(r => ({
        id: r.id,
        sellerId: r.seller_id,
        reviewerId: r.reviewer_id,
        reviewerName: r.reviewer_name || 'Anonymous',
        rating: r.rating,
        text: r.text,
        listingTitle: r.listing_title,
        date: r.date
    }));

    return {
        users,
        products,
        purchases,
        reviews: reviews as Review[],
        wishlist: wishlistRes.data ? wishlistRes.data.map(w => w.listing_id) : []
    };
  },

  saveProduct: async (productData: Omit<Product, 'id' | 'postedDate' | 'seller' | 'status' | 'expiryDate'> & { id?: string }, seller: User): Promise<Product> => {
    const { id, title, description, price, category, location, imageUrls, details } = productData;
    
    const dbPayload: any = {
      title,
      description,
      price,
      category,
      location,
      details, 
      seller_id: seller.id,
    };

    // FIX: Send data to both standard 'image_urls' and 'imageUrl' (which caused the error)
    // to ensure compatibility with the current database schema.
    dbPayload.image_urls = imageUrls;
    dbPayload.imageUrl = imageUrls;
    
    const selectColumns = '*, seller:seller_id(*)';
    
    let response;
    if (id) { 
        const { seller_id, ...updatePayload } = dbPayload;
        response = await supabase
          .from('listings')
          .update(updatePayload)
          .eq('id', id)
          .select(selectColumns)
          .single();
    } else { 
        response = await supabase
          .from('listings')
          .insert({
              ...dbPayload,
              posted_date: new Date().toISOString().split('T')[0],
              status: 'active',
          })
          .select(selectColumns)
          .single();
    }
    
    if (response.error) {
        console.error("Error saving product:", response.error.message);
        throw response.error;
    }
    
    const savedProduct = dbProductToProduct(response.data);
    if (!savedProduct) throw new Error("Failed to process saved product.");
    return savedProduct;
  },

  deleteProduct: async (productId: string): Promise<void> => {
      const { error } = await supabase.from('listings').delete().eq('id', productId);
      if (error) throw error;
  },

  toggleWishlist: async (userId: number, productId: string): Promise<string[]> => {
      const { data: existing } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', userId)
          .eq('listing_id', productId)
          .maybeSingle();
      
      if (existing) {
          await supabase.from('wishlists').delete().eq('id', existing.id);
      } else {
          await supabase.from('wishlists').insert({ user_id: userId, listing_id: productId });
      }

      const { data } = await supabase.from('wishlists').select('listing_id').eq('user_id', userId);
      return data ? data.map(w => w.listing_id) : [];
  },

  updateUser: async (user: User): Promise<User> => {
      const payload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          favorite_sellers: user.favoriteSellers,
      };
      
      const { data, error } = await supabase
        .from('users')
        .update(payload)
        .eq('id', user.id)
        .select('*')
        .single();
      
      if (error) throw error;
      return dbUserToUser(data) as User;
  },

  deleteUser: async (userId: number): Promise<void> => {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) throw error;
  },

  submitReview: async (purchase: PurchaseRecord, rating: number, text: string): Promise<Review> => {
      const reviewPayload: any = {
          seller_id: purchase.product.seller.id,
          reviewer_id: purchase.buyer_id,
          rating,
          text,
          listing_title: purchase.product.title,
          date: new Date().toISOString()
      };

      // Fetch reviewer name
      const { data: user } = await supabase.from('users').select('name').eq('id', purchase.buyer_id).single();
      if (user) reviewPayload.reviewer_name = user.name;

      const { data, error } = await supabase.from('reviews').insert(reviewPayload).select().single();
      if (error) throw error;
      
      return {
          id: data.id,
          sellerId: data.seller_id,
          reviewerId: data.reviewer_id,
          reviewerName: data.reviewer_name || 'Anonymous',
          rating: data.rating,
          text: data.text,
          listingTitle: data.listing_title,
          date: data.date
      };
  },

  updatePurchaseStatus: async (purchaseId: number, status: string, reason?: string): Promise<PurchaseRecord> => {
      const updatePayload: any = { order_status: status };
      if (status === 'returned') updatePayload.return_reason = reason;
      if (status === 'cancelled') updatePayload.cancellation_reason = reason;

      const { data, error } = await supabase
          .from('purchases')
          .update(updatePayload)
          .eq('id', purchaseId)
          .select('*')
          .single();

      if (error) throw error;

      const { data: listing } = await supabase.from('listings').select('*, seller:seller_id(*)').eq('id', data.listing_id).single();
      const product = dbProductToProduct(listing);
      
      return {
          id: data.id,
          buyer_id: data.buyer_id,
          product: product!,
          purchaseDate: data.purchase_date,
          reviewSubmitted: data.review_submitted || false,
          orderStatus: data.order_status,
          cancellationReason: data.cancellation_reason,
          returnReason: data.return_reason,
          arrivalDate: data.arrival_date
      };
  }
};
