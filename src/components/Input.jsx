"use client";
import { ErrorMessage, Field } from "formik";
import React from "react";

export default function Input({ name, label, type, required, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="capitalize">
        {label || name} <span className="text-red-500">{required && "*"}</span>
      </label>
      <Field
        name={name}
        type={type}
        {...props}
        className="p-2 rounded border-zinc-400 border border-solid outline-0 focus:border-blue-500"
      />
      <div className="text-red-500 text-xs mt-1">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
}
