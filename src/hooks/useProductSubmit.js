import combinate from "combinate";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import swal from "sweetalert";

//internal import
import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import AttributeServices from "@/services/AttributeServices";
import ProductServices from "@/services/ProductServices";
import { notifyError, notifySuccess } from "@/utils/toast";
// import useTranslationValue from "./useTranslationValue";
import useUtilsFunction from "./useUtilsFunction";

// Safe JSON parsing helper
const safeJSONParse = (jsonString) => {
  // Handle null, undefined, non-string values
  if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === "" || jsonString === '""') {
    return [];
  }
  
  // If it's already an array, return it as-is
  if (Array.isArray(jsonString)) {
    return jsonString;
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("JSON parse error:", error, "Input:", jsonString);
    return [];
  }
};

// Helper to convert image URLs to full URLs
const processImageUrls = (images) => {
  if (!Array.isArray(images)) return [];
  
  // Get the base URL from environment or use the same logic as Uploader
  const baseURL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5055/api';
  const serverURL = baseURL.endsWith('/api') ? baseURL.slice(0, -4) : baseURL;
  
  return images.map(img => {
    if (typeof img === 'string') {
      // If it's already a full URL, return as-is
      if (img.startsWith('http')) {
        return img;
      }
      // If it's a relative path, convert to full URL
      return `${serverURL}${img}`;
    }
    return img; // Return non-string values as-is
  });
};

const useProductSubmit = (id) => {
  const location = useLocation();
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);

  const { data: attribue } = useAsync(AttributeServices.getShowingAttributes);

  // react ref
  const resetRef = useRef([]);
  const resetRefTwo = useRef("");

  // react hook
  const [imageUrl, setImageUrl] = useState([]);
  const [tag, setTag] = useState([]);
  const [metaKeywords, setMetaKeywords] = useState([]);
  const [values, setValues] = useState({});
  let [variants, setVariants] = useState([]);
  const [variant, setVariant] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const [originalPrice, setOriginalPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [isBasicComplete, setIsBasicComplete] = useState(false);
  const [tapValue, setTapValue] = useState("Basic Info");
  const [isCombination, setIsCombination] = useState(false);
  const [attTitle, setAttTitle] = useState([]);
  const [variantTitle, setVariantTitle] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productId, setProductId] = useState("");
  const [updatedId, setUpdatedId] = useState(id);
  const [imgId, setImgId] = useState("");
  const [isBulkUpdate, setIsBulkUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [defaultCategory, setDefaultCategory] = useState([]);
  const [resData, setResData] = useState({});
  const [language, setLanguage] = useState(lang);
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slug, setSlug] = useState("");

  // new fields
  const [marginType, setMarginType] = useState("percentage");
  const [discountType, setDiscountType] = useState("percentage");
  const [manufacturerSku, setManufacturerSku] = useState("");
  const [internalSku, setInternalSku] = useState("");
  const [additionalProductDetails, setAdditionalProductDetails] = useState("");
  const [
    lastBatchOrderedFromManufacturer,
    setLastBatchOrderedFromManufacturer,
  ] = useState(null);
  const [lastBatchOrderQuantity, setLastBatchOrderQuantity] = useState(0);
  const [lastBatchOrderReference, setLastBatchOrderReference] = useState("");
  const [stockArrivalDate, setStockArrivalDate] = useState(null);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [flatRateForDropShipping, setFlatRateForDropShipping] = useState(0);
  const [shipOutLocation, setShipOutLocation] = useState("");
  const [directSupplierLink, setDirectSupplierLink] = useState("");
  // const { handlerTextTranslateHandler } = useTranslationValue();
  const { showingTranslateValue, getNumber, getNumberTwo } = useUtilsFunction();

  const handleRemoveEmptyKey = (obj) => {
    for (const key in obj) {
      if (obj[key].trim() === "") {
        delete obj[key];
      }
    }
    // console.log("obj", obj);
    return obj;
  };

  // handle click
  const onCloseModal = () => setOpenModal(false);
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    // console.log('data is data',data)
    try {
      setIsSubmitting(true);
      if (!imageUrl) return notifyError("Image is required!");

      // if (data.originalPrice < data.price) {
      //   setIsSubmitting(false);
      //   return notifyError(
      //     "Sale Price must be less then or equal of product price!"
      //   );
      // }
      if (!defaultCategory[0]) {
        setIsSubmitting(false);
        return notifyError("Default Category is required!");
      }

      const updatedVariants = variants.map((v, i) => {
        const newObj = {
          ...v,
          price: getNumberTwo(v?.price),
          originalPrice: getNumberTwo(v?.originalPrice),
          discount: getNumberTwo(v?.discount),
          quantity: Number(v?.quantity || 0),
        };
        return newObj;
      });

      setIsBasicComplete(true);
      setPrice(data.price);
      setQuantity(data.stock);
      setBarcode(data.barcode);
      setSku(data.sku);
      setOriginalPrice(data.originalPrice);

      // const titleTranslates = await handlerTextTranslateHandler(
      //   data.title,
      //   language
      // );
      // const descriptionTranslates = await handlerTextTranslateHandler(
      //   data.description,
      //   language
      // );

      const productData = {
        productId: data.productId,
        sku: data.sku || "",
        barcode: data.barcode || "",
        title: handleRemoveEmptyKey({
          [language]: data.title,
          // ...titleTranslates,
        }),
        description: handleRemoveEmptyKey({
          [language]: data.description || "",
          // ...descriptionTranslates,
        }),
        excerpt: data.excerpt,
        height: data.height,
        width: data.width,
        length: data["length"] || 0,
        weight: data.weight,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: JSON.stringify(metaKeywords),
        slug: data.slug
          ? data.slug
          : data.title.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"),

        categories: selectedCategory.map((item) => item._id),
        category: defaultCategory[0]._id,

        image: imageUrl,
        stock: variants?.length < 1 ? data.stock : Number(totalStock),
        // Send tags as array, not stringified - backend will handle it
        tag: Array.isArray(tag) ? tag : (tag ? [tag] : []),

        prices: {
          price: getNumber(data.price),
          originalPrice: getNumberTwo(data.originalPrice),
          tradePrice: getNumberTwo(data.tradePrice),
          discount: getNumberTwo(data.discountPrice),
        },
        profitMargin: {
          dollarDifference:
            getNumberTwo(data.originalPrice) - getNumberTwo(data.tradePrice),
          percentageDifference:
            getNumberTwo(data.originalPrice) > 0
              ? ((getNumberTwo(data.originalPrice) - getNumberTwo(data.tradePrice)) /
                  getNumberTwo(data.originalPrice)) *
                100
              : 0,
        },
        quickDiscount: {
          dollarAmount: getNumberTwo(data.quickDiscountDollar) || 0,
          percentageAmount: getNumberTwo(data.quickDiscountPercentage) || 0,
          isActive: data.quickDiscountActive === 'true' || data.quickDiscountActive === true,
        },
        isCombination: updatedVariants?.length > 0 ? isCombination : false,
        variants: isCombination ? updatedVariants : [],

        // marginType and discountType are DEPRECATED per requirements - removed
        // marginType: data.marginType,
        // discountType: data.discountType,
        manufacturerSku: data.manufacturerSku,
        internalSku: data.internalSku,
        additionalProductDetails: data.additionalProductDetails,
        lastBatchOrderedFromManufacturer: data.lastBatchOrderedFromManufacturer,
        lastBatchOrderQuantity: data.lastBatchOrderQuantity,
        lastBatchOrderReference: data.lastBatchOrderReference,
        stockArrivalDate: data.stockArrivalDate,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        flatRateForDropShipping: data.flatRateForDropShipping,
        shipOutLocation: data.shipOutLocation,
        directSupplierLink: data.directSupplierLink,
        brand: data.brand || null,
        vendor: data.vendor || null,
      };

      // console.log("productData ===========>", productData, "data", data);
      // return setIsSubmitting(false);

      if (updatedId) {
        const res = await ProductServices.updateProduct(updatedId, productData);
        if (res) {
          if (isCombination) {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsBasicComplete(true);
            setIsSubmitting(false);
            handleProductTap("Combination", true);
          } else {
            setIsUpdate(true);
            notifySuccess(res.message);
            setIsSubmitting(false);
          }
        }

        if (
          tapValue === "Combination" ||
          (tapValue !== "Combination" && !isCombination)
        ) {
          closeDrawer();
        }
      } else {
        const res = await ProductServices.addProduct(productData);
        // console.log("res is ", res);
        if (isCombination) {
          setUpdatedId(res._id);
          setValue("title", res.title[language ? language : "en"]);
          setValue("description", res.description[language ? language : "en"]);
          setValue("height", res.height);
          setValue("width", res.width);
          setValue("length", res["length"]);
          setValue("weight", res.weight);
          setValue("metaTitle", res.metaTitle);
          setValue("metaDescription", res.metaDescription);
          setMetaKeywords(safeJSONParse(res.metaKeywords));

          setValue("excerpt", res.excerpt);
          setValue("slug", res.slug);
          setValue("show", res.show);
          setValue("barcode", res.barcode);
          setValue("stock", res.stock);
          setTag(safeJSONParse(res.tag));
          setImageUrl(processImageUrls(res.image));
          setVariants(res.variants);
          setValue("productId", res.productId);
          setProductId(res.productId);
          setOriginalPrice(res?.prices?.originalPrice);
          setPrice(res?.prices?.price);
          setValue("tradePrice", res?.prices?.tradePrice);
          setBarcode(res.barcode);
          setSku(res.sku);
          // marginType and discountType are DEPRECATED - removed
          // setValue("marginType", res.marginType);
          // setValue("discountType", res.discountType);
          setValue("manufacturerSku", res.manufacturerSku);
          setValue("internalSku", res.internalSku);
          setValue("additionalProductDetails", res.additionalProductDetails);
          setValue(
            "lastBatchOrderedFromManufacturer",
            res.lastBatchOrderedFromManufacturer
          );
          setValue("lastBatchOrderQuantity", res.lastBatchOrderQuantity);
          setValue("lastBatchOrderReference", res.lastBatchOrderReference);
          setValue("stockArrivalDate", res.stockArrivalDate);
          setValue("vehicleMake", res.vehicleMake);
          setValue("vehicleModel", res.vehicleModel);
          setValue("flatRateForDropShipping", res.flatRateForDropShipping);
          setValue("shipOutLocation", res.shipOutLocation);
          setValue("directSupplierLink", res.directSupplierLink);
          const result = res.variants.map(
            ({
              originalPrice,
              price,
              discount,
              quantity,
              barcode,
              sku,
              productId,
              image,
              ...rest
            }) => rest
          );

          setVariant(result);
          setIsUpdate(true);
          setIsBasicComplete(true);
          setIsSubmitting(false);
          handleProductTap("Combination", true);
          notifySuccess("Product Added Successfully!");
        } else {
          setIsUpdate(true);
          notifySuccess("Product Added Successfully!");
        }

        if (
          tapValue === "Combination" ||
          (tapValue !== "Combination" && !isCombination)
        ) {
          setIsSubmitting(false);
          closeDrawer();
        }
      }
    } catch (err) {
      // console.log("err", err);
      setIsSubmitting(false);
      notifyError(err?.response?.data?.message || err?.message);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setSlug("");
      setLanguage(lang);
      setValue("language", language);
      handleProductTap("Basic Info", true);
      setResData({});
      setValue("sku");
      setValue("title");
      setValue("slug");
      setValue("description");
      setValue("excerpt");
      setValue("height");
      setValue("width");
      setValue("length");
      setValue("weight");
      setValue("metaTitle");
      setValue("metaDescription");
      setValue("quantity");
      setValue("stock");
      setValue("originalPrice");
      setValue("tradePrice");
      setValue("price");
      setValue("barcode");
      setValue("productId");
      setValue("excerpt");
      setProductId("");
      // marginType and discountType are DEPRECATED - removed
      // setValue("marginType");
      // setValue("discountType");
      setValue("manufacturerSku");
      setValue("internalSku");
      setValue("additionalProductDetails");
      setValue("lastBatchOrderedFromManufacturer");
      setValue("lastBatchOrderQuantity");
      setValue("lastBatchOrderReference");
      setValue("stockArrivalDate");
      setValue("vehicleMake");
      setValue("vehicleModel");
      setValue("flatRateForDropShipping");
      setValue("shipOutLocation");
      setValue("directSupplierLink");
      setValue("vendor");
      // setValue('show');
      setImageUrl([]);
      setTag([]);
      setMetaKeywords([]);
      setVariants([]);
      setVariant([]);
      setValues({});
      setTotalStock(0);
      setSelectedCategory([]);
      setDefaultCategory([]);
      if (location.pathname === "/products") {
        resetRefTwo?.current?.resetSelectedValues();
      }

      clearErrors("sku");
      clearErrors("title");
      clearErrors("slug");
      clearErrors("description");
      clearErrors("height");
      clearErrors("width");
      clearErrors("length");
      clearErrors("wight");
      clearErrors("metaTitle");
      clearErrors("metaDescription");
      clearErrors("metaKeywords");
      clearErrors("stock");
      clearErrors("excerpt");
      clearErrors("quantity");
      setValue("stock", 0);
      setValue("costPrice", 0);
      setValue("price", 0);
      setValue("originalPrice", 0);
      setValue("tradePrice", 0);
      setValue("dollarDifference", 0);
      setValue("percentageDifference", 0);
      setValue("quickDollarAmount", 0);
      setValue("quickPercentageAmount", 0);
      clearErrors("show");
      clearErrors("barcode");
      // marginType and discountType are DEPRECATED - removed
      // clearErrors("marginType");
      // clearErrors("discountType");
      clearErrors("manufacturerSku");
      clearErrors("internalSku");
      clearErrors("additionalProductDetails");
      clearErrors("lastBatchOrderedFromManufacturer");
      clearErrors("lastBatchOrderQuantity");
      clearErrors("lastBatchOrderReference");
      clearErrors("stockArrivalDate");
      clearErrors("vehicleMake");
      clearErrors("vehicleModel");
      clearErrors("flatRateForDropShipping");
      clearErrors("shipOutLocation");
      clearErrors("directSupplierLink");
      clearErrors("vendor");
      setIsCombination(false);
      setIsBasicComplete(false);
      setIsSubmitting(false);
      setAttributes([]);

      setUpdatedId();
      return;
    } else {
      handleProductTap("Basic Info", true);
    }

    if (id) {
      setIsBasicComplete(true);
      (async () => {
        try {
          const res = await ProductServices.getProductById(id);

          // console.log("res", res);

          if (res) {
            setResData(res);
            setSlug(res.slug);
            setUpdatedId(res._id);
            setValue("title", res.title[language ? language : "en"]);
            setValue(
              "description",
              res.description[language ? language : "en"]
            );
            setValue("excerpt", res.excerpt);

            setValue("height", res.height);
            setValue("width", res.width);
            setValue("length", res["length"]);
            setValue("weight", res.weight);
            setValue("metaTitle", res.metaTitle);
            setValue("metaDescription", res.metaDescription);
            setValue("slug", res.slug);
            setValue("show", res.show);
            setValue("sku", res.sku);
            setValue("barcode", res.barcode);
            setValue("stock", res.stock);
            setValue("productId", res.productId);
            setValue("price", res?.prices?.price);
            setValue("originalPrice", res?.prices?.originalPrice);
            setValue("tradePrice", res?.prices?.tradePrice);

            // Set profit margin values
            setValue(
              "dollarDifference",
              res?.profitMargin?.dollarDifference || 0
            );
            setValue(
              "percentageDifference",
              res?.profitMargin?.percentageDifference || 0
            );

            // Set quick discount values
            setValue(
              "quickDollarAmount",
              res?.quickDiscount?.dollarAmount || 0
            );
            setValue(
              "quickPercentageAmount",
              res?.quickDiscount?.percentageAmount || 0
            );
            setValue("stock", res.stock);
            setProductId(res.productId ? res.productId : res._id);
            setBarcode(res.barcode);
            setSku(res.sku);

            // marginType and discountType are DEPRECATED - removed
            // setValue("marginType", res.marginType);
            // setValue("discountType", res.discountType);
            setValue("manufacturerSku", res.manufacturerSku);
            setValue("internalSku", res.internalSku);
            setValue("additionalProductDetails", res.additionalProductDetails);
            setValue(
              "lastBatchOrderedFromManufacturer",
              res.lastBatchOrderedFromManufacturer
            );
            setValue("lastBatchOrderQuantity", res.lastBatchOrderQuantity);
            setValue("lastBatchOrderReference", res.lastBatchOrderReference);
            setValue("stockArrivalDate", res.stockArrivalDate);
            setValue("vehicleMake", res.vehicleMake);
            setValue("vehicleModel", res.vehicleModel);
            setValue("flatRateForDropShipping", res.flatRateForDropShipping);
            setValue("shipOutLocation", res.shipOutLocation);
            setValue("directSupplierLink", res.directSupplierLink);
            setValue("brand", res.brand?._id || res.brand || "");
            setValue("vendor", res.vendor?._id || res.vendor || "");

            if (res.categories) {
              res.categories.map((category) => {
                category.name = showingTranslateValue(category?.name, lang);
                return category;
              });
            }

            if (res.category) {
              res.category.name = showingTranslateValue(
                res?.category?.name,
                lang
              );
            }
            setMetaKeywords(safeJSONParse(res.metaKeywords));
            setSelectedCategory(res.categories || []);
            setDefaultCategory(res?.category ? [res.category] : []);
            setTag(safeJSONParse(res.tag));

            setImageUrl(processImageUrls(res.image));
            setVariants(res.variants);
            setIsCombination(res.isCombination);
            setQuantity(res?.stock);
            setTotalStock(res.stock);
            setOriginalPrice(res?.prices?.originalPrice);
            setPrice(res?.prices?.price);
            
            // Load quick discount data
            setValue('quickDiscountDollar', res?.quickDiscount?.dollarAmount || 0);
            setValue('quickDiscountPercentage', res?.quickDiscount?.percentageAmount || 0);
            setValue('quickDiscountActive', res?.quickDiscount?.isActive || false);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    id,
    setValue,
    isDrawerOpen,
    location.pathname,
    clearErrors,
    language,
    lang,
  ]);

  //for filter related attribute and extras for every product which need to update
  useEffect(() => {
    const result = attribue
      ?.filter((att) => att.option !== "Checkbox")
      .map((v) => {
        return {
          label: showingTranslateValue(v?.title, lang),
          value: showingTranslateValue(v?.title, lang),
        };
      });

    setAttTitle([...result]);

    const res = Object?.keys(Object.assign({}, ...variants));
    const varTitle = attribue?.filter((att) => res.includes(att._id));

    if (variants?.length > 0) {
      const totalStock = variants?.reduce((pre, acc) => pre + acc.quantity, 0);
      setTotalStock(Number(totalStock));
    }
    setVariantTitle(varTitle);
  }, [attribue, variants, language, lang]);

  //for adding attribute values
  const handleAddAtt = (v, el) => {
    const result = attribue.filter((att) => {
      const attribueTItle = showingTranslateValue(att?.title, lang);
      return v.some((item) => item.label === attribueTItle);
    });

    const attributeArray = result.map((value) => {
      const attributeTitle = showingTranslateValue(value?.title, lang);
      return {
        ...value,
        label: attributeTitle,
        value: attributeTitle,
      };
    });

    setAttributes(attributeArray);
  };

  //generate all combination combination
  const handleGenerateCombination = () => {
    if (Object.keys(values).length === 0) {
      return notifyError("Please select a variant first!");
    }

    const result = variants.filter(
      ({
        originalPrice,
        discount,
        price,
        quantity,
        barcode,
        sku,
        productId,
        image,
        ...rest
      }) => JSON.stringify({ ...rest }) !== "{}"
    );

    // console.log("result", result);

    setVariants(result);

    const combo = combinate(values);

    combo.map((com, i) => {
      if (JSON.stringify(variant).includes(JSON.stringify(com))) {
        return setVariant((pre) => [...pre, com]);
      } else {
        const newCom = {
          ...com,

          originalPrice: getNumberTwo(originalPrice),
          price: getNumber(price),
          quantity: Number(quantity),
          discount: Number(originalPrice - price),
          productId: productId && productId + "-" + (variants.length + i),
          barcode: barcode,
          sku: sku,
          image: imageUrl[0] || "",
        };

        setVariants((pre) => [...pre, newCom]);
        return setVariant((pre) => [...pre, com]);
      }
    });

    setValues({});

    // resetRef?.current?.map((v, i) =>
    //   resetRef?.current[i]?.resetSelectedValues()
    // );
  };

  //for clear selected combination
  const handleClearVariant = () => {
    setVariants([]);
    setVariant([]);
    setValues({});
    resetRef?.current?.map(
      async (v, i) => await resetRef?.current[i]?.resetSelectedValues()
    );

    // console.log('value', selectedList, removedItem, resetRef.current);
  };

  //for edit combination values
  const handleEditVariant = (variant) => {
    setTapValue("Combine");
  };

  //for remove combination values
  const handleRemoveVariant = (vari, ext) => {
    // console.log("handleRemoveVariant", vari, ext);
    swal({
      title: `Are you sure to delete this ${ext ? "Extra" : "combination"}!`,
      text: `(If Okay, It will be delete this ${
        ext ? "Extra" : "combination"
      })`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const result = variants.filter((v) => v !== vari);
        setVariants(result);
        // console.log("result", result);
        const {
          originalPrice,
          price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        } = vari;
        const res = variant.filter(
          (obj) => JSON.stringify(obj) !== JSON.stringify(rest)
        );
        setVariant(res);
        setIsBulkUpdate(true);
        // setTimeout(() => setIsBulkUpdate(false), 500);
        const timeOutId = setTimeout(() => setIsBulkUpdate(false), 500);
        return clearTimeout(timeOutId);
      }
    });
  };

  // handle notification for combination and extras
  const handleIsCombination = () => {
    if ((isCombination && variantTitle.length) > 0) {
      swal({
        title: "Are you sure to remove combination from this product!",
        text: "(It will be delete all your combination and extras)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((value) => {
        // console.log(value);
        if (value) {
          setIsCombination(!isCombination);
          setTapValue("Basic Info");
          setVariants([]);
          setVariant([]);
        }
      });
    } else {
      setIsCombination(!isCombination);
      setTapValue("Basic Info");
    }
  };

  //for select bulk action images
  const handleSelectImage = (img) => {
    if (openModal) {
      variants[imgId].image = img;
      setOpenModal(false);
    }
  };

  //for select individual combination image
  const handleSelectInlineImage = (id) => {
    setImgId(id);
    setOpenModal(!openModal);
  };

  //this for variant/combination list
  const handleSkuBarcode = (value, name, id) => {
    variants[id][name] = value;
  };

  const handleProductTap = (e, value, name) => {
    // console.log(e);

    if (value) {
      if (!value)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    } else {
      if (!isBasicComplete)
        return notifyError(
          `${"Please save product before adding combinations!"}`
        );
    }
    setTapValue(e);
  };

  //this one for combination list
  const handleQuantityPrice = (value, name, id, variant) => {
    // console.log(
    //   "handleQuantityPrice",
    //   "name",
    //   name,
    //   "value",
    //   value,
    //   "variant",
    //   variant
    // );
    if (name === "originalPrice" && Number(value) < Number(variant.price)) {
      // variants[id][name] = Number(variant.originalPrice);
      notifyError("Price must be more then or equal of originalPrice!");
      setValue("originalPrice", variant.originalPrice);
      setIsBulkUpdate(true);
      const timeOutId = setTimeout(() => setIsBulkUpdate(false), 100);
      return () => clearTimeout(timeOutId);
    }
    console.log(name, value, variant.originalPrice);
    if (name === "price" && Number(variant.originalPrice) < Number(value)) {
      // variants[id][name] = Number(variant.originalPrice);
      notifyError("Sale Price must be less then or equal of product price!");
      setValue("price", variant.originalPrice);
      setIsBulkUpdate(true);
      const timeOutId = setTimeout(() => setIsBulkUpdate(false), 100);
      return () => clearTimeout(timeOutId);
    }
    setVariants((pre) =>
      pre.map((com, i) => {
        if (i === id) {
          const updatedCom = {
            ...com,
            [name]: Math.round(value),
          };

          if (name === "price") {
            updatedCom.price = getNumberTwo(value);
            updatedCom.discount = Number(variant.originalPrice) - Number(value);
          }
          if (name === "originalPrice") {
            updatedCom.originalPrice = getNumberTwo(value);
            updatedCom.discount = Number(value) - Number(variant.price);
          }

          return updatedCom;
        }
        return com;
      })
    );

    const totalStock = variants.reduce(
      (pre, acc) => Number(pre) + Number(acc.quantity),
      0
    );
    setTotalStock(Number(totalStock));
  };

  //for change language in product drawer
  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("title", resData.title[lang ? lang : "en"]);
      setValue("description", resData.description[lang ? lang : "en"]);
    }
  };

  //for handle product slug
  const handleProductSlug = (value) => {
    setValue("slug", value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
    setSlug(value.toLowerCase().replace(/[^A-Z0-9]+/gi, "-"));
  };

  return {
    tag,
    setTag,
    metaKeywords,
    setMetaKeywords,
    values,
    language,
    register,
    onSubmit,
    errors,
    slug,
    openModal,
    attribue,
    setValues,
    setValue,
    variants,
    imageUrl,
    setImageUrl,
    handleSubmit,
    isCombination,
    variantTitle,
    attributes,
    attTitle,
    handleAddAtt,
    productId,
    onCloseModal,
    isBulkUpdate,
    isSubmitting,
    tapValue,
    setTapValue,
    resetRefTwo,
    handleSkuBarcode,
    handleProductTap,
    selectedCategory,
    setSelectedCategory,
    setDefaultCategory,
    defaultCategory,
    handleProductSlug,
    handleSelectLanguage,
    handleIsCombination,
    handleEditVariant,
    handleRemoveVariant,
    handleClearVariant,
    handleQuantityPrice,
    handleSelectImage,
    handleSelectInlineImage,
    handleGenerateCombination,

    marginType,
    setMarginType,
    discountType,
    setDiscountType,
    manufacturerSku,
    setManufacturerSku,
    internalSku,
    setInternalSku,
    additionalProductDetails,
    setAdditionalProductDetails,
    lastBatchOrderedFromManufacturer,
    setLastBatchOrderedFromManufacturer,
    lastBatchOrderQuantity,
    setLastBatchOrderQuantity,
    lastBatchOrderReference,
    setLastBatchOrderReference,
    stockArrivalDate,
    setStockArrivalDate,
    vehicleMake,
    setVehicleMake,
    vehicleModel,
    setVehicleModel,
    flatRateForDropShipping,
    setFlatRateForDropShipping,
    shipOutLocation,
    setShipOutLocation,
    directSupplierLink,
    setDirectSupplierLink,
    watch,
  };
};

export default useProductSubmit;
