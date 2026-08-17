// Static upload stand-in. The uploaded image itself is real user data — its
// local object URL is returned so the frontend can preview the ACTUAL file.
// The real backend upload is handled by uploadApi when API_CONFIG.useMock is
// false.
export const uploadMock = {
  async uploadImage(file) {
    if (!file) throw new Error("No file provided.");
    const imageUrl = URL.createObjectURL(file);
    return {
      uploadId: `UPLOAD-LOCAL-${Date.now()}`,
      imageUrl,
      fileName: file.name,
      source: "upload",
    };
  },
};
