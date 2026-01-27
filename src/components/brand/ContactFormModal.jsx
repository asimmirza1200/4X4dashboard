import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, Input, Label, Textarea, Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import BrandServices from "@/services/BrandsServices";

const ContactFormModal = ({ isOpen, onClose, brandId, contact, onSuccess }) => {
  const { t } = useTranslation();
  const [contactData, setContactData] = useState({
    contact_name: "",
    position_title: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load contact data if editing
  useEffect(() => {
    if (contact) {
      setContactData({
        contact_name: contact.contact_name || "",
        position_title: contact.position_title || "",
        phone: contact.phone || "",
        email: contact.email || "",
        notes: contact.notes || "",
      });
    } else {
      // Reset form for new contact
      setContactData({
        contact_name: "",
        position_title: "",
        phone: "",
        email: "",
        notes: "",
      });
    }
  }, [contact, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!contactData.contact_name.trim()) {
      toast.error(t("Contact name is required"));
      return;
    }

    setIsSubmitting(true);
    try {
      if (contact) {
        // Update existing contact
        await BrandServices.updateBrandContact(brandId, contact._id, contactData);
        toast.success(t("Contact updated successfully"));
      } else {
        // Create new contact
        await BrandServices.addBrandContact(brandId, contactData);
        toast.success(t("Contact added successfully"));
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      toast.error(error.message || t("Failed to save contact"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setContactData({
      contact_name: "",
      position_title: "",
      phone: "",
      email: "",
      notes: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalBody className="px-6 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {contact ? t("Edit Contact") : t("Add Contact")}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>
              <span>{t("Contact Name")} *</span>
              <Input
                className="mt-1"
                name="contact_name"
                value={contactData.contact_name}
                onChange={handleChange}
                required
                placeholder={t("Enter contact name")}
              />
            </Label>
          </div>

          <div>
            <Label>
              <span>{t("Position Title")}</span>
              <Input
                className="mt-1"
                name="position_title"
                value={contactData.position_title}
                onChange={handleChange}
                placeholder={t("e.g., Sales Manager")}
              />
            </Label>
          </div>

          <div>
            <Label>
              <span>{t("Phone Number")}</span>
              <Input
                className="mt-1"
                name="phone"
                type="tel"
                value={contactData.phone}
                onChange={handleChange}
                placeholder="+61412345678"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t("E.164 format (e.g., +61412345678)")}
              </p>
            </Label>
          </div>

          <div>
            <Label>
              <span>{t("Email Address")}</span>
              <Input
                className="mt-1"
                name="email"
                type="email"
                value={contactData.email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </Label>
          </div>

          <div>
            <Label>
              <span>{t("Notes")}</span>
              <Textarea
                className="mt-1"
                name="notes"
                value={contactData.notes}
                onChange={handleChange}
                rows="3"
                placeholder={t("Internal notes about this contact")}
              />
            </Label>
          </div>

          <ModalFooter className="px-0 pb-0">
            <div className="flex justify-end space-x-3 w-full">
              <Button
                type="button"
                layout="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {isSubmitting
                  ? t("Saving...")
                  : contact
                  ? t("Update")
                  : t("Add Contact")}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default ContactFormModal;

