import { apiRequest } from "./api";

// POST /upload/pet-image — sends the image as dataUrl, returns { petImageUrl } with a real server path.
export function uploadPetImage(dataUrl) {
  return apiRequest("/upload/pet-image", {
    method: "POST",
    body: { dataUrl },
    auth: true,
  });
}
