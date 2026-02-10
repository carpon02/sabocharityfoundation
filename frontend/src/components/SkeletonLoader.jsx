import React from 'react';

/**
 * Modern Skeleton Loader Components
 * Professional loading placeholders for better UX
 */

/**
 * Campaign Card Skeleton
 */
export const CampaignCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-20" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-2 bg-gray-200 rounded w-full" />
      <div className="flex justify-between">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

/**
 * Blog Card Skeleton
 */
export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-6 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Table Row Skeleton
 */
export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-32" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-24" />
    </td>
    <td className="px-6 py-4">
      <div className="h-4 bg-gray-200 rounded w-20" />
    </td>
    <td className="px-6 py-4">
      <div className="h-6 bg-gray-200 rounded-full w-16" />
    </td>
  </tr>
);

/**
 * Dashboard Stats Skeleton
 */
export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-xl p-6 shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-32 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    ))}
  </div>
);

/**
 * Form Field Skeleton
 */
export const FormFieldSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24" />
    <div className="h-12 bg-gray-200 rounded-lg" />
  </div>
);

/**
 * Generic Skeleton with customizable width
 */
export const Skeleton = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`} />
);

export default {
  CampaignCardSkeleton,
  BlogCardSkeleton,
  TableRowSkeleton,
  StatsSkeleton,
  FormFieldSkeleton,
  Skeleton
};




