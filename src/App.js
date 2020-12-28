import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { useInput } from "./hooks/useInput";
import { EMPLOYEES_QUERY } from "./queries/EmployeeQuery";

const LIMIT = 5;

function App() {
  const searchInput = useInput("");
  const limitInput = useInput(LIMIT);

  const [variables, setVariables] = useState({ first: LIMIT, orderBy: { field: "UPDATED_AT", direction: "DESC" } });
  const [sortByCode, setSortByCode] = useState("ASC");
  const [sortByDisplayName, setSortByDisplayName] = useState("ASC");

  const { loading, error, data } = useQuery(EMPLOYEES_QUERY, { variables });

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setVariables({
        first: parseInt(limitInput.value),
        filterBy: { query: searchInput.value },
      });
    }
  };

  const handleChangeLimit = (e) => {
    if (e.key === "Enter") {
      setVariables({ first: parseInt(limitInput.value) });
    }
  };

  const handleClickPrev = () => {
    const { startCursor } = data?.employees?.pageInfo;
    setVariables({
      last: parseInt(limitInput.value),
      before: startCursor,
      filterBy: { query: searchInput.value },
    });
  };

  const handleClickNext = () => {
    const { endCursor } = data?.employees?.pageInfo;
    setVariables({
      first: parseInt(limitInput.value),
      after: endCursor,
      filterBy: { query: searchInput.value },
    });
  };

  const handleSortByCode = () => {
    setVariables({
      first: parseInt(limitInput.value),
      filterBy: { query: searchInput.value },
      orderBy: { field: "CODE", direction: sortByCode },
    });
    sortByCode === "ASC" ? setSortByCode("DESC") : setSortByCode("ASC");
  };

  const handleSortByDisplayName = () => {
    setVariables({
      first: parseInt(limitInput.value),
      filterBy: { query: searchInput.value },
      orderBy: { field: "DISPLAY_NAME", direction: sortByDisplayName },
    });
    sortByDisplayName === "ASC"
      ? setSortByDisplayName("DESC")
      : setSortByDisplayName("ASC");
  };

  const calculateTotalPage = () => {
    return Math.ceil(data?.employees?.totalCount / limitInput.value);
  };

  if (error) return <p>Error :({JSON.stringify(error)})</p>;

  return (
    <>
      <input {...searchInput} autoFocus onKeyDown={handleSearch} />
      <br />
      <input {...limitInput} onKeyDown={handleChangeLimit} />
      <div>TotalCount: {data?.employees?.totalCount}</div>
      <div>TotalPage: {calculateTotalPage()}</div>
      <button style={{ marginRight: "10px" }} onClick={handleSortByCode}>
        Sort by Code {sortByCode === "ASC" ? <>&uarr;</> : <>&darr;</>}
      </button>
      |
      <button style={{ marginLeft: "10px" }} onClick={handleSortByDisplayName}>
        Sort by Display Name{" "}
        {sortByDisplayName === "ASC" ? <>&uarr;</> : <>&darr;</>}
      </button>
      <br />
      <button
        style={{ marginRight: "10px" }}
        disabled={!data?.employees?.pageInfo?.hasPreviousPage}
        onClick={handleClickPrev}
      >
        Prev
      </button>
      |
      <button
        style={{ marginLeft: "10px" }}
        disabled={!data?.employees?.pageInfo?.hasNextPage}
        onClick={handleClickNext}
      >
        Next
      </button>
      {loading ? (
        <div>Loading...</div>
      ) : (
        data?.employees?.edges?.map(({ node }) => (
          <div key={node.id}>
            <b>{node.displayName}</b>
            <br />
          </div>
        ))
      )}
    </>
  );
}

export default App;
