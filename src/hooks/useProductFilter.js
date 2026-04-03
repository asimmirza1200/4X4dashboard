/* eslint-disable react-hooks/exhaustive-deps */
import Ajv from "ajv";
import csvToJson from "csvtojson";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess, notifyInfo } from "@/utils/toast";
import { toast } from "react-toastify";

// custom product upload validation schema
const schema = {
  type: "object",
  properties: {
    categories: { type: "array" },
    image: { type: "array" },
    tag: { type: "array" },
    variants: { type: "array" },
    show: { type: "array" },
    status: { type: "string" },
    prices: { type: "object" },
    profitMargin: { type: "object" },
    quickDiscount: { type: "object" },
    isCombination: { type: "boolean" },
    title: { type: "object" },
    productId: { type: "string" },
    slug: { type: "string" },
    category: {  type: ["object", "null"]  },
    stock: { type: "number" },
    sales: { type: "string" },
    description: { type: "object" },
    excerpt: {
      type: "string",
    },
    weight: {
      type: "string",
    },
    length: {
      type: "string",
    },
    width: {
      type: "string",
    },
    height: {
      type: "string",
    },
    manufacturerSku: {
      type: "string",
    },
    internalSku: {
      type: "string",
    },
    additionalProductDetails: {
      type: "string",
    },
    brand: { type: "object" },
    vendor: { type: "object" },
    isFeatured: { type: "boolean" },
  },
  required: ["prices", "title"],
};

// Helper function to process and upload images during import
const processImportImages = async (imageUrls) => {
  console.log("Processing images:", imageUrls);
  
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    console.log("No images to process");
    return [];
  }

  const baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5055/api';
  const serverURL = baseURL.endsWith('/api') ? baseURL.slice(0, -4) : baseURL;
  
  console.log("Base URL:", baseURL);
  console.log("Server URL:", serverURL);
  
  let adminInfo;
  if (Cookies.get("adminInfo")) {
    adminInfo = JSON.parse(Cookies.get("adminInfo"));
    console.log("Admin info found:", adminInfo ? "Yes" : "No");
  } else {
    console.log("No admin info found in cookies");
  }

  const processedImages = [];

  for (const imageUrl of imageUrls) {
    console.log("Processing image URL:", imageUrl);
    
    // Skip empty or invalid URLs
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.log("Skipping invalid URL:", imageUrl);
      continue;
    }

    // During import, only download and store images from OUR server
    // Keep external website URLs as-is to save storage and improve speed
    if (imageUrl.startsWith('http')) {
      // Check if the image is from our server
      if (imageUrl.includes(serverURL) || imageUrl.includes('res.cloudinary.com/ahossain')) {
        console.log("Image URL from our server detected, downloading and uploading:", imageUrl);
        try {
          // Download the image from URL with proper headers to avoid CORS
          const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 30000, // 30 second timeout for large images
            headers: {
              'Accept': 'image/*',
              'Cache-Control': 'no-cache'
            }
          });
        
        console.log("Downloaded image successfully, size:", response.data.byteLength);
        
        // Create a blob from the response data
        const blob = new Blob([response.data], { 
          type: response.headers['content-type'] || 'image/jpeg' 
        });
        
        // Create FormData and upload to our server
        const formData = new FormData();
        formData.append('images', blob, `imported-image-${Date.now()}.jpg`);

        console.log("Uploading to server...");
        const uploadResponse = await axios({
          url: `${baseURL}/upload/images`,
          method: "POST",
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: adminInfo ? `Bearer ${adminInfo.token}` : null,
          },
          data: formData,
          timeout: 60000 // 60 second timeout for upload
        });

        console.log("Upload response:", uploadResponse.data);

        const uploadedUrl = uploadResponse?.data?.files?.[0]?.url || uploadResponse?.data?.url;
        if (uploadedUrl) {
          const fullUrl = uploadedUrl.startsWith('http') ? uploadedUrl : `${serverURL}${uploadedUrl}`;
          processedImages.push(fullUrl);
          console.log(`Successfully uploaded image: ${imageUrl} -> ${fullUrl}`);
        }
      } catch (error) {
        console.error(`Failed to upload image ${imageUrl}:`, error);
        console.error("Error details:", error.response?.data || error.message);
        // For CORS errors, keep the original URL as fallback
        if (error.message.includes('CORS') || error.message.includes('Network Error')) {
          console.log("CORS/Network error detected, keeping original URL as fallback");
          processedImages.push(imageUrl);
        } else {
          processedImages.push(imageUrl);
        }
      }
      } else {
        // External URL - keep as-is to save storage and improve speed
        console.log("External image URL detected, keeping original:", imageUrl);
        processedImages.push(imageUrl);
      }
    } else {
      // For relative paths that aren't uploads, construct full URL
      console.log("Relative path detected, constructing full URL:", imageUrl);
      processedImages.push(`${serverURL}${imageUrl}`);
    }
  }

  console.log("Final processed images:", processedImages);
  return processedImages;
};

const useProductFilter = () => {
  const ajv = new Ajv({ allErrors: true });
  const { setLoading, setIsUpdate } = useContext(SidebarContext);

  const [newProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [filename, setFileName] = useState("");
  const [isDisabled, setIsDisable] = useState(false);

  //service data filtering
  const serviceData = [];

  //  console.log('selectedFile',selectedFile)

  const handleOnDrop = (data) => {
    // console.log('data', data);
    for (let i = 0; i < data.length; i++) {
      newProducts.push(data[i].data);
    }
  };

  const handleUploadProducts = () => {
    // return notifyError("This feature is disabled for demo!");
    if (newProducts.length < 1) {
      notifyError("Please upload/select csv file first!");
    } else {
      // return notifySuccess("CRUD operation disable for demo!");
      ProductServices.addAllProducts(newProducts)
        .then((res) => {
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
  };

  const handleSelectFile = async (e) => {
    e.preventDefault();

    const fileReader = new FileReader();
    const file = e.target?.files[0];

    console.log("File detected:", file);
    console.log("File type:", file?.type);

    if (file && file.type === "application/json") {
      setFileName(file?.name);
      setIsDisable(true);
      notifySuccess("Processing JSON file and uploading images...");

      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = async (e) => {
        console.log("JSON file loaded successfully");
        console.log("Raw file content:", e.target.result);
        
        try {
          const text = JSON.parse(e.target.result);
          console.log("Parsed JSON:", text);

          // Check for vendor information in the file
          const vendorNames = text
            .map(item => item.vendor?.name || item.vendor)
            .filter(vendor => vendor && vendor.trim() !== "");
          
          const uniqueVendorNames = [...new Set(vendorNames)];
          
          if (uniqueVendorNames.length === 0) {
            notifyError("❌ Vendor names not found in file! Please add vendor names to your products and try again.");
            setIsDisable(false);
            return;
          }

          console.log("Found vendors in file:", uniqueVendorNames);
          notifySuccess(`✅ Found ${uniqueVendorNames.length} vendor(s) in file: ${uniqueVendorNames.join(", ")}`);

          // Process all products to handle image uploads
          const productData = await Promise.all(
            text.map(async (value) => {
              console.log("Mapping value:", value);
              
              // Process images for this product
              const processedImages = await processImportImages(value.image || []);
              
              return {
                categories: value.categories,
                image: processedImages,
                barcode: value.barcode,
                tag: value.tag,
                variants: value.variants,
                status: value.status,
                prices: value.prices,
                isCombination: typeof value.isCombination === 'string' ? JSON.parse(value.isCombination.toLowerCase()) : Boolean(value.isCombination),
                isFeatured: value?.isFeatured === true || value?.isFeatured === "Yes" || true,
                title: value.title,
                productId: value.productId,
                slug: value.slug,
                sku: value.sku,
                category: value.category ,
                stock: value.stock,
                description: value.description,
                brand: value.brand || "",
                vendor: value.vendor || { name: "", postalCode: "" },
                weight: value.weight || "",
                length: value.length || "",
                width: value.width || "",
                height: value.height || "",
              };
            })
          );
        console.log("Final productData:", productData);
        // console.log("productData", productData);
        setSelectedFile(productData);
        notifySuccess(`Successfully processed ${productData.length} products with images!`);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          notifyError("Error parsing JSON file: " + error.message);
        }
      };
    } else if (file && (file.type === "text/csv" || file.type === "application/csv" || file.type === "application/vnd.ms-excel" || file.name.toLowerCase().endsWith('.csv'))) {
      console.log("CSV file detected, processing...");
      setFileName(file?.name);
      setIsDisable(true); // Disable import button immediately when file is selected
      // Don't show notification yet - wait to show progress during actual processing

      fileReader.onload = async (event) => {
        try {
          console.log("CSV file loaded successfully");
          const text = event.target.result;
          console.log("Raw CSV content:", text);
          
          const json = await csvToJson().fromString(text);
          console.log("Converted CSV to JSON:", json);
          console.log("CSV - Number of products to process:", json.length);
          
          // Check for vendor information in the CSV file
          const vendorNames = json
            .map(item => item?.Vendor || item?.vendor || item?.["Vendor Name"] || item?.["vendor"])
            .filter(vendor => vendor && vendor.trim() !== "");
          
          const uniqueVendorNames = [...new Set(vendorNames)];
          
          if (uniqueVendorNames.length === 0) {
            notifyError("❌ Vendor names not found in CSV file! Please add a 'Vendor' column to your CSV and try again.");
            setIsDisable(false);
            return;
          }

          console.log("Found vendors in CSV:", uniqueVendorNames);
          notifySuccess(`✅ Found ${uniqueVendorNames.length} vendor(s) in CSV: ${uniqueVendorNames.join(", ")}`);
          
          // Show processing message now that actual processing is starting
          notifyInfo("Processing CSV file and uploading images...", 'csv-processing-toast');
          
        // Process in batches to avoid timeout
        const BATCH_SIZE = 50; // Process 50 products at a time
        const batches = [];
        for (let i = 0; i < json.length; i += BATCH_SIZE) {
          batches.push(json.slice(i, i + BATCH_SIZE));
        }
        
        console.log(`Processing ${batches.length} batches of ${BATCH_SIZE} products each`);
        
        let allProductData = [];
        
        for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
          const batch = batches[batchIndex];
          console.log(`Processing batch ${batchIndex + 1}/${batches.length} with ${batch.length} products`);
          
          // Process current batch (no notification during processing to avoid spam)
          const batchProductData = await Promise.all(
            batch.map(async (value) => {
            console.log("brand",value.Brand)
            console.log("Featured value:", value?.Featured, "featured value:", value?.featured)
            console.log("Featured type:", typeof value?.Featured, "featured type:", typeof value?.featured)
            
            // Process images from CSV
            // Skip empty rows
            if (!value?.["Product Title Name"] && !value?.title && !value?.Name && !value?.name) {
              return null;
            }

            const imageUrls = value?.["Product Image"] || value.Images || value.images ? (value?.["Product Image"] || value.Images || value.images).split("|").map(img => img.trim()).filter(img => img) : [];
            console.log("CSV - Raw image URLs:", imageUrls);
            
            // Show image processing progress
            if (imageUrls.length > 0) {
              console.log(`CSV - Processing ${imageUrls.length} images for product...`);
            }
            
            console.log("CSV - About to call processImportImages");
            const processedImages = await processImportImages(imageUrls);
            console.log("CSV - Processed images:", processedImages);
            
            return {
              image: processedImages,
              tag: value?.["Product Tag"] || value.Tags || value.tags ? (value?.["Product Tag"] || value.Tags || value.tags).split("|").map(tag => tag.trim()).filter(tag => tag) : [],
              
              // Basic Information
              productId: value?.["Product Id"] || value?.productId || value?.ID || value?.id || value?.Id || "",
              title: {
                en: value?.["Product Title Name"] || value?.title || value?.Name || value?.name || "",
              },
              description: {
                en: value?.["Product Description"] || value?.description || value?.Description || "",
              },
              excerpt: value?.["Product Excerpt"] || value?.excerpt || value?.Excerpt || "",
              
              // Categorization
              category: value?.Category ? { name: value.Category.trim() } : null,
              defaultCategory: value?.["Default Category"] ? { name: value?.["Default Category"].trim() } : null,
              
              // Pricing Information
              prices: {
                originalPrice: Number(value?.["RRP"]) || 0,
                price: Number(value?.["Wholesale Price"]) || 0,
                discount: Number(value?.["Quick Discount"]) || 0,
                tradePrice: Number(value?.["Wholesale Price"]) || 0,
              },
              quickDiscountType: value?.["Quick Discount Type"] || "fixed",
              
              // Inventory Management
              stock: Number(value?.["Product Quantity"]) || 10,
              slug: value?.["Product Slug"] || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              
              // Physical Attributes
              weight: String(value?.["Product Weight"] || ""),
              length: String(value?.["Product Length"] || ""),
              width: String(value?.["Product Width"] || ""),
              height: String(value?.["Product Height"] || ""),
              
              // SKU Management
              sku: value?.["Product SKU"] || "",
              barcode: value?.["Product Barcode"] || "",
              manufacturerSku: value?.["Manufacturer SKU"] || "",
              internalSku: value?.["Internal SKU"] || "",
              
              // Tags & Classification
              brand: value?.Brand ? { name: value.Brand.trim() } : { name: "" },
              vendor: value?.Vendor || value?.vendor || value?.["Vendor Name"] ? { 
                name: (value?.Vendor || value?.vendor || value?.["Vendor Name"]).trim(),
                postalCode: (value?.["Vendor Postal Code"] || value?.["Vendor Postcode"] || value?.["Vendor Zip"] || value?.vendorPostalCode || "").trim()
              } : { name: "", postalCode: "" },
              
              // Additional Product Information
              additionalProductDetails: value?.["Additional Product Details"] || "",
              lastBatchOrderedFromManufacturer: value?.["Last Batch Ordered From Manufacturer"] || "",
              lastBatchOrderQuantity: Number(value?.["Last Batch Order Quantity"]) || 0,
              lastBatchOrderReference: value?.["Last Batch Order Reference"] || "",
              stockArrivalDate: value?.["Stock Arrival Date"] || "",
              vehicleMake: value?.["Vehicle Make"] || "",
              vehicleModel: value?.["Vehicle Model"] || "",
              
              // Shipping & Supplier
              flatRateForDropShipping: Number(value?.["Flat Rate for Drop Shipping"]) || 0,
              shipOutLocation: value?.["Ship Out Location"] || "",
              directSupplierLink: value?.["Direct Supplier Link"] || "",
              
              // SEO Fields
              metaTitle: value?.["Product Meta Title"] || "",
              metaDescription: value?.["Meta Product Description"] || "",
              metaKeywords: value?.["Product Meta Keywords"] ? value?.["Product Meta Keywords"].split("|").map(keyword => keyword.trim()).filter(keyword => keyword) : [],
              
              // Other existing fields
              isCombination: false,
              isFeatured: value?.Featured === "Yes" || value?.featured === "Yes" || value?.Featured === true || value?.featured === true || true,
            };
          })
        );

          // Filter out null entries from this batch
          const filteredBatchData = batchProductData.filter(product => product !== null);
          allProductData = [...allProductData, ...filteredBatchData];
          
          console.log(`Completed batch ${batchIndex + 1}/${batches.length}. Total products so far: ${allProductData.length}`);
          
          // Add a small delay between batches to prevent overwhelming the server
          if (batchIndex < batches.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
          }
        }

        // Filter out null entries (empty rows)
        const filteredProductData = allProductData.filter(product => product !== null);
        setSelectedFile(filteredProductData);
        
        // Dismiss processing toast and show success message
        toast.dismiss('csv-processing-toast');
        setIsDisable(false); // Re-enable import button
        notifySuccess(`✅ File processed successfully! ${filteredProductData.length} products ready for import. Click "Import" to save to database.`);
        } catch (error) {
          console.error("Error processing CSV:", error);
          
          // Dismiss processing toast and show error message
          toast.dismiss('csv-processing-toast');
          setIsDisable(false); // Re-enable import button on error
          notifyError("Error processing CSV file: " + error.message);
        }
      };

      fileReader.readAsText(file);
    } else {
      console.log("Unsupported file type detected:", file?.type);
      setFileName(file?.name);
      setIsDisable(true);

      notifyError("Unsupported file type!");
    }
  };

  const handleUploadMultiple = (e) => {
    // return notifyError("This feature is disabled for demo!");
    if (selectedFile.length >= 1) {
      console.log("Starting upload process with", selectedFile.length, "products");
      console.log("Selected file data:", selectedFile);
      
      // Show admin that actual import is starting - simple 5 second toast
      notifyInfo(`🚀 Importing ${selectedFile.length} products in background... You can continue working while we process them.`, 'import-background-toast');
      
      setLoading(true);
      let productDataValidation = selectedFile.map((value, index) => {
        console.log(`Validating product ${index}:`, value);
        const isValid = ajv.validate(schema, value);
        console.log(`Validation errors for product ${index}:`, JSON.stringify(ajv.errors, null, 2));
        return isValid;
      });

      console.log("Validation results:", productDataValidation);

      const isBelowThreshold = (currentValue) => currentValue === true;
      const validationData = productDataValidation.every(isBelowThreshold);
      
      console.log("All validations passed:", validationData);
       console.log("Selected file data:", JSON.stringify(selectedFile, null, 2));
      if (validationData) {
        // Start import in background - don't wait for response
        ProductServices.addAllProducts(selectedFile)
          .then((res) => {
            console.log("Upload successful:", res);
            setIsUpdate(true);
            // Background import completed successfully
          })
          .catch((err) => {
            console.error("Upload error:", err);
            // Background import failed - admin can check logs
          });
        
        // Immediately show success message and reset UI
        setLoading(false);
        handleRemoveSelectFile(); // Clear the file after starting upload
      } else {
        setLoading(false);
        notifyError("Please enter valid data!");
      }
    } else {
      setLoading(false);
      notifyError("Please select a valid json, csv & xls file first!");
    }
  };

  const handleRemoveSelectFile = (e) => {
    // console.log('remove');
    setFileName("");
    setSelectedFile([]);
    setTimeout(() => setIsDisable(false), 1000);
  };

  return {
    filename,
    isDisabled,
    handleSelectFile,
    serviceData,
    handleOnDrop,
    handleUploadProducts,
    handleRemoveSelectFile,
    handleUploadMultiple,
  };
};

export default useProductFilter;
