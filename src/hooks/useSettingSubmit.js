import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useDispatch } from "react-redux";
import { removeSetting } from "@/reduxStore/slice/settingSlice";

const useSettingSubmit = (id) => {
  const dispatch = useDispatch();
  const { setIsUpdate } = useContext(SidebarContext);
  const [isSave, setIsSave] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // console.log("errors", errors);
  // console.log("enabledCOD", enabledCOD);

  const onSubmit = async (data) => {
    console.log("data", data);
    console.log("isSave value:", isSave);
    
    // Ensure default_currency has a value
    const processedData = {
      ...data,
      default_currency: data.default_currency || "$"
    };
    
    console.log("processedData:", processedData);
    localStorage.setItem("data", JSON.stringify(processedData));
    // return notifyError("This feature is disabled for demo!");
    try {
      setIsSubmitting(true);
      const settingData = {
        name: "globalSetting",
        setting: {
          //for common setting
          number_of_image_per_product: processedData.number_of_image_per_product,
          shop_name: processedData.shop_name,
          address: processedData.address,
          company_name: processedData.company_name,
          vat_number: processedData.vat_number,
          post_code: processedData.post_code,
          contact: processedData.contact,
          email: processedData.email,
          website: processedData.website,
          receipt_size: processedData.receipt_size,
          default_currency: processedData.default_currency,
          default_time_zone: processedData.default_time_zone,
          default_date_format: processedData.default_date_format,
        },
      };

      console.log("global setting", settingData, "data", data);
      // return;

      if (!isSave) {
        const res = await SettingServices.updateGlobalSetting(settingData);
        // await socket.emit("notification", {
        //   message: `Global setting updated`,
        //   option: "globalSetting",
        // });
        setIsUpdate(true);
        setIsSubmitting(false);
        dispatch(removeSetting("globalSetting"));

        // window.location.reload();
        notifySuccess(res.message);
      } else {
        const res = await SettingServices.addGlobalSetting(settingData);
        // await socket.emit("notification", {
        //   message: `Global setting added`,
        //   option: "globalSetting",
        // });
        setIsUpdate(true);
        setIsSubmitting(false);

        window.location.reload();
        notifySuccess(res.message);
      }
    } catch (err) {
      // console.log("err", err);
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await SettingServices.getGlobalSetting();
        console.log("getGlobalSetting response:", res);
        if (res) {
          setIsSave(false);
          setValue(
            "number_of_image_per_product",
            res.number_of_image_per_product
          );
          setValue("shop_name", res.shop_name);
          setValue("address", res.address);
          setValue("company_name", res.company_name);
          setValue("vat_number", res.vat_number);
          setValue("post_code", res.post_code);
          setValue("contact", res.contact);
          setValue("email", res.email);
          setValue("website", res.website);
          setValue("receipt_size", res.receipt_size);
          setValue("default_currency", res.default_currency);
          setValue("default_time_zone", res?.default_time_zone);
          setValue("default_date_format", res?.default_date_format);
        }
      } catch (err) {
        console.log("No settings found or error:", err);
        console.log("Keeping isSave as true (will add new settings)");
        notifyError(err?.response?.data?.message || err?.message);
      }
    })();
  }, []);

  return {
    errors,
    register,
    isSave,
    isSubmitting,
    onSubmit,
    handleSubmit,
  };
};

export default useSettingSubmit;
