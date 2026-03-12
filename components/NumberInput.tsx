"use client";

import { forwardRef } from "react";

interface NumberInputProps {
  label: string;
  name: string;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
  optional?: boolean;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, name, placeholder = "0.00", register, error, optional = true }, _ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {label}
          {!optional && <span className="text-red-500 text-xs">*</span>}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium pointer-events-none">
            L.
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder={placeholder}
            className={`w-full pl-8 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors
              ${error
                ? "border-red-400 focus:ring-red-300 bg-red-50"
                : "border-gray-300 focus:ring-green-300 focus:border-green-500 bg-white"
              }`}
            {...register(name, { valueAsNumber: true })}
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
export default NumberInput;
