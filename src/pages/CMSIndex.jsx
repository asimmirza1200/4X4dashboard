'use client'
import React, { useState, useContext, useEffect } from 'react';
import { notifySuccess, notifyError } from "@/utils/toast";
import CMServices from "@/services/CMServices";
import { useCMSData } from "@/hooks/useCMSData";
import { SidebarContext } from "@/context/SidebarContext";
import { cmsFormConfig, getPageConfig } from "@/config/cmsFormConfig";

// UI Components
import { Card, CardBody, Label, Input, Textarea, Button, Select } from "@windmill/react-ui";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import TableLoading from "@/components/preloader/TableLoading";
import CMSForm from "@/components/CMSForm";
import { Modal, ModalBody, ModalFooter } from "@windmill/react-ui";

const CMSIndex = () => {
  const { toggleDrawer, closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const { data, loading, error, refresh } = useCMSData();
  const [cmsPages, setCmsPages] = useState([]);
  const [editingPage, setEditingPage] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [selectedPageType, setSelectedPageType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPageType, setNewPageType] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [formPageType, setFormPageType] = useState('home');
  const [editingPageData, setEditingPageData] = useState(null);

  useEffect(() => {
    if (Array.isArray(data)) {
      setCmsPages(data);
    } else if (data?.pages) {
      setCmsPages(data.pages);
    }
  }, [data]);

  const handleDelete = (page) => {
    setPageToDelete(page);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await CMServices.deleteCMSContent(pageToDelete.page);
      setDeleteModalOpen(false);
      setPageToDelete(null);
      notifySuccess("CMS page deleted successfully");
      setIsUpdate(true);
      refresh();
    } catch (error) {
      console.error('Error deleting CMS content:', error);
      notifyError(error.message || "Failed to delete CMS page");
      setDeleteModalOpen(false);
    }
  };

  const handleAddNewPage = () => {
    console.log('DEBUG handleAddNewPage called');
    console.log('DEBUG current editingPageData before clear:', editingPageData);
    setShowAddModal(true);
    setNewPageType('home');
    // Clear any existing form data
    setEditingPageData(null);
    console.log('DEBUG editingPageData after clear:', editingPageData);
  };

  const handleCreatePage = () => {
    // Check if selected page type already exists
    const pageExists = cmsPages.some(page => page.page === newPageType);
    
    if (pageExists) {
      notifyError(`${cmsFormConfig[newPageType]?.title || newPageType} page already exists. Please edit the existing page instead.`);
      return;
    }
    
    setShowAddModal(false);
    setFormPageType(newPageType);
    setEditingPageData(null);
    setShowForm(true);
  };

  const handlePageTypeChange = (pageType) => {
    setNewPageType(pageType);
    
    // Check if selected page type already exists
    const pageExists = cmsPages.some(page => page.page === pageType);
    if (pageExists) {
      notifyError(`${cmsFormConfig[pageType]?.title || pageType} page already exists. Please edit the existing page instead.`);
    }
  };

  const handleAddModalCancel = () => {
    setShowAddModal(false);
    setNewPageType('home');
  };

  const handleEditPage = (page) => {
    setFormPageType(page.page);
    setEditingPageData(page);
    setShowForm(true);
  };

  const handleFormSave = () => {
    console.log("called")
    setShowForm(false);
    setEditingPageData(null);
    // Trigger immediate data refresh
    refresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPageData(null);
  };

  const filteredPages = () => {
    if (selectedPageType === 'all') {
      return cmsPages;
    }
    return cmsPages.filter(page => page.page === selectedPageType);
  };

  return (
    <>

      <div className="flex justify-between items-center mb-6 mt-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            CMS Content Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage all your website pages content including home, shop, and contact pages with full control over text, images, and form elements.
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleAddNewPage} size="small" className="bg-blue-600 hover:bg-blue-700">
            <FiPlus className="mr-2" />
            Add New Page
          </Button>
        </div>

        {/* Page Type Filter */}
        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Page Type
          </Label>
          <Select
            value={selectedPageType}
            onChange={(e) => setSelectedPageType(e.target.value)}
            className="w-full md:w-64"
          >
            <option value="all">All Pages</option>
            {Object.keys(cmsFormConfig).map(key => (
              <option key={key} value={key}>
                {cmsFormConfig[key].title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading ? (
        <TableLoading row={12} col={8} width={140} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : filteredPages().length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPages().map((page, index) => {
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {cmsFormConfig[page.page]?.title || page.page}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {page.content?.heroSection?.subtitle || page.content?.shopContent?.description || cmsFormConfig[page.page]?.description || 'No description available'}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div>Last updated: {new Date(page.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => handleEditPage(page)} size="icon" layout="outline" className="w-[50px]">
                      <FiEdit className="text-black" />
                    </Button>
                    <Button onClick={() => handleDelete(page)} size="icon" layout="outline" className=" w-[50px]">
                      <FiTrash2 className="text-black" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>No CMS pages found. Create your first page to get started.</p>
          <Button onClick={handleAddNewPage} size="small" className="bg-blue-600 hover:bg-blue-700 mt-4">
            <FiPlus className="mr-2" />
            Add New Page
          </Button>
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          <h2 className="text-xl font-medium mb-2">
            Delete <span className="text-red-500">{pageToDelete?.page}</span> page?
          </h2>
          <p>This action cannot be undone. Are you sure you want to delete this CMS page?</p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            onClick={() => setDeleteModalOpen(false)}
            layout="outline"
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} className="w-full sm:w-auto">
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      {/* Add Page Modal */}
      <Modal isOpen={showAddModal} onClose={handleAddModalCancel}>
        <ModalBody className="text-center custom-modal px-8 pt-6 pb-4">
          <span className="flex justify-center text-3xl mb-6 text-blue-500">
            <FiPlus />
          </span>
          <h2 className="text-xl font-medium mb-4">
            Add New Page
          </h2>
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Page Type
            </Label>
            <Select
              value={newPageType}
              onChange={(e) => setNewPageType(e.target.value)}
              className="w-full"
            >
              {Object.keys(cmsFormConfig).map(key => (
                <option key={key} value={key}>
                  {cmsFormConfig[key].title}
                </option>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            onClick={handleAddModalCancel}
            layout="outline"
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
          >
            Cancel
          </Button>
          <Button onClick={handleCreatePage} className="w-full sm:w-auto">
            Create Page
          </Button>
        </ModalFooter>
      </Modal>

      {showForm && (
        <CMSForm
          pageType={formPageType}
          existingPage={editingPageData}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </>
  );
};


export default CMSIndex;