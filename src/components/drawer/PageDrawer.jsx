import { t } from "i18next";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Input, Textarea } from "@windmill/react-ui";
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import Uploader from "@/components/image-uploader/Uploader";
import usePageSubmit from "@/hooks/usePageSubmit";
import ReactQuill from "react-quill";

const PageDrawer = ({ id }) => {
  const {
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
  } = usePageSubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title title="Update Page" description="Edit page content and settings." />
        ) : (
          <Title title="Add Page" description="Create a new dynamic page (e.g. About, Terms)." />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pt-8 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Page Title" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Title"
                  name="title"
                  required
                  placeholder="e.g. About Us"
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Slug (URL)" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Slug"
                  name="slug"
                  placeholder="e.g. about-us (optional, auto from title)"
                />
                <Error errorName={errors.slug} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Banner image" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader
                  imageUrl={bannerImage}
                  setImageUrl={setBannerImage}
                  folder="page"
                />
                <p className="mt-1 text-xs text-gray-500">Used as the hero banner on the page. Optional.</p>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Content" />
              <div className="col-span-8 sm:col-span-4">
                <ReactQuill
                  theme="snow"
                  value={getValues("content") || ""}
                  onChange={setContent}
                />
                <Error errorName={errors.content} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Sort order" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  {...register("sortOrder", { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label={t("Published")} />
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle handleProcess={setPublished} processOption={published} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Meta Title" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  {...register("metaTitle")}
                  name="metaTitle"
                  type="text"
                  placeholder="SEO meta title"
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Meta Description" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea
                  className="border text-sm block w-full bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  {...register("metaDescription")}
                  name="metaDescription"
                  placeholder="SEO meta description"
                  rows="2"
                />
              </div>
            </div>
          </div>
          <DrawerButton id={id} title="Page" isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default PageDrawer;
