import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import FilterBar from '../../../../components/FilterBar';
import {
  ORDER_CAREERS_ASCENDING,
  ORDER_CAREERS_DESCENDING,
  GET_CAREER_RECOMMENDATIONS_REQUEST,
} from '../../../../constants/careerConstants';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

afterEach(cleanup);
const mockStore = configureStore([thunk]);

/* Event tests for the filter bar actions*/
describe('Filter Bar Action test', () => {
  let store;
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

  beforeEach(() => {
    store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'typecode',
      },
    });
  });

  /* Test that order careers ascending is fired when user chooses ascending*/
  it('test that correct action is fired when user clicks ascending button #16', () => {
    const { getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Sort By'));
    fireEvent.click(getByText('Ascending'));
    expect(store.getActions()).toEqual([
      {
        type: ORDER_CAREERS_ASCENDING,
      },
    ]);
  });

  /* Test that order careers descending is fired when user chooses descending*/
  it('test that correct action is fired when user clicks descending button #16', () => {
    const { getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Sort By'));
    fireEvent.click(getByText('Descending'));
    expect(store.getActions()).toEqual([
      {
        type: ORDER_CAREERS_DESCENDING,
      },
    ]);
  });

  /* Test that correct action is fired when user filters by typecode */
  it('test that correct action is fired when user clicks search by typecode #25', () => {
    store = mockStore({
      recommendedCareers: {
        sorting: '',
        filter: 'thinking',
      },
      loggedUser: { userInfo: { _id: 1 } },
    });

    const { getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Search By'));
    fireEvent.click(getByText('Typecode'));
    expect(store.getActions()).toEqual([
      {
        type: GET_CAREER_RECOMMENDATIONS_REQUEST,
      },
    ]);
  });

  /* Test that correct action is fired whe user searches by type component */
  it('test that correct action is fired when user clicks search by component #25', () => {
    const { getByText } = render(
      <Provider store={store}>
        <FilterBar personalityType={personalityType} userId={userId} />
      </Provider>
    );

    fireEvent.click(getByText('Search By'));
    fireEvent.click(getByText('Thinking'));
    expect(store.getActions()).toEqual([
      {
        type: GET_CAREER_RECOMMENDATIONS_REQUEST,
      },
    ]);
  });
});
