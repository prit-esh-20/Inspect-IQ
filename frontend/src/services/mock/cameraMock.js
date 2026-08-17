const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Static camera stand-in. There is no real camera device in mock mode, so the
// honest status is DISCONNECTED — never a fake "ready" state.
export const cameraMock = {
  async getStatus() {
    await delay(300);
    return {
      status: "DISCONNECTED",
      message: "No camera device connected.",
      videoNode: null,
    };
  },
};
