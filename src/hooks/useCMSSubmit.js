import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { notifyError, notifySuccess } from "@/utils/toast";
import CMServices from "@/services/CMServices";

const useCMSSubmit = (id) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      CMServices.getCMSByPage(id)
        .then((data) => {
          setValue("page", data.page);
          
          // Format content for editing
          let formattedContent = data.content || '';
          if (typeof data.content === 'object') {
            formattedContent = JSON.stringify(data.content, null, 2);
          }
          setValue("content", formattedContent);
        })
        .catch((error) => {
          notifyError(error.message || "Failed to load CMS content");
        });
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Parse content if it's a JSON string
      let parsedContent = data.content;
      if (typeof data.content === 'string') {
        try {
          parsedContent = JSON.parse(data.content);
        } catch (e) {
          // Keep as string if parsing fails
          parsedContent = data.content;
        }
      }
      
      const submissionData = {
        page: data.page,
        content: parsedContent,
      };
      
      if (id) {
        // Update existing CMS content
        await CMServices.updateCMSContent(id, submissionData);
        notifySuccess("CMS content updated successfully");
      } else {
        // Create new CMS content
        await CMServices.updateCMSContent(data.page, submissionData);
        notifySuccess("CMS content created successfully");
      }
      reset();
    } catch (error) {
      notifyError(error.message || "Failed to save CMS content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    reset,
    onSubmit: handleSubmit(onSubmit),
    isSubmitting,
    errors,
  };
};

export default useCMSSubmit;
