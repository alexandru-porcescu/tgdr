import { action } from 'typesafe-actions';
import axios from 'axios';
import queryString from 'query-string';
import {
  EntriesStateTypes,
  IGetEntriesParams,
  IGetEntriesResponse,
} from './entriesTypes';
import { AsyncAction } from '../storeTypes';
import { areParamsEqual } from '../../utils';

export const entriesRequest = (payload: IGetEntriesParams) =>
  action(EntriesStateTypes.REQUEST, payload);

export const entriesSuccess = (payload: IGetEntriesResponse) =>
  action(EntriesStateTypes.SUCCESS, payload);
export const entriesFailure = () => action(EntriesStateTypes.FAILURE);

export const getEntries: AsyncAction = (
  params: IGetEntriesParams
) => async (dispatch, getState) => {
  const { entries } = getState();

  const paramsEqual = areParamsEqual(params, entries);
  
  if (paramsEqual) return null;
  
  const query = queryString.stringify(params);
  dispatch(entriesRequest(params));
  try {
    const { data } = await axios.get(`/api/entry?${query}`);
    dispatch(entriesSuccess(data));
  } catch (error) {
    dispatch(entriesFailure());
  }
};