import React from "react";
import { Select } from "@windmill/react-ui";
import { ROLES } from "@/utils/permissions";

const SelectRole = ({ setRole, register, name, label }) => {
  return (
    <>
      <Select
        onChange={(e) => setRole && setRole(e.target.value)}
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        <option value="" defaultValue hidden>
          Staff role
        </option>
        <option value={ROLES.ADMIN}>{ROLES.ADMIN}</option>
        <option value={ROLES.MANAGER}>{ROLES.MANAGER}</option>
        <option value={ROLES.STAFF}>{ROLES.STAFF}</option>
      </Select>
    </>
  );
};

export default SelectRole;
