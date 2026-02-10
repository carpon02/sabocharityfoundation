const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    funded: { label: 'Fully Funded', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    completed: { label: 'Completed', className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    ended: { label: 'Ended', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' }
  };

  const config = statusConfig[status] || statusConfig.active;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;