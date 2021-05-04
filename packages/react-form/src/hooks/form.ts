import {useCallback, useMemo} from 'react';
import {useLazyRef} from '@shopify/react-hooks';

import {
  FieldBag,
  FormInput,
  FormWithDynamicListsInput,
  FormWithoutDynamicListsInput,
  Form,
  FormWithDynamicLists,
  DynamicListBag,
} from '../types';
import {
  validateAll,
  makeCleanFields,
  makeCleanDynamicLists,
} from '../utilities';

import {useDirty} from './dirty';
import {useReset} from './reset';
import {useSubmit} from './submit';
import {useDynamicListDirty, useDynamicListReset} from './list';

/**
 * A custom hook for managing the state of an entire form. `useForm` wraps up many of the other hooks in this package in one API, and when combined with `useField` and `useList`, allows you to easily build complex forms with smart defaults for common cases.
 *
 * ### Examples
 *
 *```typescript
 * import React from 'react';
 * import {useField, useForm} from '@shopify/react-form';
 *
 *  function MyComponent() {
 *   const { fields, submit, submitting, dirty, reset, submitErrors, dynamicLists} = useForm({
 *     fields: {
 *       title: useField('some default title'),
 *     },
 *     dynamicLists: {
 *       customerPaymentMethods: useDynamicList<Card>([{cardNumber: '4242 4242 4242 4242', cvv: '422'}], emptyCardFactory)
 *     }
 *     onSubmit: (fieldValues) => {
 *       return {status: "fail", errors: [{message: 'bad form data'}]}
 *     }
 *   });
 *   const {customerPaymentMethods: {fields: paymentMethodFields, addItem, removeItem}} = dynamicLists
 *
 *   return (
 *     <form onSubmit={submit}>
 *       {submitting && <p className="loading">loading...</p>}
 *       {submitErrors.length>0 && <p className="error">submitErrors.join(', ')</p>}
 *       <div>
 *         <label for="title">Title</label>
 *         <input
 *           id="title"
 *           name="title"
 *           value={title.value}
 *           onChange={title.onChange}
 *           onBlur={title.onBlur}
 *         />
 *         {title.error && <p className="error">{title.error}</p>}
 *       </div>
 *       {paymentMethodFields.map((field, index) => {
 *         <TextField onChange={field.cardNumber.onChange} value={field.cardNumber.value} />
 *         <TextField onChange={field.cvv.onChange} value={field.cvv.value} />
 *         <button type="button" onClick={() => removeItem(index)}>Remove Payment Method</button>
 *       })}
 *       <button disabled={!dirty} onClick={reset}>Reset</button>
 *       <button type="submit" disabled={!dirty}>Submit</button>
 *       <button type="button" onClick={addItem}>Add Payment Method</button>
 *     </form>
 *  );
 *```
 *
 * @param fields - A dictionary of `Field` objects, dictionaries of `Field` objects, and lists of dictionaries of `Field` objects. Generally, you'll want these to be generated by the other hooks in this package, either `useField` or `useList`. This will be returned back out as the `fields` property of the return value.
 *
 * @param onSubmit - An async function to handle submission of the form. If this function returns an object of `{status: 'fail', error: FormError[]}` then the submission is considered a failure. Otherwise, it should return an object with `{status: 'success'}` and the submission will be considered a success. `useForm` will also call all client-side validation methods for the fields passed to it. The `onSubmit` handler will not be called if client validations fails.
 * @param dynamicLists - Pass in dynamic lists objects into the form
 * @param makeCleanAfterSubmit
 * @returns An object representing the current state of the form, with imperative methods to reset, submit, validate, and clean. Generally, the returned properties correspond 1:1 with the specific hook/utility for their functionality.
 *
 * @remarks
 * **Building your own:** Internally, `useForm` is a convenience wrapper over `useDirty`, `useReset`, and `useSubmit`. If you only need some of its functionality, consider building a custom hook combining a subset of them.
 * **Subforms:** You can have multiple `useForm`s wrapping different subsets of a group of fields. Using this you can submit subsections of the form independently and have all the error and dirty tracking logic "just work" together.
 */

export function useForm<T extends FieldBag>({
  fields,
  onSubmit,
  makeCleanAfterSubmit,
}: FormWithoutDynamicListsInput<T>): Form<T>;

export function useForm<T extends FieldBag, D extends DynamicListBag>({
  fields,
  dynamicLists,
  onSubmit,
  makeCleanAfterSubmit,
}: FormWithDynamicListsInput<T, D>): FormWithDynamicLists<T, D>;

export function useForm<T extends FieldBag, D extends DynamicListBag>({
  fields,
  dynamicLists,
  onSubmit,
  makeCleanAfterSubmit = false,
}: FormInput<T, D>) {
  const fieldsWithLists = useMemo(() => {
    if (dynamicLists) {
      const fieldsWithList = {...fields};
      Object.entries(dynamicLists).forEach(([key, value]) => {
        (fieldsWithList as any)[key] = value.fields;
      });
      return fieldsWithList;
    }
    return fields;
  }, [dynamicLists, fields]);

  const dirty = useDirty(fieldsWithLists);
  const basicReset = useReset(fieldsWithLists);

  const dynamicListDirty = useDynamicListDirty(dynamicLists);
  const dynamicListReset = useDynamicListReset(dynamicLists);

  const {submit, submitting, errors, setErrors} = useSubmit(
    onSubmit,
    fieldsWithLists,
    makeCleanAfterSubmit,
    dynamicLists,
  );

  const reset = useCallback(() => {
    setErrors([]);
    basicReset();
    dynamicListReset();
  }, [basicReset, dynamicListReset, setErrors]);

  const fieldsRef = useLazyRef(() => fieldsWithLists);
  fieldsRef.current = fieldsWithLists;
  const dynamicListsRef = useLazyRef(() => dynamicLists);
  dynamicListsRef.current = dynamicLists;

  const validate = useCallback(() => {
    return validateAll(fieldsRef.current);
  }, [fieldsRef]);

  const makeClean = useCallback(() => {
    makeCleanFields(fieldsRef.current);
    makeCleanDynamicLists(dynamicListsRef.current);
  }, [dynamicListsRef, fieldsRef]);

  const form: Form<T> = {
    fields,
    dirty: dirty || dynamicListDirty,
    submitting,
    submit,
    reset,
    validate,
    makeClean,
    submitErrors: errors,
  };

  if (dynamicLists) {
    return {...form, dynamicLists};
  }

  return form;
}
