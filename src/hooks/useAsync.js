import axios from "axios";
// import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";

const useAsync = (asyncFunction, dependencies = null) => {
  const [data, setData] = useState([] || {});
  const [error, setError] = useState("");
  // const [errCode, setErrCode] = useState('');
  const [loading, setLoading] = useState(true);
  const {
    invoice,
    status,
    zone,
    time,
    source,
    limitData,
    startDate,
    endDate,
    method,
    isUpdate,
    setIsUpdate,
    currentPage,
    category,
    searchText,
    sortedField,
  } = useContext(SidebarContext);

  // Use custom dependencies if provided (even if empty array), otherwise use default context dependencies
  const deps = Array.isArray(dependencies) ? dependencies : [
    invoice,
    status,
    zone,
    time,
    method,
    source,
    limitData,
    startDate,
    endDate,
    isUpdate,
    currentPage,
    category,
    searchText,
    sortedField,
  ];

  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    
    // Reset loading state when dependencies change
    setLoading(true);
    setError("");
    
    (async () => {
      try {
        // Call asyncFunction - it may or may not accept cancelToken
        const res = await asyncFunction();
        if (!unmounted) {
          setData(res);
          setError("");
          setLoading(false);
        }
      } catch (err) {
        if (!unmounted) {
          if (axios.isCancel(err)) {
            // Request was cancelled, don't set error
            setLoading(false);
          } else {
            console.log("err.message",err)
            setError(err.response?.data?.message || err.message || "An error occurred");
            setLoading(false);
            setData([]);
          }
        }
      }
    })();

    return () => {
      unmounted = true;
      source.cancel("Cancelled in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    error,
    loading,
  };
};

export default useAsync;
