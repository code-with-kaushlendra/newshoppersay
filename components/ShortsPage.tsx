import React, { useRef } from 'react';
import { VideoCameraIcon } from './IconComponents';
import type { Short } from '../types';

interface ShortsPageProps {
  onUpload: (videoFile: File) => void;
  shorts: Short[];
}

export const ShortsPage: React.FC<ShortsPageProps> = ({ onUpload, shorts }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <VideoCameraIcon className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopperssay Shorts</h1>
        <p className="text-gray-600 mb-8">
          Showcase your items in short, engaging videos.
        </p>

        <div className="max-w-md mx-auto">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
            aria-hidden="true"
          />
          <button
            onClick={handleUploadClick}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Upload a Short
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Shorts Feed</h2>
        {shorts.length > 0 ? (
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shorts.map(short => (
              <div key={short.id} className="bg-black rounded-lg overflow-hidden aspect-[9/16] shadow-lg">
                <video
                  src={short.videoUrl}
                  controls
                  loop
                  className="w-full h-full object-cover"
                  aria-label={`Short video ${short.id}`}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-sm">
            <p>You haven't uploaded any shorts yet.</p>
            <p className="mt-1">Click "Upload a Short" to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};
