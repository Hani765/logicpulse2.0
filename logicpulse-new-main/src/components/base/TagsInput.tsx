"use client";

import React, { useState } from 'react';
import Select, { MultiValue, Options } from 'react-select';
import makeAnimated from 'react-select/animated';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

const animatedComponents = makeAnimated();

interface Option {
    value: string;
    label: string;
}

interface SelectMultiProps {
    options: Options<Option>;
    selectedOptions: MultiValue<Option>;
    handleChange: (selected: MultiValue<Option>) => void;
    placeholder: string;
}

const SelectMulti: React.FC<SelectMultiProps> = ({ options, selectedOptions, handleChange, placeholder }) => {
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        if (selectAll) {
            handleChange([]);
        } else {
            handleChange(options);
        }
        setSelectAll(!selectAll);
    };

    const onChange = (selected: MultiValue<Option>) => {
        handleChange(selected || []);
        setSelectAll((selected || []).length === options.length);
    };

    return (
        <div>
            <div className="flex justify-between items-center w-full">
                <Label>
                    {placeholder}
                </Label>
                <div className="">
                    Select All
                    <Checkbox
                        className='ml-1'
                        checked={selectAll}
                        onClick={handleSelectAll}
                    />
                </div>
            </div>
            <Select
                options={options}
                value={selectedOptions}
                onChange={handleChange}
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                isClearable
                placeholder={placeholder}
            />
        </div>
    );
};

export default SelectMulti;
