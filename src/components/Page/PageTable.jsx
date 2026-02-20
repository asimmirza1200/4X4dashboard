import { TableBody, TableCell, TableRow } from "@windmill/react-ui";
import { useEffect, useState } from "react";
import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import PageDrawer from "@/components/drawer/PageDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";

function stripHtml(html) {
  if (typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

const PageTable = ({ isCheck, pages, setIsCheck }) => {
  const [list, setList] = useState([]);
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();

  useEffect(() => {
    setList(pages || []);
  }, [pages]);

  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck(checked ? [...isCheck, id] : isCheck.filter((item) => item !== id));
  };

  return (
    <>
      {isCheck.length < 1 && <DeleteModal id={serviceId} title={title} />}
      {isCheck.length < 2 && (
        <MainDrawer>
          <PageDrawer id={serviceId} />
        </MainDrawer>
      )}

      <TableBody>
        {list?.map((page, i) => (
          <TableRow key={page._id || i}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name={page?.title}
                id={page._id}
                handleClick={handleClick}
                isChecked={isCheck?.includes(page._id)}
              />
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{page?.title}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600 dark:text-gray-400">/{page?.slug}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-gray-600 line-clamp-1 max-w-xs block">
                {stripHtml(page?.content || "").slice(0, 60)}
                {(page?.content || "").length > 60 ? "…" : ""}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton
                id={page._id}
                status={page.status === "Published" ? "show" : "hide"}
              />
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={page._id}
                isCheck={isCheck}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={page?.title}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default PageTable;
