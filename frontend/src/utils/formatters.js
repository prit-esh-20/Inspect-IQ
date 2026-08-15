export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
};

export const formatDuration = (sec) => {
  const num = parseFloat(sec);
  if (isNaN(num)) return "0.00s";
  return `${num.toFixed(2)}s`;
};

export const formatPercentage = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "0.0%";
  return `${num.toFixed(1)}%`;
};

export const formatConfidence = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "0.0%";
  return `${num.toFixed(1)}%`;
};
