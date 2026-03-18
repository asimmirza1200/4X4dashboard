import React, { useEffect, useState } from "react";
import { t } from "i18next";
import axios from "axios";
import Cookies from "js-cookie";
import { useDropzone } from "react-dropzone";
// import cloudinary from "cloudinary/lib/cloudinary";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FiUploadCloud, FiXCircle } from "react-icons/fi";

//internal import
import useAsync from "@/hooks/useAsync";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import Container from "@/components/image-uploader/Container";

// cloudinary?.config({
//   cloud_name: import.meta.env.VITE_APP_CLOUD_NAME,
//   api_key: import.meta.env.VITE_APP_CLOUDINARY_API_KEY,
//   api_secret: import.meta.env.VITE_APP_CLOUDINARY_API_SECRET,
// });

// Max image size: 500 KB (user requirement for banner/page images)
const MAX_IMAGE_SIZE_BYTES = 500 * 1024; // 512000

const Uploader = ({ setImageUrl, imageUrl, product, folder }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState("");

  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    multiple: product ? true : false,
    maxSize: MAX_IMAGE_SIZE_BYTES,
    maxFiles: globalSetting?.number_of_image_per_product || 2,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // Validate file types explicitly
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidFiles = rejectedFiles.filter(
        (file) => !validTypes.includes(file.file.type)
      );

      if (invalidFiles.length > 0) {
        notifyError("Only .jpeg, .jpg, .png, and .webp image formats are allowed!");
      }

      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    if (fileRejections) {
      fileRejections.map(({ file, errors }) => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map((e) => (
              <li key={e.code}>
                {e.code === "too-many-files"
                  ? notifyError(
                    `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
                  )
                  : notifyError(
                    e.code === "file-too-large"
                      ? `File is too large. Maximum size is 500 KB.`
                      : e.message
                  )}
              </li>
            ))}
          </ul>
        </li>
      ));
    }

    if (files) {
      files.forEach((file) => {
        if (
          product &&
          imageUrl?.length + files?.length >
          globalSetting?.number_of_image_per_product
        ) {
          return notifyError(
            `Maximum ${globalSetting?.number_of_image_per_product} Image Can be Upload!`
          );
        }

        setLoading(true);
        setError("Uploading....");

        // if (product) {
        //   const result = imageUrl?.find(
        //     (img) => img === `${import.meta.env.VITE_APP_CLOUDINARY_URL}`
        //   );

        //   if (result) return setLoading(false);
        // }


        const formData = new FormData();
        formData.append('images', file);

        // Get auth token from cookies
        let adminInfo;
        if (Cookies.get("adminInfo")) {
          adminInfo = JSON.parse(Cookies.get("adminInfo"));
        }

        const baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5055/api';
// Extract server URL for images (remove /api suffix if present)
const serverURL = baseURL.endsWith('/api') ? baseURL.slice(0, -4) : baseURL;
       console.log("baseURL",baseURL)
       console.log("serverURL",serverURL) 
        axios({
          // backend: app.use("/api/upload", uploadRoutes);
          // if baseURL already includes /api, just append /upload/images
          url: `${baseURL}/upload/images`,

          method: "POST",
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
          },
          data: formData,
        })
          .then((res) => {
            notifySuccess("Image Uploaded successfully!");
            setLoading(false);
            setError("");
            
            // Clear the files state after successful upload
            setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
            
            if (product) {
              // For products, add the URL to the array
              const uploadedUrl = res?.data?.files?.[0]?.url || res?.data?.url;
              if (uploadedUrl) {
                console.log("uploadedUrl",uploadedUrl)
                // Construct full URL if it's a relative path
                const fullUrl = uploadedUrl.startsWith('http') 
                  ? uploadedUrl 
                  : `${serverURL}${uploadedUrl}`;
                  console.log("fullUrl",fullUrl)
                setImageUrl((imgUrl) => [...(imgUrl || []), fullUrl]);
              }
            } else {
              // For single image, set the URL directly
              const uploadedUrl = res?.data?.files?.[0]?.url || res?.data?.url;
              if (uploadedUrl) {
                // Construct full URL if it's a relative path
                const fullUrl = uploadedUrl.startsWith('http') 
                  ? uploadedUrl 
                  : `${serverURL}${uploadedUrl}`;
                setImageUrl(fullUrl);
              }
            }
          })
          .catch((err) => {
            notifyError(err.response?.data?.message || err.message || "Image upload failed");
            setLoading(false);
            setError("");
            // Remove failed file from preview
            setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className="inline-flex border-2 border-gray-100 w-24 max-h-24"
          src={file.preview}
          alt={file.name}
        />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  const handleRemoveImage = async (img) => {
    try {

      setLoading(false);
      // notifyError(
      //   res.result === "ok" ? "Image delete successfully!" : res.result
      // );
      notifyError("Image delete successfully!");
      if (product) {
        const result = imageUrl?.filter((i) => i !== img);
        setImageUrl(result);
      } else {
        setImageUrl("");
        setFiles([])
      }
    } catch (err) {
      console.error("err", err);
      notifyError(err.Message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      <div
        className="border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md cursor-pointer px-6 pt-5 pb-6"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl text-emerald-500" />
        </span>
        <p className="text-sm mt-2">{t("DragYourImage")}</p>
        <em className="text-xs text-gray-400">Only .jpeg, .jpg, .png, and .webp. Max 500 KB per image.</em>
      </div>

      <div className="text-emerald-500">{loading && err}</div>
      <aside className="flex flex-row flex-wrap mt-4">
        {product ? (
          <DndProvider backend={HTML5Backend}>
            <Container
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              handleRemoveImage={handleRemoveImage}
            />
          </DndProvider>
        ) : !product && imageUrl !== "" ? (
          <div className="relative">

            <img
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-24 max-h-24 p-2"
              src={imageUrl}
              alt="product"
            />
            <button
              type="button"
              className="absolute top-0 right-0 text-red-500 focus:outline-none"
              onClick={() => handleRemoveImage(imageUrl)}
            >
              <FiXCircle />
            </button>
          </div>
        ) : (
          thumbs
        )}
      </aside>
    </div>
  );
};

export default Uploader;
