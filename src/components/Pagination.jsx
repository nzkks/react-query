const Pagination = ({ data, page, setPage }) => {
  return (
    <div className="pages">
      <button onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))} disabled={!data.prev}>
        Previous page
      </button>
      {/* Math.max takes the seconds parameter. 0 means if the first parameter value goes beyond (less than) 0, then it is set to 0. */}
      <div>{page}</div>
      <button onClick={() => setPage(oldPage => oldPage + 1)} disabled={!data.next}>
        Next page
      </button>
    </div>
  );
};

export default Pagination;
