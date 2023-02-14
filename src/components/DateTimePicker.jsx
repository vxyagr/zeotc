import React, { useState } from 'react';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

export default function CustomDateTimePicker({handleDate}) {
  let dateTime = new Date();
  dateTime = dayjs(dateTime);
  dateTime = dateTime + (7 * 24 * 60 * 60 * 1000);
  const [dateWithInitialValue, setDateWithInitialValue] = useState(
    dateTime
  );

  const handleChange = (newValue) => {
    setDateWithInitialValue(newValue);
    handleDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <DateTimePicker
          value={dateWithInitialValue}
          onChange={(newValue) => handleChange(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              helperText='Clear Initial State'
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}