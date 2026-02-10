export const calculateProgress = (raised, target) => {
  if (!target || target === 0) return 0;
  return Math.min((raised / target) * 100, 100);
};
