

import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  Column,
  usePagination,
  useSortBy,
  useTable,
  TableOptions,
} from "react-table";

function TableHOC<T extends Object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string,
  showPagination: boolean = false
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    };

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      nextPage,
      pageCount,
      state: { pageIndex },
      previousPage,
      canNextPage,
      canPreviousPage,
    } = useTable(options, useSortBy, usePagination);

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table className="table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...restHeaderProps}>
                  {headerGroup.headers.map((column) => {
                    const { key: thKey, ...restThProps } = column.getHeaderProps(column.getSortByToggleProps());
                    return (
                      <th key={thKey} {...restThProps}>
                        {column.render("Header")}
                        {column.isSorted && (
                          <span>
                            {column.isSortedDesc ? (
                              <AiOutlineSortDescending />
                            ) : (
                              <AiOutlineSortAscending />
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key: tdKey, ...restTdProps } = cell.getCellProps();
                    return (
                      <td key={tdKey} {...restTdProps}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {showPagination && (
          <div className="table-pagination">
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;

