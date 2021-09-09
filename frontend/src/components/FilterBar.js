import React from 'react';
import { NavDropdown, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  ORDER_CAREERS_ASCENDING,
  ORDER_CAREERS_DESCENDING,
} from '../constants/careerConstants';
import {
  loadRecommendationsWithScore,
  loadRecommendationsByComponent,
} from '../actions/careerActions';

/* Component for the filter bar that user can use to filter recommendations*/
function FilterBar({ personalityType, userId }) {
  const dispatch = useDispatch();

  const recommendedCareers = useSelector((state) => state.recommendedCareers);
  const { sorting, filter } = recommendedCareers;

  const onSortByClick = (orderValue) => {
    switch (orderValue) {
      case 'descending':
        dispatch({ type: ORDER_CAREERS_DESCENDING });
        break;
      case 'ascending':
        dispatch({ type: ORDER_CAREERS_ASCENDING });
        break;
    }
  };

  return (
    <Row data-testid={'filter-bar'}>
      {/* Do not render the sort by option if there is no match score present */}
      {filter === 'typecode' && (
        <Col md={1} sm={1} xs={1} style={{ marginRight: 40 }}>
          <NavDropdown title={'Sort By'} id="Sort">
            <NavDropdown.Item onClick={() => onSortByClick('descending')}>
              Descending
              {sorting === 'descending' && (
                <i
                  className="fas fa-check px-1"
                  data-testid="filter-bar-tick-icon-descending"
                ></i>
              )}
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => onSortByClick('ascending')}>
              Ascending
              {sorting === 'ascending' && (
                <i
                  className="fas fa-check px-1"
                  data-testid="filter-bar-tick-icon-ascending"
                ></i>
              )}
            </NavDropdown.Item>
          </NavDropdown>
        </Col>
      )}
      <Col md={1} sm={1} xs={1}>
        <NavDropdown title={'Search By'} id="Sort">
          <NavDropdown.Item
            onClick={() => {
              if (filter !== 'typecode') {
                dispatch(loadRecommendationsWithScore(userId));
              }
            }}
          >
            Typecode
            {filter === 'typecode' && (
              <i
                className="fas fa-check px-1"
                data-testid={'filter-bar-tick-icon-typecode'}
              ></i>
            )}
          </NavDropdown.Item>
          {personalityType.associatedComponents.map((component) => (
            <NavDropdown.Item
              key={component.title}
              onClick={() => {
                if (filter !== component.letterCode) {
                  dispatch(
                    loadRecommendationsByComponent(component.letterCode)
                  );
                }
              }}
            >
              {component.title}
              {filter === component.letterCode && (
                <i
                  className="fas fa-check px-1"
                  data-testid={`filter-bar-tick-icon-descending-${component.letterCode}`}
                ></i>
              )}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      </Col>
    </Row>
  );
}

export default FilterBar;
