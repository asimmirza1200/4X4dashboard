import Multiselect from "multiselect-react-dropdown";
import Tree from "rc-tree";

//internal import
import useAsync from "@/hooks/useAsync";
import { notifySuccess } from "@/utils/toast";
import CategoryServices from "@/services/CategoryServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const ParentCategory = ({
  selectedCategory,
  setSelectedCategory,
  setDefaultCategory,
}) => {
  const { data, loading } = useAsync(CategoryServices?.getAllCategory);
  const { showingTranslateValue } = useUtilsFunction();

  // Flatten categories for Multiselect
  const flattenCategories = (categories) => {
    let result = [];
    for (let category of categories) {
      result.push({
        _id: category._id,
        name: showingTranslateValue(category.name),
      });
      if (category?.children?.length > 0) {
        result = result.concat(flattenCategories(category.children));
      }
    }
    return result;
  };

  const flatCategories = data ? flattenCategories(data) : [];

  const STYLE = `
  .rc-tree-child-tree {
    display: block;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };

  const renderCategories = (categories) => {
    let myCategories = [];
    for (let category of categories) {
      myCategories.push({
        title: showingTranslateValue(category.name),
        key: category._id,
        children:
          category?.children?.length > 0 && renderCategories(category.children),
      });
    }

    return myCategories;
  };

  const findObject = (obj, target) => {
    return obj._id === target
      ? obj
      : obj?.children?.reduce(
        (acc, obj) => acc ?? findObject(obj, target),
        undefined
      );
    // if (obj._id === target) return obj;

    // for (let c of obj.children) {
    //   let x = findObject(target, c);
    //   console.log('c', c);
    //   if (x) return x;
    // }
  };

  const handleSelect = (selectedValue) => {
    // Find the selected category from the flattened array
    const selectedCategoryObj = flatCategories.find(cat => cat._id === selectedValue._id);
    
    if (!selectedCategoryObj) {
      return;
    }

    // Check if category already selected
    const getCategory = selectedCategory.filter(
      (value) => value._id === selectedCategoryObj._id
    );

    if (getCategory.length !== 0) {
      return notifySuccess("This category already selected!");
    }

    setSelectedCategory((pre) => [
      ...pre,
      {
        _id: selectedCategoryObj._id,
        name: selectedCategoryObj.name,
      },
    ]);
    setDefaultCategory(() => [
      {
        _id: selectedCategoryObj._id,
        name: selectedCategoryObj.name,
      },
    ]);
  };

  const handleRemove = (v) => {
    setSelectedCategory(v);
  };

  return (
    <>
      <div className="mb-2">
        <Multiselect
          displayValue="name"
          groupBy="name"
          isObject={true}
          hidePlaceholder={true}
          onKeyPressFn={function noRefCheck() { }}
          onRemove={(v) => handleRemove(v)}
          onSearch={function noRefCheck() { }}
          onSelect={(v) => handleSelect(v)}
          options={flatCategories}
          selectedValues={selectedCategory}
          placeholder={"Select Category"}
        ></Multiselect>
      </div>

      {!loading && data !== undefined && (
        <div className="draggable-demo capitalize">
          <style dangerouslySetInnerHTML={{ __html: STYLE }} />
          <Tree
            expandAction="click"
            treeData={renderCategories(data)}
            // defaultCheckedKeys={id}
            onSelect={(v) => handleSelect(v[0])}
            motion={motion}
            animation="slide-up"
          />
        </div>
      )}
    </>
  );
};

export default ParentCategory;
