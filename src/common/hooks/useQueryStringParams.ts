import { useSearchParams } from "react-router-dom";

/*
useQueryStringParams provides methods for querying and manipulating the query parameters in the
browser. All mutations will result in the location being updated without modifying the browser
navigation stack.

Usage:
import { useQueryStringParams } from '@src/common/hooks/useQueryStringParams';
const { searchParams, getSearchParam, addSearchParam, removeSearchParam } = useQueryStringParams();
...
*/

export type useQueryStringParamsReturn = {
  searchParams: Object;
  getSearchParam: (string) => string | null;
  addSearchParam: (Object) => void;
  removeSearchParam: (string) => void;
};

export const useQueryStringParams = (): useQueryStringParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = Object.fromEntries(searchParams.entries());

  // Returns the value of a search parameter, or null.
  // Note: does not handle search parameters with multiple values at this time.
  const getSearchParam = (key: string) => {
    return searchParams.get(key);
  };

  // Merges the supplied object into search parameters and updates the location without modifying
  // the browser navigation stack.
  // Note: this does not handle search parameters with multiple values at this time.
  const addSearchParam = (object: Object) => {
    setSearchParams(
      Object.assign({}, Object.fromEntries(searchParams.entries()), object),
      { replace: true }
    );
  };

  // Removes the search parameter with the specified key from the search parameters and updates
  // the location without modifying the browser navigation stack.
  const removeSearchParam = (key: string) => {
    searchParams.delete(key);
    setSearchParams(Object.fromEntries(searchParams.entries()), {
      replace: true,
    });
  };

  return {
    searchParams: params,
    getSearchParam,
    addSearchParam,
    removeSearchParam,
  };
};
