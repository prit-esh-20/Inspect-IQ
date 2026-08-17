// Converts an unknown thrown value into a human-readable message.
// Axios errors prefer their response data message; everything else falls
// back to the raw message with a backend-availability hint.
export const toErrorMessage = (err, fallback) => {
  if (!err) return fallback;

  const dataMessage =
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.response?.data?.error;

  if (dataMessage) return String(dataMessage);

  if (err?.code === "ECONNABORTED") return "Request timed out. Backend connection unavailable.";

  const raw = err?.message || "";
  if (/network|connect|socket/i.test(raw)) {
    return "Backend connection unavailable.";
  }

  return raw || fallback;
};
