import { storage } from "./firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadImage = async (file: File, folder: string, id: string, fileName: string) => {
  if (!file) return '';

  const filePath = `${folder}/${id}/${fileName}`;

  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
