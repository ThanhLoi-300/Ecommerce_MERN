import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../firebase";

export const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `gs://video-8f328.appspot.com/Multi_Vendor_Website/${fileName}`);

      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(storageRef).then((url) => {
            resolve(url); // Truyền giá trị url tới hàm resolve()
          }).catch((error) => {
            console.log("Error getting download URL:", error);
            reject(error);
          });
        })
        .catch((error) => {
          console.log("Error uploading file:", error);
          reject(error);
        });
    });
};

export const uploadFiles = (files) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const uploadPromises = [];

    for (const file of files) {
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `gs://video-8f328.appspot.com/Multi_Vendor_Website/${fileName}`);

      const uploadPromise = uploadBytes(storageRef, file)
        .then((snapshot) => {
          return getDownloadURL(storageRef);
        })
        .catch((error) => {
          console.log("Error uploading file:", error);
          throw error;
        });

      uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
      .then((urls) => {
        resolve(urls);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const deleteImage = async (imagePath) => {
  try {
    const storage = getStorage(app);
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log("Ảnh đã được xóa thành công: "+imagePath);
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
  }
};