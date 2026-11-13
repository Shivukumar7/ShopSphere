import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, numReviews, showCount = true, size = 'sm', interactive = false, onRatingChange }) => {
  const starSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const currentSize = starSizes[size] || starSizes.sm;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.round(rating);
          return (
            <button
              type="button"
              key={starIndex}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange && onRatingChange(starIndex)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${currentSize} ${
                  filled ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showCount && (
        <span className="text-xs text-slate-500 font-medium">
          {rating.toFixed(1)} {numReviews !== undefined && `(${numReviews})`}
        </span>
      )}
    </div>
  );
};
