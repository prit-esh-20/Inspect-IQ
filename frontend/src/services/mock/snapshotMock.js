const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Static snapshot stand-in. There is no camera in mock mode, so a frame can
// never be captured from the backend. Client-side capture of the actual
// displayed frame (uploaded image) is handled in the useSnapshot hook.
export const snapshotMock = {
  async captureFromCamera() {
    await delay(300);
    throw new Error("No camera connection available.");
  },
};
