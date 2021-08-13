/*
 * Pagination component for the clip list page
 */

import PropTypes from "prop-types";
import styled from "styled-components";
import range from "lodash/range";
import throttle from "lodash/throttle";

const PaginationBar = styled.div`
  margin: 10px 0px;
  margin-bottom: 10px;
  border-radius: 2px;
`;

const PageLabel = styled.span`
  margin-left: 0.25rem;
  font-size: 14px;
  font-weight: bold;
`;

export default function Pagination(props) {
  const {
    totalPages,
    currentPage,
    totalClips,
    onChangePage,
    showLabel,
  } = props;

  const onFirstPage = currentPage == 0;
  const onLastPage = currentPage == totalPages - 1;

  return (
    <div className="field">
      {showLabel && <label className="label">Page</label>}

      <PaginationBar>
        <nav className="pagination is-small">
          <ul className="pagination-list">
            {range(0, totalPages).map((i) => (
              <li key={i}>
                <a
                  className={
                    "pagination-link" + (currentPage == i ? " is-current" : "")
                  }
                  onTouchStart={() => {
                    if (i != currentPage) {
                      onChangePage(i);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents grabbing focus

                    if (i != currentPage) {
                      onChangePage(i);
                    }
                  }}
                >
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>

          <a
            className="pagination-previous"
            onClick={(e) => {
              if (onFirstPage) return;

              onChangePage(currentPage - 1);
            }}
            style={{ order: 3 }}
            disabled={onFirstPage}
          >
            Previous page
          </a>

          <a
            className="pagination-next"
            onClick={() => {
              if (onLastPage) return;

              onChangePage(currentPage + 1);
            }}
            style={{ order: 3 }}
            disabled={onLastPage}
          >
            Next page
          </a>
        </nav>
      </PaginationBar>
    </div>
  );
}

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalClips: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
};
