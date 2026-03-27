/* eslint-disable react-hooks/exhaustive-deps */
import Ajv from "ajv";
import csvToJson from "csvtojson";
import { useContext, useState } from "react";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";

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
    isFeatured: { type: "boolean" },
  },
  required: ["prices", "title"],
};

const useProductFilter = (data) => {
  const ajv = new Ajv({ allErrors: true });
  const { setLoading, setIsUpdate } = useContext(SidebarContext);

  const [newProducts] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [filename, setFileName] = useState("");
  const [isDisabled, setIsDisable] = useState(false);

  //service data filtering
  const serviceData = data || [];

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

      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = (e) => {
        console.log("JSON file loaded successfully");
        console.log("Raw file content:", e.target.result);
        
        try {
          const text = JSON.parse(e.target.result);
          console.log("Parsed JSON:", text);

          const productData = text.map((value) => {
          console.log("Mapping value:", value);
          return {
            categories: value.categories,
            image: value.image,
            barcode: value.barcode,
            tag: value.tag,
            variants: value.variants,
            status: value.status,
            prices: value.prices,
            isCombination: typeof value.isCombination === 'string' ? JSON.parse(value.isCombination.toLowerCase()) : Boolean(value.isCombination),
            title: value.title,
            productId: value.productId,
            slug: value.slug,
            sku: value.sku,
            category: value.category ,
            stock: value.stock,
            description: value.description,
            brand: value.brand || "",
            weight: value.weight || "",
            length: value.length || "",
            width: value.width || "",
            height: value.height || "",
          };
        });
        console.log("Final productData:", productData);
        // console.log("productData", productData);
        setSelectedFile(productData);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          notifyError("Error parsing JSON file: " + error.message);
        }
      };
    } else if (file && (file.type === "text/csv" || file.type === "application/csv" || file.type === "application/vnd.ms-excel" || file.name.toLowerCase().endsWith('.csv'))) {
      console.log("CSV file detected, processing...");
      setFileName(file?.name);
      setIsDisable(true);

      fileReader.onload = async (event) => {
        try {
          console.log("CSV file loaded successfully");
          const text = event.target.result;
          console.log("Raw CSV content:", text);
          
          const json = await csvToJson().fromString(text);
          console.log("Converted CSV to JSON:", json);
          
        const productData = json.map((value) => {
          console.log("brand",value.Brand)
          return {
            image: value.Images || value.images ? (value.Images || value.images).split("|").map(img => img.trim()).filter(img => img) : [],
            tag: value.Tags || value.tags ? (value.Tags || value.tags).split("|").map(tag => tag.trim()).filter(tag => tag) : [],
            prices: {
              originalPrice: Number(value?.Price || value?.price) || 0,
              price: Number(value?.Price || value?.price) || 0,
              discount: 0,
              tradePrice: 0,
            },
            isCombination: false,
            title: {
              en: value?.Name || value?.name || value?.["Product name"] || value?.["product name"] || "",
            },
            
            weight: value?.Weight || value?.weight || "",
            productId: value?.ID || value?.id || value?.Id || "",
            slug: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            sku: value?.SKU || value?.sku || "",
            stock: Number(value?.Stock) || 10,
            description: {
              en: value?.Description || value?.description || "",
            },
            // ✅ FIX HERE
    brand: value?.Brand
      ? { name: value.Brand.trim() }
      : null,
            isFeatured: value?.Featured === "Yes" || value?.featured === "Yes",
          };
        });

        setSelectedFile(productData);
        } catch (error) {
          console.error("Error processing CSV:", error);
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
        ProductServices.addAllProducts(selectedFile)
          .then((res) => {
            console.log("Upload successful:", res);
            setIsUpdate(true);
            setLoading(false);
            notifySuccess(res.message);
            handleRemoveSelectFile(); // Clear the file after successful upload
          })
          .catch((err) => {
            console.error("Upload error:", err);
            setLoading(false);
            notifyError(err.message);
          });
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
    data,
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
