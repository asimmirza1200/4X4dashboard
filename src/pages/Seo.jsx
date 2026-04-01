import { useTranslation } from "react-i18next";
import ReactTagInput from "@pathofdev/react-tag-input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { Input, Textarea, Button } from "@windmill/react-ui";
import PageTitle from "@/components/Typography/PageTitle";
import { pages } from "@/utils/static-seo";
import requests from "@/services/httpService";
import { notifyError, notifySuccess } from "@/utils/toast";

const SEO = () => {
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState({});
  const [keywordsState, setKeywordsState] = useState({});
  const [keywordsErrors, setKeywordsErrors] = useState({}); // track keywords validation errors
 const [loading, setLoading] = useState(true); // Loader state
  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues });

  // Fetch initial SEO data
  useEffect(() => {
    const fetchInitialData = async () => {
          setLoading(true); // start loader
      const fetchedData = {};
      const keywords = {};
      for (const page of pages) {
        try {
          const response = await requests.get(`/seo/${page}`);
          fetchedData[page] = response?.data || {
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
          };
          keywords[page] = fetchedData[page]?.metaKeywords || [];
        } catch {
          fetchedData[page] = {
            metaTitle: "",
            metaDescription: "",
            metaKeywords: [],
          };
          keywords[page] = [];
        }
      }
      setInitialValues(fetchedData);
      setKeywordsState(keywords);
      reset(fetchedData);
       setLoading(false); // stop loader
    };
    fetchInitialData();
  }, []);

  // Handle update for a single page
  const handleUpdate = (page) => async () => {
    // Reset keywords error
    setKeywordsErrors((prev) => ({ ...prev, [page]: false }));

    // Validate title & description
    const isValid = await trigger(page);
    if (!isValid) return notifyError("Please fill required fields");

    // Validate keywords
    const currentKeywords = keywordsState[page] || [];
    if (currentKeywords.length === 0) {
      setKeywordsErrors((prev) => ({ ...prev, [page]: true }));
      return notifyError("Please add at least one keyword");
    }

    try {
      const values = getValues(page);
      const response = await requests.post("/seo/add", { ...values, page });
      if (response?.status === 200 || response?.status === 201) {
        notifySuccess(response?.message || "SEO updated successfully");
      }
    } catch {
      notifyError("Something went wrong!");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <PageTitle>{t("SEO Management")}</PageTitle>

      {/* Mobile Card Layout */}
      <div className="block lg:hidden">
        {pages.map((page, idx) => (
          <div key={page} className="bg-white border border-gray-300 rounded-lg shadow-md mb-4 p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">{page}</h3>

            {/* Meta Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <Input
                {...register(`${page}.metaTitle`, { required: "Meta Title is required!" })}
                placeholder="Meta Title"
                className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 w-full"
              />
              {errors[page]?.metaTitle && (
                <span className="text-red-500 text-sm">{errors[page]?.metaTitle?.message}</span>
              )}
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <Textarea
                {...register(`${page}.metaDescription`, { required: "Meta Description is required!" })}
                placeholder="Meta Description"
                rows={3}
                className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 w-full"
              />
              {errors[page]?.metaDescription && (
                <span className="text-red-500 text-sm">{errors[page]?.metaDescription?.message}</span>
              )}
            </div>

            {/* Meta Keywords */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keywords
              </label>
              <ReactTagInput
                placeholder="Meta Keywords"
                tags={keywordsState[page] || []}
                onChange={(newTags) => {
                  setKeywordsState((prev) => ({ ...prev, [page]: newTags }));
                  setValue(`${page}.metaKeywords`, newTags);
                  if (newTags.length > 0) {
                    setKeywordsErrors((prev) => ({ ...prev, [page]: false }));
                  }
                }}
              />
              {keywordsErrors[page] && (
                <span className="text-red-500 text-sm">Please add at least one keyword</span>
              )}
            </div>

            {/* Action Button */}
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
              onClick={handleUpdate(page)}
            >
              Save
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block">
        <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="border p-3 text-left">Page</th>
              <th className="border p-3 text-left">Meta Title</th>
              <th className="border p-3 text-left">Meta Description</th>
              <th className="border p-3 text-left">Meta Keywords</th>
              <th className="border p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {pages.map((page, idx) => (
              <tr key={page} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border p-2 font-semibold capitalize text-gray-700">{page}</td>

                {/* Meta Title */}
                <td className="border p-2">
                  <Input
                    {...register(`${page}.metaTitle`, { required: "Meta Title is required!" })}
                    placeholder="Meta Title"
                    className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200"
                  />
                  {errors[page]?.metaTitle && (
                    <span className="text-red-500 text-sm">{errors[page]?.metaTitle?.message}</span>
                  )}
                </td>

                {/* Meta Description */}
                <td className="border p-2">
                  <Textarea
                    {...register(`${page}.metaDescription`, { required: "Meta Description is required!" })}
                    placeholder="Meta Description"
                    rows={2}
                    className="border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200"
                  />
                  {errors[page]?.metaDescription && (
                    <span className="text-red-500 text-sm">{errors[page]?.metaDescription?.message}</span>
                  )}
                </td>

                {/* Meta Keywords */}
                <td className="border p-2">
                  <ReactTagInput
                    placeholder="Meta Keywords"
                    tags={keywordsState[page] || []}
                    onChange={(newTags) => {
                      setKeywordsState((prev) => ({ ...prev, [page]: newTags }));
                      setValue(`${page}.metaKeywords`, newTags);
                      if (newTags.length > 0) {
                        setKeywordsErrors((prev) => ({ ...prev, [page]: false }));
                      }
                    }}
                  />
                  {keywordsErrors[page] && (
                    <span className="text-red-500 text-sm">Please add at least one keyword</span>
                  )}
                </td>

                {/* Action */}
                <td className="border p-2 text-center">
                  <Button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleUpdate(page)}
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SEO;