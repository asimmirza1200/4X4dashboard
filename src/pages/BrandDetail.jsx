import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  CardBody,
  Input,
  Label,
  Textarea,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Pagination,
  Badge,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import { FiArrowLeft, FiSave, FiEdit2, FiX, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

//internal import
import useAsync from "@/hooks/useAsync";
import BrandServices from "@/services/BrandsServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import Uploader from "@/components/image-uploader/Uploader";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { Link } from "react-router-dom";
import ContactFormModal from "@/components/brand/ContactFormModal";

const BrandDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const { limitData, handleChangePage, currentPage } = useContext(SidebarContext);
  const { currency, showingTranslateValue } = useUtilsFunction();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [brandData, setBrandData] = useState({
    name: "",
    description: "",
    website_url: "",
    logo_url: "",
    is_active: true,
  });
  const [productsPage, setProductsPage] = useState(1);
  
  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Fetch brand data
  const { data: brand, loading: brandLoading, error: brandError } = useAsync(
    () => BrandServices.getBrandById(id),
    [id]
  );

  // Fetch brand products
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useAsync(
    () => BrandServices.getBrandProducts(id, { page: productsPage, limit: limitData }),
    [id, productsPage, limitData]
  );

  // Fetch contacts
  const fetchContacts = async () => {
    if (!id) return;
    setContactsLoading(true);
    try {
      const response = await BrandServices.getBrandContacts(id);
      setContacts(response.contacts || []);
    } catch (error) {
      toast.error(error.message || t("Failed to fetch contacts"));
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContacts();
    }
  }, [id]);

  // Update brandData when brand is fetched
  useEffect(() => {
    if (brand) {
      setBrandData({
        name: brand.name || "",
        description: brand.description || "",
        website_url: brand.website_url || "",
        logo_url: brand.logo_url || brand.image || "",
        is_active: brand.is_active !== false,
      });
    }
  }, [brand]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBrandData({
      ...brandData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle logo upload
  const handleLogoUpload = (url) => {
    setBrandData({
      ...brandData,
      logo_url: url,
    });
  };

  // Handle toggle visibility
  const handleToggleVisibility = async (newStatus) => {
    // If disabling, show confirmation with warning about products
    if (!newStatus && brand) {
      const productCount = brand.productCount || 0;
      const confirmMessage = productCount > 0
        ? t("Disabling this brand will hide all {{count}} linked products. Are you sure?", { count: productCount })
        : t("Are you sure you want to disable this brand?");
      
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    try {
      const response = await BrandServices.updateBrand(id, { is_active: newStatus });
      const affectedCount = response.affectedProductsCount || 0;
      const productCount = response.productCount || 0;
      
      setBrandData({ ...brandData, is_active: newStatus });
      
      if (newStatus) {
        toast.success(
          affectedCount > 0
            ? t("Brand enabled successfully. {{count}} products are now visible.", { count: affectedCount })
            : productCount > 0
            ? t("Brand enabled successfully. All {{count}} products are visible.", { count: productCount })
            : t("Brand enabled successfully")
        );
      } else {
        toast.success(
          affectedCount > 0
            ? t("Brand disabled successfully. {{count}} products have been hidden.", { count: affectedCount })
            : t("Brand disabled successfully")
        );
      }
      
      // Refresh brand data and products list to reflect visibility changes
      window.location.reload(); // Full refresh to ensure all data is updated
    } catch (error) {
      toast.error(error.message || t("Failed to update brand status"));
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      await BrandServices.updateBrand(id, brandData);
      toast.success(t("Brand updated successfully"));
      setIsEditing(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      toast.error(error.message || t("Failed to update brand"));
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (brand) {
      setBrandData({
        name: brand.name || "",
        description: brand.description || "",
        website_url: brand.website_url || "",
        logo_url: brand.logo_url || brand.image || "",
        is_active: brand.is_active !== false,
      });
    }
    setIsEditing(false);
  };

  // Contact management handlers
  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm(t("Are you sure you want to delete this contact?"))) {
      return;
    }

    try {
      await BrandServices.deleteBrandContact(id, contactId);
      toast.success(t("Contact deleted successfully"));
      fetchContacts(); // Refresh contacts list
    } catch (error) {
      toast.error(error.message || t("Failed to delete contact"));
    }
  };

  const handleContactSuccess = () => {
    fetchContacts(); // Refresh contacts list
  };

  if (brandLoading) {
    return (
      <>
        <PageTitle>{t("Brand Details")}</PageTitle>
        <TableLoading row={10} col={5} width={160} height={20} />
      </>
    );
  }

  if (brandError || !brand) {
    return (
      <>
        <PageTitle>{t("Brand Details")}</PageTitle>
        <NotFound title="Brand" />
      </>
    );
  }

  return (
    <>
      <PageTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              layout="outline"
              icon={FiArrowLeft}
              onClick={() => history.push("/brands")}
            >
              {t("Back to Brands")}
            </Button>
            <span>{t("Brand Details")}</span>
          </div>
          {!isEditing && (
            <Button
              icon={FiEdit2}
              onClick={() => setIsEditing(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {t("Edit Brand")}
            </Button>
          )}
        </div>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {/* Brand Information Card */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">{t("Brand Information")}</h3>

            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <Label>
                    <span>{t("Brand Name")} *</span>
                    <Input
                      className="mt-1"
                      name="name"
                      value={brandData.name}
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    />
                  </Label>
                </div>

                <div>
                  <Label>
                    <span>{t("Logo")}</span>
                    <Uploader
                      setImageUrl={handleLogoUpload}
                      imageUrl={brandData.logo_url}
                      folder="brands"
                    />
                  </Label>
                </div>

                <div>
                  <Label>
                    <span>{t("Description")}</span>
                    <Textarea
                      className="mt-1"
                      name="description"
                      value={brandData.description}
                      onChange={handleChange}
                      rows="4"
                      disabled={!isEditing}
                    />
                  </Label>
                </div>

                <div>
                  <Label>
                    <span>{t("Website URL")}</span>
                    <Input
                      className="mt-1"
                      name="website_url"
                      type="url"
                      value={brandData.website_url}
                      onChange={handleChange}
                      placeholder="https://example.com"
                      disabled={!isEditing}
                    />
                  </Label>
                </div>

                <div>
                  <SwitchToggle
                    id="brand-active"
                    title={t("Active Status")}
                    processOption={brandData.is_active}
                    handleProcess={(checked) => {
                      setBrandData({ ...brandData, is_active: checked });
                    }}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    layout="outline"
                    icon={FiX}
                    onClick={handleCancelEdit}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    icon={FiSave}
                    onClick={handleSave}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {t("Save Changes")}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* Logo Display */}
                {brandData.logo_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={brandData.logo_url}
                      alt={brand.name}
                      className="h-32 w-32 object-contain border rounded-lg p-2"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-gray-500 dark:text-gray-400">
                    {t("Brand Name")}
                  </Label>
                  <p className="text-lg font-semibold dark:text-gray-300">
                    {brandData.name}
                  </p>
                </div>

                {brandData.description && (
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      {t("Description")}
                    </Label>
                    <p className="text-sm dark:text-gray-300">
                      {brandData.description}
                    </p>
                  </div>
                )}

                {brandData.website_url && (
                  <div>
                    <Label className="text-gray-500 dark:text-gray-400">
                      {t("Website")}
                    </Label>
                    <a
                      href={brandData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-600 hover:underline"
                    >
                      {brandData.website_url}
                    </a>
                  </div>
                )}

                <div>
                  <Label className="text-gray-500 dark:text-gray-400">
                    {t("Status")}
                  </Label>
                  <div className="mt-1">
                    <SwitchToggle
                      id="brand-status"
                      processOption={brandData.is_active}
                      handleProcess={handleToggleVisibility}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-500 dark:text-gray-400">
                    {t("Product Count")}
                  </Label>
                  <p className="text-lg font-semibold dark:text-gray-300">
                    {brand.productCount || 0}
                  </p>
                </div>

                <div>
                  <Label className="text-gray-500 dark:text-gray-400">
                    {t("Created")}
                  </Label>
                  <p className="text-sm dark:text-gray-300">
                    {dayjs(brand.createdAt).format("MMM DD, YYYY [at] h:mm A")}
                  </p>
                </div>

                <div>
                  <Label className="text-gray-500 dark:text-gray-400">
                    {t("Last Updated")}
                  </Label>
                  <p className="text-sm dark:text-gray-300">
                    {dayjs(brand.updatedAt).format("MMM DD, YYYY [at] h:mm A")}
                  </p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Associated Products Card */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <CardBody>
            <h3 className="text-lg font-semibold mb-4">
              {t("Associated Products")} ({productsData?.totalDoc || 0})
            </h3>

            {productsLoading ? (
              <TableLoading row={5} col={4} width={120} height={15} />
            ) : productsError ? (
              <span className="text-red-500">{productsError}</span>
            ) : productsData?.products && productsData.products.length > 0 ? (
              <>
                <TableContainer className="mb-4">
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableCell>{t("Product")}</TableCell>
                        <TableCell>{t("SKU")}</TableCell>
                        <TableCell>{t("Stock")}</TableCell>
                        <TableCell>{t("Price")}</TableCell>
                        <TableCell>{t("Status")}</TableCell>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {productsData.products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>
                            <Link
                              to={`/product/${product._id}`}
                              className="text-sm text-emerald-600 hover:underline"
                            >
                              {showingTranslateValue(product?.title)}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {product.sku || "—"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              type={
                                product.stock > 0
                                  ? "success"
                                  : product.stock === 0
                                  ? "danger"
                                  : "warning"
                              }
                            >
                              {product.stock || 0}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium">
                              {currency}
                              {product.prices?.price || product.prices?.originalPrice || 0}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              type={product.status === "show" ? "success" : "danger"}
                            >
                              {product.status === "show" ? t("Active") : t("Inactive")}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {productsData.totalPages > 1 && (
                  <Pagination
                    totalResults={productsData.totalDoc}
                    resultsPerPage={limitData}
                    onChange={(page) => setProductsPage(page)}
                    label="Products Pagination"
                  />
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("No products associated with this brand")}
              </p>
            )}
          </CardBody>
        </Card>

        {/* Contacts Card */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 md:col-span-2">
          <CardBody>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {t("Contacts")} ({contacts.length})
              </h3>
              <Button
                icon={FiPlus}
                onClick={handleAddContact}
                className="bg-emerald-600 hover:bg-emerald-700"
                size="small"
              >
                {t("Add Contact")}
              </Button>
            </div>

            {contactsLoading ? (
              <TableLoading row={3} col={5} width={120} height={15} />
            ) : contacts.length > 0 ? (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {contact.contact_name}
                          </h4>
                          {contact.position_title && (
                            <Badge type="neutral" className="text-xs">
                              {contact.position_title}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {contact.phone && (
                            <p>
                              <span className="font-medium">{t("Phone")}:</span>{" "}
                              {contact.phone}
                            </p>
                          )}
                          {contact.email && (
                            <p>
                              <span className="font-medium">{t("Email")}:</span>{" "}
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-emerald-600 hover:underline"
                              >
                                {contact.email}
                              </a>
                            </p>
                          )}
                          {contact.notes && (
                            <p className="text-xs italic mt-2">
                              {contact.notes}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          {t("Added")}: {dayjs(contact.createdAt).format("MMM DD, YYYY")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEditContact(contact)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          title={t("Edit")}
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact._id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title={t("Delete")}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                {t("No contacts added yet. Click 'Add Contact' to add one.")}
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setEditingContact(null);
        }}
        brandId={id}
        contact={editingContact}
        onSuccess={handleContactSuccess}
      />
    </>
  );
};

export default BrandDetail;

