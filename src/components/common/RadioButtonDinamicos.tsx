import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ReactElement } from 'react';

interface Option {
  name: string;
  label: string;
}

interface DynamicRadioGroupProps {
  options: Option[];
  selectedValue?: string;
  onChange: (value: string) => void;
  defaultValue: string;
}

const DynamicRadioGroup = ({
  options,
  selectedValue,
  onChange,
  defaultValue,
}: DynamicRadioGroupProps): ReactElement => {
  return (
    <FormControl component="fieldset">
      <RadioGroup row value={selectedValue} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <FormControlLabel
            key={option.name}
            value={option.name}
            control={<Radio defaultValue={defaultValue} />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default DynamicRadioGroup;
