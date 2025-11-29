import React from 'react';
import { StarIcon } from './IconComponents';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'base';
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    base: 'w-5 h-5',
  };

  const percentage = (rating / maxRating) * 100;

  return (
    <div role="img" aria-label={`Rating: ${rating.toFixed(1)} out of ${maxRating} stars.`} className="relative inline-block">
      {/* Background stars (empty) */}
      <div className="flex">
        {[...Array(maxRating)].map((_, i) => (
          <StarIcon key={`empty-${i}`} className={`${sizeClasses[size]} text-gray-300`} />
        ))}
      </div>
      {/* Foreground stars (filled), clipped by the percentage width */}
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${percentage}%` }}>
        <div className="flex">
          {[...Array(maxRating)].map((_, i) => (
            <StarIcon key={`full-${i}`} className={`${sizeClasses[size]} text-yellow-400`} />
          ))}
        </div>
      </div>
    </div>
  );
};