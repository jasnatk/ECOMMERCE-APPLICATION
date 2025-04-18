import React from "react";

export const WishlistCardSkeltons = () => {
  return (
    <div className="card bg-base-100 shadow-sm animate-pulse w-full max-w-xs">
      <div className="w-full h-48 bg-base-200"></div>
      <div className="card-body p-3 space-y-2">
        <div className="h-4 bg-base-200 rounded w-3/4"></div>
        <div className="h-3 bg-base-200 rounded w-1/2"></div>
        <div className="h-3 bg-base-200 rounded w-1/3"></div>
        <div className="h-8 bg-base-200 rounded"></div>
      </div>
    </div>
  );
};