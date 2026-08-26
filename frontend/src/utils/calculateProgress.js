export const calculateProgress = (raised, target) => {
  if (!target || target === 0) return 0;
  const r = Math.max(parseFloat(raised) || 0, 0); // NaN / undefined / negative → 0
  return Math.min((r / target) * 100, 100);
};

