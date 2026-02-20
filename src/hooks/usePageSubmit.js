import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "@/context/SidebarContext";
import PageServices from "@/services/PageServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import slugify from "slugify";

const usePageSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const [published, setPublished] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bannerImage, setBannerImage] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm();

  const setContent = (val) => setValue("content", val);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const pageData = {
        title: data.title,
        slug: data.slug ? data.slug : slugify(data.title, { lower: true, strict: true }),
        content: data.content || "",
        bannerImage: bannerImage || undefined,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        status: published ? "Published" : "Draft",
        sortOrder: Number(data.sortOrder) || 0,
      };

      if (id) {
        const res = await PageServices.updatePage(id, pageData);
        setIsUpdate(true);
        notifySuccess(res.message);
      } else {
        const res = await PageServices.addPage(pageData);
        setIsUpdate(true);
        notifySuccess(res.message);
      }
      closeDrawer();
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue("title", "");
      setValue("slug", "");
      setValue("content", "");
      setBannerImage("");
      setValue("metaTitle", "");
      setValue("metaDescription", "");
      setValue("sortOrder", 0);
      setPublished(false);
      clearErrors();
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await PageServices.getPageById(id);
          if (res) {
            setValue("title", res.title);
            setValue("slug", res.slug);
            setValue("content", res.content || "");
            setBannerImage(res.bannerImage || "");
            setValue("metaTitle", res.metaTitle || "");
            setValue("metaDescription", res.metaDescription || "");
            setValue("sortOrder", res.sortOrder ?? 0);
            setPublished(res.status === "Published");
          }
        } catch (e) {
          notifyError(e?.response?.data?.message || e?.message);
        }
      })();
    }
  }, [id, isDrawerOpen, setValue, clearErrors]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    getValues,
    setContent,
    published,
    setPublished,
    isSubmitting,
    bannerImage,
    setBannerImage,
  };
};

export default usePageSubmit;
