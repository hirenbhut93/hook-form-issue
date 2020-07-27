import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";

export function Form({
  defaultValues,
  children,
  schema = null,
  onSubmit,
  ...props
}) {
  const methods = useForm({
    defaultValues,
    resolver: schema ? yupResolver(schema) : null,
  });
  const { handleSubmit } = methods;

  function renderByType(child) {
    if (
      child.type.name === "Field" ||
      child.type.name === "FieldCheckbox" ||
      child.type.name === "FieldRadioList"
    ) {
      return React.createElement(child.type, {
        ...{
          ...child.props,
          key: child.props.name,
          label: child.props.label ?? labelFromSchema(schema, child.props.name),
          register: methods.register,
          error: methods.errors[child.props.name],
          isRequired: isRequiredField(schema, child.props.name),
        },
      });
    } else if (child.type.name === "SubmitButton") {
      return React.createElement(child.type, {
        ...{
          ...child.props,
          formState: methods.formState,
          key: "btn-submit",
        },
      });
    }

    return child;
  }

  return (
    <form
      onSubmit={handleSubmit((data, e) => onSubmit(data, methods.setError, e))}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child) => renderByType(child))
        : children}
    </form>
  );
}

export function Field(props) {
  const fieldId = toFieldId(props.name);
  const arg = { fieldId, ...props };

  return (
    <div className={"form-group" + (props.isRequired ? " required" : "")}>
      {Label({ ...arg, options: props.labelOptions })}
      {renderByType({ ...arg, options: props.inputOptions })}
      {InvalidFeedback(arg)}
    </div>
  );
}

function renderByType(arg) {
  switch (arg.type) {
    case "text":
      return Input(arg);
    case "textarea":
      return Textarea(arg);
    default:
      return null;
  }
}

export function InvalidFeedback({ error }) {
  return (
    error && <div className="invalid-feedback d-block">{error.message}</div>
  );
  // return (
  //   <ErrorMessage
  //     errors={errors}
  //     name={name}
  //     as={<div className="invalid-feedback" />}
  //   />
  // );
}

export function Label({ fieldId, label, options }) {
  return (
    <label htmlFor={fieldId} {...options}>
      {label}
    </label>
  );
}

export function Textarea({ register, name, error, fieldId, options }) {
  return (
    <textarea
      className={"form-control" + (error ? " is-invalid" : "")}
      id={fieldId}
      name={name}
      ref={register}
      {...options}
    />
  );
}

export function Input({ register, name, error, fieldId, options }) {
  return (
    <input
      className={"form-control" + (error ? " is-invalid" : "")}
      id={fieldId}
      name={name}
      ref={register}
      {...options}
    />
  );
}

export function SubmitButton({ formState, label = "Submit", ...rest }) {
  return (
    <button
      type="submit"
      className="btn btn-block btn-primary"
      disabled={formState && formState.isSubmitting}
      {...rest}
    >
      {label}
    </button>
  );
}

export function ResetButton({ label = "Reset", ...rest }) {
  return (
    <button type="reset" className="btn btn-block btn-primary" {...rest}>
      {label}
    </button>
  );
}

function toFieldId(text) {
  return (
    "field-" +
    text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[-]+/g, "-")
      .replace(".", "-")
  );
}

function isRequiredField(schema, field) {
  if (schema) {
    return yup.reach(schema, field)._exclusive.required ?? false;
  }

  return false;
}

function labelFromSchema(schema, field) {
  if (schema) {
    return yup.reach(schema, field)._label ?? null;
  }

  return null;
}