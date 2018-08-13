import React from 'react';
import Component from 'react-component-component';
import ReactAutocomplete from 'react-autocomplete';
import {
  FormBlock,
  FormBlockLabel,
  FormFieldDesc,
  Input,
  Select,
  AutoCompleteWrapper,
  AutoCompleteMenu,
  AutoCompleteOption,
  DatePicker,
  CheckBoxes,
  RadioSelect,
  FormFieldError,
  inputSelectErrorIcon,
  checkboxRadioErrorIcon,
} from 'theme/formComponentsStyles';
import FormFieldErrorIcon from 'icons/FormFieldErrorIcon';

const hasErrors = (errors, touched, fieldName) => touched[fieldName] && errors[fieldName];

// Map simple string/number options to keyed objects
const processOptions = options =>
  options.map(
    option =>
      typeof option === 'object' && option.constructor === Object
        ? option
        : { label: option, value: option },
  );

export const FormComponent = ({
  children,
  children: {
    props: { name },
  },
  labelText,
  description,
}) => (
  <FormBlock>
    <FormBlockLabel htmlFor={name}>{labelText || name}:</FormBlockLabel>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
    {children}
  </FormBlock>
);

export const FormInput = ({ field, form: { touched, errors }, type = 'text', ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    <Input type={type} {...field} {...props} errors={hasErrors(errors, touched, field.name)} />
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </>
);

export const FormDateInput = ({ field, form: { touched, errors }, ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    <DatePicker type="date" {...field} {...props} errors={hasErrors(errors, touched, field.name)} />
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </>
);

export const FormSelect = ({
  field,
  form: { setValues, values, setFieldTouched, touched, errors },
  options = [],
  disabled,
  ...props
}) => (
  <Component
    options={options}
    didUpdate={({ props, prevProps }) => {
      // If a select has dynamic options, reset the selection
      // field if the options change (no value and touched === false)
      if (props.options.length !== prevProps.options.length) {
        const newValues = Object.assign({}, values);
        delete newValues[field.name];
        setValues(newValues);
        setFieldTouched(field.name, false);
      }
    }}
  >
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>{errors[field.name]}</FormFieldError>
    )}
    {/* Select fields will be disabled if they have no options, as is possible when selecting
        tumor diagnosis based options  */}
    <Select
      disabled={disabled || options.length === 0}
      {...field}
      {...props}
      errors={hasErrors(errors, touched, field.name)}
    >
      <option value="0">-- Select an Option --</option>
      {processOptions(options).map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
    {hasErrors(errors, touched, field.name) && <FormFieldErrorIcon css={inputSelectErrorIcon} />}
  </Component>
);

export const FormRadioSelect = ({ field, form: { touched, errors }, options, ...props }) => (
  <>
    {hasErrors(errors, touched, field.name) && (
      <FormFieldError>
        {/* Radio Select will only ever error when they are required so we
            will simplify the messaging for the front-end */}
        {[field.name]} is a required field
        <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
      </FormFieldError>
    )}
    <RadioSelect {...props}>
      {processOptions(options).map((option, idx) => (
        <label key={idx}>
          {option.label}
          <input type="radio" {...field} value={option.value} />
          <span />
        </label>
      ))}
    </RadioSelect>
  </>
);

export const FormMultiCheckbox = ({
  field,
  form: { values, touched, errors, setFieldValue, setFieldTouched },
  ...props
}) => {
  const fieldName = field.name;
  const fieldValues = values[fieldName] || [];
  return (
    <>
      {hasErrors(errors, touched, fieldName) && (
        <FormFieldError>
          {errors[fieldName]}
          <FormFieldErrorIcon css={checkboxRadioErrorIcon} />
        </FormFieldError>
      )}
      <CheckBoxes {...props}>
        {processOptions(props.options).map((option, idx) => {
          const name = option.label;
          const value = option.value;
          return (
            <label key={idx}>
              {name}
              <input
                type="checkbox"
                value={value}
                checked={fieldValues.includes(value)}
                name={fieldName}
                onChange={e => {
                  const newSelects = e.target.checked
                    ? fieldValues.concat([value])
                    : fieldValues.filter(option => option !== value);
                  setFieldValue(fieldName, newSelects);
                  setFieldTouched(fieldName);
                }}
              />
              <span />
            </label>
          );
        })}
      </CheckBoxes>
    </>
  );
};

export const FomAutoComplete = ({
  field,
  form: { values, touched, errors, setFieldValue, setFieldTouched },
  options,
  errorText,
  ...props
}) => {
  const fieldName = field.name;
  return (
    <AutoCompleteWrapper>
      {hasErrors(errors, touched, fieldName) && (
        <FormFieldError>{errorText || errors[fieldName]}</FormFieldError>
      )}
      <ReactAutocomplete
        items={processOptions(options)}
        shouldItemRender={(item, value) =>
          item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        }
        getItemValue={item => item.label}
        renderMenu={items => <AutoCompleteMenu children={items} />}
        renderItem={(item, highlighted) => (
          <AutoCompleteOption key={item.value} highlighted={highlighted}>
            {item.label}
          </AutoCompleteOption>
        )}
        value={values[fieldName]}
        onChange={e => {
          setFieldValue(fieldName, e.target.value);
          setFieldTouched(fieldName);
        }}
        onSelect={value => setFieldValue(fieldName, value)}
      />
    </AutoCompleteWrapper>
  );
};

export const FormLabelHeader = ({ labelText, description }) => (
  <FormBlock>
    <FormBlockLabel>{labelText}:</FormBlockLabel>
    {description && <FormFieldDesc>{description}</FormFieldDesc>}
  </FormBlock>
);
