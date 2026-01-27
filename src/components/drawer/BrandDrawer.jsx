import React, { useState, useEffect, useContext } from "react";
import { Input, Label, Button, Textarea } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import BrandServices from "@/services/BrandsServices";
import useAsync from "@/hooks/useAsync";
import { SidebarContext } from "@/context/SidebarContext";
import Uploader from "@/components/image-uploader/Uploader";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import spinnerLoadingImage from "@/assets/img/spinner.gif";

const BrandDrawer = ({ id, lang }) => {
  const { t } = useTranslation();
  const { setIsUpdate, toggleDrawer } = useContext(SidebarContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    website_url: "",
    logo_url: "",
    is_active: true,
  });

  // Fetch brand data if editing
  const { data: brand, loading } = useAsync(
    () => (id ? BrandServices.getBrandById(id) : Promise.resolve(null)),
    [id]
  );

  useEffect(() => {
    if (brand) {
      setBrandData({
        name: brand.name || "",
        description: brand.description || "",
        website_url: brand.website_url || "",
        logo_url: brand.logo_url || brand.image || "",
        is_active: brand.is_active !== false,
      });
    } else {
      // Reset form for new brand
      setBrandData({
        name: "",
        description: "",
        website_url: "",
        logo_url: "",
        is_active: true,
      });
    }
  }, [brand, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData({
      ...brandData,
      [name]: value,
    });
  };

  const handleLogoUpload = (url) => {
    setBrandData({
      ...brandData,
      logo_url: url,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!brandData.name || !brandData.name.trim()) {
      toast.error(t("Brand name is required"));
      return;
    }

    // Validate website URL format if provided
    if (brandData.website_url && brandData.website_url.trim()) {
      try {
        new URL(brandData.website_url);
      } catch (urlError) {
        toast.error(t("Please enter a valid website URL (e.g., https://example.com)"));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (id) {
        // Update existing brand
        const response = await BrandServices.updateBrand(id, brandData);
        toast.success(t("Brand updated successfully"));
        if (response.affectedProductsCount > 0) {
          toast.info(
            t("{{count}} products visibility updated", { count: response.affectedProductsCount })
          );
        }
      } else {
        // Create new brand
        await BrandServices.addBrand(brandData);
        toast.success(t("Brand created successfully"));
      }
      // Close drawer and refresh
      toggleDrawer();
      setIsUpdate(true);
    } catch (error) {
      // Handle specific error messages
      const errorMessage = error.response?.data?.message || error.message || t("Failed to save brand");
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        {id ? t("Edit Brand") : t("Add Brand")}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>
            <span>{t("Brand Name")} *</span>
            <Input
              className="mt-1"
              name="name"
              value={brandData.name}
              onChange={handleChange}
              required
              placeholder={t("Enter brand name")}
            />
          </Label>
        </div>

        <div className="mb-4">
          <Label>
            <span>{t("Logo")}</span>
            <Uploader
              setImageUrl={handleLogoUpload}
              imageUrl={brandData.logo_url}
              folder="brands"
            />
          </Label>
        </div>

        <div className="mb-4">
          <Label>
            <span>{t("Description")}</span>
            <Textarea
              className="mt-1"
              name="description"
              value={brandData.description}
              onChange={handleChange}
              rows="3"
              placeholder={t("Enter brand description")}
            />
          </Label>
        </div>

        <div className="mb-4">
          <Label>
            <span>{t("Website URL")}</span>
            <Input
              className="mt-1"
              name="website_url"
              type="url"
              value={brandData.website_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </Label>
        </div>

        <div className="mb-4">
          <SwitchToggle
            id="brand-active"
            title={t("Active Status")}
            processOption={brandData.is_active}
            handleProcess={(checked) => {
              setBrandData({ ...brandData, is_active: checked });
            }}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            layout="outline"
            onClick={toggleDrawer}
          >
            {t("Cancel")}
          </Button>
          <Button 
            type="submit" 
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <img
                  src={spinnerLoadingImage}
                  alt="Loading"
                  width={16}
                  height={16}
                  className="inline-block mr-2"
                />
                {id ? t("Updating...") : t("Creating...")}
              </>
            ) : (
              id ? t("Update") : t("Create")
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BrandDrawer;

