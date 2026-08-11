'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number | null;
  onChange: (val: number | null) => void;
  disabled?: boolean;
}

export default function StarRating({ value, onChange, disabled = false }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handleRatingClick = (rating: number) => {
    if (disabled) return;
    // Toggle rating off if clicking same rating
    if (value === rating) {
      onChange(null);
    } else {
      onChange(rating);
    }
  };

  return (
    <div className={`flex flex-col space-y-1.5 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      <div className="flex items-center space-x-1">
        {stars.map((star) => {
          const isFilled = value !== null && star <= value;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => handleRatingClick(star)}
              className={`p-1 transition-all focus:outline-none ${
                disabled
                  ? 'cursor-not-allowed text-zinc-700'
                  : 'cursor-pointer hover:scale-110 text-zinc-600 hover:text-emerald-400'
              }`}
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={28}
                className={`transition-colors ${
                  isFilled ? 'fill-emerald-500 text-emerald-400' : 'text-zinc-700'
                }`}
              />
            </button>
          );
        })}
      </div>
      {disabled && (
        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">
          Locked: Candidate must be marked &quot;Presented&quot; to rate.
        </span>
      )}
    </div>
  );
}
