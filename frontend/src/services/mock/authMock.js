const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Static auth mock — swap for a real login endpoint when the backend is ready.
export const authMock = {
  async login(email, password) {
    await delay(500);
    const match =
      email.toLowerCase() === "user@inspectiq.xai" && password === "user123"
        ? { name: "User", email: "user@inspectiq.xai", role: "Engineering" }
        : null;

    if (!match) {
      throw new Error("Invalid email or password. Please try again.");
    }

    return {
      token: "mock-jwt-token",
      user: { ...match },
    };
  },
};