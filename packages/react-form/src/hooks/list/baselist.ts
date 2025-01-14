import {useMemo, useEffect} from 'react';
import isEqual from 'fast-deep-equal';

import {
  ValidationDictionary,
  NormalizedValidationDictionary,
  FieldDictionary,
  ListValidationContext,
} from '../../types';
import {mapObject, normalizeValidation} from '../../utilities';
import {useDirty} from '../dirty';

import {
  useHandlers,
  useListReducer,
  ListAction,
  reinitializeAction,
  resetListAction,
} from './hooks';

/*

 * A custom hook for handling the state and validations of fields for a list of objects which can be built upon. (e.g useList and useDynamicList).

 * @param listOrConfig - A configuration object specifying both the value and validation config.
 * @param validationDependencies - An array of dependencies to use to decide when to regenerate validators.
 * @returns A list of dictionaries of `Field` objects representing the state of your input and a dispatcher which can be used for other hooks to build around base list (e.g useList and useDynamicList).
 *
 * @remarks
 * **Reinitialization:** If the `list` property of the field configuration changes between calls to `useBaseList`,
 * the field will be reset to use it as it's new default value.
 *
 * **Imperative methods:** The returned `Field` objects contains a number of methods used to imperatively alter their state.
 * These should only be used as escape hatches where the existing hooks and components do not make your life easy,
 * or to build new abstractions in the same vein as `useForm`, `useSubmit` and friends.
 *
*/

export interface FieldListConfig<Item extends object> {
  list: Item[];
  validates?: Partial<ValidationDictionary<Item, ListValidationContext<Item>>>;
}

interface BaseList<Item extends object> {
  fields: Array<FieldDictionary<Item>>;
  dispatch: React.Dispatch<ListAction<Item>>;
  reset(): void;
  dirty: boolean;
}

export function useBaseList<Item extends object>(
  listOrConfig: FieldListConfig<Item> | Item[],
  validationDependencies: unknown[] = [],
): BaseList<Item> {
  const list = Array.isArray(listOrConfig) ? listOrConfig : listOrConfig.list;
  const validates: FieldListConfig<Item>['validates'] = useMemo(() => {
    return Array.isArray(listOrConfig) ? {} : listOrConfig.validates || {};
  }, [listOrConfig]);

  const [state, dispatch] = useListReducer(list);

  useEffect(() => {
    if (!isEqual(list, state.initial)) {
      dispatch(reinitializeAction(list));
    }
  }, [list, state.initial, dispatch]);

  const validationConfigs = useMemo(
    () =>
      mapObject<NormalizedValidationDictionary<any>>(
        validates,
        normalizeValidation,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [validates, ...validationDependencies],
  );

  function reset() {
    dispatch(resetListAction());
  }

  const handlers = useHandlers(state, dispatch, validationConfigs);

  const fields: Array<FieldDictionary<Item>> = useMemo(() => {
    return state.list.map((item, index) => {
      return mapObject(item, (field, key: keyof Item) => {
        return {
          ...field,
          ...(handlers[index][key] as any),
        };
      });
    });
  }, [state.list, handlers]);

  const listWithoutFieldStates: Item[] = useMemo(() => {
    return state.list.map(item => {
      return mapObject(item, field => field.value);
    });
  }, [state.list]);

  const isBaseListDirty = useMemo(
    () => !isEqual(listWithoutFieldStates, state.initial),
    [listWithoutFieldStates, state.initial],
  );

  const fieldsDirty = useDirty({fields});

  return {fields, dispatch, reset, dirty: fieldsDirty || isBaseListDirty};
}
