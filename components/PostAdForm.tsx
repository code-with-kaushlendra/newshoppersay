
import React, { useState, useEffect } from 'react';
import type { Product, Category, User } from '../types';
import { generateDescription } from '../services/geminiService';

interface ProductFormProps {
  categories: Category[];
  currentUser: User;
  onSaveProduct: (productData: Omit<Product, 'id' | 'postedDate' | 'seller' | 'status' | 'expiryDate'> & { id?: string }) => Promise<boolean> | void;
  onCancel: () => void;
  productToEdit?: Product | null;
}

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to JPEG at 70% quality
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const PostAdForm: React.FC<ProductFormProps> = ({ categories, currentUser, onSaveProduct, onCancel, productToEdit }) => {
  const isEditMode = !!productToEdit;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && productToEdit) {
      setTitle(productToEdit.title);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price.toString());
      setCategory(productToEdit.category);
      setBrand(productToEdit.details?.brand || '');
      setLocation(productToEdit.location);
      setImageUrls(productToEdit.imageUrls);
    }
  }, [isEditMode, productToEdit]);

  const handleGenerateDescription = async () => {
    if (!title) {
      alert('Please enter a product title first.');
      return;
    }
    setIsGenerating(true);
    try {
      const aiDescription = await generateDescription(title);
      setDescription(aiDescription);
    } catch (error) {
      console.error(error);
      alert('Failed to generate description.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const validFiles = Array.from(files).filter(file => {
         if (file.size > MAX_SIZE) {
             alert(`File "${file.name}" is too large (max 5MB). Skipped.`);
             return false;
         }
         return true;
      });

      if (validFiles.length === 0) return;

      if (imageUrls.length + validFiles.length > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }

      setIsProcessingImages(true);
      try {
        const compressedImages = await Promise.all(
          validFiles.map(file => compressImage(file))
        );
        setImageUrls(prev => [...prev, ...compressedImages]);
      } catch (error) {
        console.error("Error compressing images:", error);
        alert("Failed to process images. Please try again.");
      } finally {
        setIsProcessingImages(false);
        // Reset the input so the same file can be selected again if needed
        e.target.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category || !location || imageUrls.length === 0) {
        alert("Please fill all required fields and upload at least one image.");
        return;
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      category,
      location,
      imageUrls,
      // Preserve existing details if editing, update with new brand
      details: {
        ...(isEditMode && productToEdit?.details ? productToEdit.details : {}),
        brand: brand || undefined
      },
    };

    setIsSaving(true);
    try {
        if (isEditMode && productToEdit) {
            await onSaveProduct({ ...productData, id: productToEdit.id });
        } else {
            await onSaveProduct(productData);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Post a New Product'}
          </h2>
          {isEditMode && (
              <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100 font-semibold">
                  Editing: {productToEdit?.title}
              </span>
          )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Product Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <div className="relative">
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
              <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="absolute bottom-2 right-2 bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-purple-100 transition-colors border border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                  {isGenerating ? 'Generating...' : <><span>✨</span> Generate with AI</>}
              </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary">
                  <option value="">Select a category</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
          </div>
           <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand (Optional)</label>
            <input 
                type="text" 
                id="brand" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)} 
                placeholder="e.g. Apple, Samsung"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" 
            />
          </div>
        </div>

        <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Photos (up to 5)</label>
          <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors bg-gray-50">
            <div className="space-y-1 text-center">
              {isProcessingImages ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                  <p className="text-sm text-gray-500">Processing images...</p>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-orange-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary px-2">
                      <span>{imageUrls.length > 0 ? 'Add more photos' : 'Upload photos'}</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" multiple />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </>
              )}
            </div>
          </div>
          {imageUrls.length > 0 && (
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imageUrls.map((url, index) => (
                <div key={index} className="relative group aspect-square">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`} 
                    className="h-full w-full object-cover rounded-md shadow-sm border border-gray-200" 
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(index)} 
                    className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1.5 leading-none hover:bg-red-50 transition-colors shadow-md border border-gray-200 z-10" 
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={isProcessingImages || isSaving} className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
            {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Post Product')}
          </button>
        </div>
      </form>
    </div>
  );
};
