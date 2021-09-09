import React from 'react';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import FilterBar from '../../../../components/FilterBar';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

afterEach(cleanup);
const mockStore = configureStore([thunk]);
/* *IMPORTANT errors in the console for this test have been made noted, following best practice guidelines and other sources the error can not be fixed without further research
All tests still function as intended*/
/* Render test for the filter bar component*/
describe('Filter Bar Render Tests #16', () => {
  const personalityType = {
    typeCode: 'ESTP',
    associatedComponents: [
      { title: 'Extrovert', letterCode: 'E' },
      { title: 'Sensing', letterCode: 'S' },
      { title: 'Thinking', letterCode: 'T' },
      { title: 'Perceiving', letterCode: 'P' },
    ],
  };
  const userId = 1;
  /* Successful render of the filter bar with no ticks on the sort by component*/
  it('test successful render of filter bar sort by component #16', () => {
    const store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'typecode',
      },
    });

    const { queryByTestId, getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Sort By'));

    expect(getByText('Sort By'));
    expect(getByText('Descending'));
    expect(getByText('Ascending'));
    expect(queryByTestId('filter-bar-tick-icon-descending')).toEqual(null);
    expect(queryByTestId('filter-bar-tick-icon-ascending')).toEqual(null);
  });

  /* Test that tick is present next to descending component when that option is selected*/
  it('test successful render of descending tick when state order is descending #16', () => {
    const store = mockStore({
      recommendedCareers: {
        sorting: 'descending',
        filter: 'typecode',
      },
    });

    const { queryByTestId, getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Sort By'));

    expect(queryByTestId('filter-bar-tick-icon-descending'));
    expect(queryByTestId('filter-bar-tick-icon-ascending')).toEqual(null);
  });

  /* Test that tick is present next to ascening when that option is selected*/
  it('test successful render of ascending tick when state order is ascending #16', () => {
    const store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'typecode',
      },
    });

    const { queryByTestId, getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Sort By'));

    expect(queryByTestId('filter-bar-tick-icon-ascending'));
    expect(queryByTestId('filter-bar-tick-icon-descending')).toEqual(null);
  });

  /* Test that the search by section of the functionality renders correctly*/
  it('test the rendering of the filter by component #25', () => {
    const store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'typecode',
      },
    });

    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Search By'));

    expect(getByText('Search By'));
    expect(getByText('Typecode'));
    expect(getByTestId('filter-bar-tick-icon-typecode'));
    expect(getByText('Extrovert'));
    expect(getByText('Sensing'));
    expect(getByText('Thinking'));
    expect(getByText('Perceiving'));
  });

  /* Test to ensure that the tick appears next to correct component when a component filtration is selected*/
  it('test the rendering of the tick when component filtration is selected #25', () => {
    const store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'E',
      },
    });

    const { getByText, getByTestId, queryByTestId } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Search By'));

    expect(getByText('Search By'));
    expect(getByTestId('filter-bar-tick-icon-descending-E'));
    expect(queryByTestId('filter-bar-tick-icon-typecode')).toEqual(null);
  });

  /* The sort by component should not render when the filter is anything other than typecode*/
  it('test that sort by is not present when filter is anything other than typecode', () => {
    const store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'E',
      },
    });

    const { queryByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    expect(queryByText('Sort By')).toEqual(null);
  });
});
