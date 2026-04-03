import { Badge, TableBody, TableCell, TableRow } from "@windmill/react-ui";
import React from "react";

import useToggleDrawer from "@/hooks/useToggleDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import VendorDrawer from "@/components/drawer/VendorDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";

const VendorTable = ({ vendors }) => {
  const {
    title,
    serviceId,
    handleModalOpen,
    handleUpdate,
  } = useToggleDrawer();

  const { showDateFormat } = useUtilsFunction();

  const getStatusBadge = (status) => {
    if (status === "active") {
      return <Badge type="success">Active</Badge>;
    }
    return <Badge type="danger">Inactive</Badge>;
  };

  return (
    <>
      <DeleteModal id={serviceId} title={title} />

      <MainDrawer>
        <VendorDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {vendors?.map((vendor) => (
          <TableRow key={vendor._id}>
            <TableCell>
              <div className="flex items-center">
                <div>
                  <h2 className="text-sm font-medium">{vendor.name}</h2>
                  {vendor.companyName && (
                    <p className="text-xs text-gray-500">{vendor.companyName}</p>
                  )}
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm">{vendor.email}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{vendor.phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {vendor.city}{vendor.state ? `, ${vendor.state}` : ""}
              </span>
              <p className="text-xs text-gray-500">{vendor.postalCode}</p>
            </TableCell>

            <TableCell>
              <span className="text-sm">{vendor.country}</span>
            </TableCell>

            <TableCell className="text-center">
              {getStatusBadge(vendor.status)}
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {showDateFormat(vendor.createdAt)}
              </span>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={vendor._id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={vendor.name}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default VendorTable;
