import type { ActionItems } from '../types';
import data from './actionItems.json';

// JSON imports widen string unions to `string`; the shape is validated by the ActionItems type here.
export const actionItems = data as ActionItems;
