import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SidebarContext } from "@/context/SidebarContext";
import VendorServices from "@/services/VendorServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useVendorSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } =
    useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const vendorData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        description: data.description,
        status: data.status || "active",
      };

      if (id) {
        const res = await VendorServices.updateVendor(id, vendorData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      } else {
        const res = await VendorServices.createVendor(vendorData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getVendorData = async () => {
    try {
      const res = await VendorServices.getVendorById(id);
      if (res) {
        setResData(res);
        setValue("name", res.name);
        setValue("email", res.email);
        setValue("phone", res.phone);
        setValue("companyName", res.companyName);
        setValue("address", res.address);
        setValue("city", res.city);
        setValue("state", res.state);
        setValue("postalCode", res.postalCode);
        setValue("country", res.country);
        setValue("description", res.description);
        setValue("status", res.status);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("email");
      setValue("phone");
      setValue("companyName");
      setValue("address");
      setValue("city");
      setValue("state");
      setValue("postalCode");
      setValue("country");
      setValue("description");
      setValue("status");
      clearErrors("name");
      clearErrors("email");
      clearErrors("phone");
      clearErrors("companyName");
      clearErrors("address");
      clearErrors("city");
      clearErrors("state");
      clearErrors("postalCode");
      clearErrors("country");
      clearErrors("description");
      clearErrors("status");
      return;
    }
    if (id) {
      getVendorData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen, clearErrors]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  };
};

export default useVendorSubmit;
