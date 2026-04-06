import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Card, CardBody, Select } from "@windmill/react-ui";

import Error from "@/components/form/others/Error";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import useVendorSubmit from "@/hooks/useVendorSubmit";
import DrawerButton from "@/components/form/button/DrawerButton";
import LabelArea from "@/components/form/selectOption/LabelArea";

const VendorDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
  } = useVendorSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            title="Update Vendor"
            description="Update vendor information and details"
          />
        ) : (
          <Title
            register={register}
            title="Add Vendor"
            description="Add a new vendor with their contact and address details"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <Card className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Vendor Name" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Name"
                      name="name"
                      type="text"
                      placeholder="Vendor name"
                    />
                    <Error errorName={errors.name} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Company Name" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={false}
                      register={register}
                      label="Company Name"
                      name="companyName"
                      type="text"
                      placeholder="Company name"
                    />
                    <Error errorName={errors.companyName} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Email" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Email"
                      name="email"
                      type="text"
                      placeholder="vendor@email.com"
                    />
                    <Error errorName={errors.email} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Phone" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Phone"
                      name="phone"
                      type="text"
                      placeholder="Phone number"
                    />
                    <Error errorName={errors.phone} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Address" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Address"
                      name="address"
                      type="text"
                      placeholder="Street address"
                    />
                    <Error errorName={errors.address} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="City" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="City"
                      name="city"
                      type="text"
                      placeholder="City"
                    />
                    <Error errorName={errors.city} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="State / Province" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={false}
                      register={register}
                      label="State"
                      name="state"
                      type="text"
                      placeholder="State or province"
                    />
                    <Error errorName={errors.state} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Postal Code" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Postal Code"
                      name="postalCode"
                      type="text"
                      placeholder="Enter 4-digit Australian postal code (e.g., 2000)"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Please enter a 4-digit Australian postal code (e.g., 2000, 3000)
                    </p>
                    <Error errorName={errors.postalCode} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Country" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={true}
                      register={register}
                      label="Country"
                      name="country"
                      type="text"
                      placeholder="Country"
                    />
                    <Error errorName={errors.country} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Description" />
                  <div className="col-span-8 sm:col-span-4">
                    <InputArea
                      required={false}
                      register={register}
                      label="Description"
                      name="description"
                      type="text"
                      placeholder="Short description about vendor"
                    />
                    <Error errorName={errors.description} />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                  <LabelArea label="Status" />
                  <div className="col-span-8 sm:col-span-4">
                    <Select
                      {...register("status")}
                      name="status"
                      className="h-12"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </div>
                </div>
              </div>

              <DrawerButton id={id} title="Vendor" isSubmitting={isSubmitting} />
            </form>
          </CardBody>
        </Card>
      </Scrollbars>
    </>
  );
};

export default VendorDrawer;
