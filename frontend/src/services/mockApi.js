const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock authentication — swap with the real auth API when the backend is ready.
export const mockApi = {
  login: async (email, password) => {
    await delay(600);

    const match =
      email.toLowerCase() === "user@pcbvision.xai" && password === "user123"
        ? { name: "User", email: "user@pcbvision.xai", role: "Engineering" }
        : null;

    if (!match) {
      throw new Error("Invalid email or password. Please try again.");
    }

    return {
      token: "mock-jwt-" + Date.now(),
      user: {
        name: match.name,
        email: match.email,
        role: match.role,
      },
    };
  },
};