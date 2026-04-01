import { useContext, useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useTranslation } from "react-i18next";
import { SidebarContext } from "@/context/SidebarContext";
import CMServices from "@/services/CMServices";
import Title from "@/components/form/others/Title";
import InputArea from "@/components/form/input/InputArea";
import TextArea from "@/components/form/input/TextArea";
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import useCMSSubmit from "@/hooks/useCMSSubmit";

const CMSDrawer = ({ id }) => {
  const { t } = useTranslation();
  const { closeDrawer } = useContext(SidebarContext);
  const { register, handleSubmit, setValue, reset, onSubmit, isSubmitting, errors } = useCMSSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Title
          register={register}
          label="Page"
          name="page"
          required={true}
          type="text"
          placeholder="e.g., home, shop, contact"
        />
        <Error errorName={errors.page} />
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-9/12 relative space-y-6 p-6 pb-40 overflow-y-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <LabelArea label="Content (JSON)" />
            <TextArea
              register={register}
              label="Content"
              name="content"
              placeholder="Enter JSON content for the page"
              required={true}
              rows="12"
            />
            <Error errorName={errors.content} />
          </div>
        </div>
      </Scrollbars>

      <DrawerButton id={id} title="CMS Page" isSubmitting={isSubmitting} />
    </>
  );
};

export default CMSDrawer;
