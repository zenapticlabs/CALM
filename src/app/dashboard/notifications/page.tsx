"use client";
import { IOSSwitch } from "@components/Input/GeneralSwitch";
import {
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
const Page = () => {
  return (
    <div className="pt-6 pb-2.5 xl:pb-1 overflow-x-auto">
      <div className="px-12 py-4 !font-satoshi text-2xl font-semibold text-[#1f325c] flex items-center gap-2">
        Notifications
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="px-8 shadow-6 rounded-2xl">
          <div className="py-4 text-xl font-medium border-b border-[#e0e0e0] text-[#1f325c]">
            Send notificatinos for license activities
          </div>
          <div className="flex items-center text-base px-2 py-4 justify-between font-medium">
            <div className="">License key is created</div>
            <FormControlLabel control={<IOSSwitch sx={{ mx: 1 }} />} label="" />
          </div>
          <div className="flex items-center text-base px-2 py-4 justify-between font-medium">
            <div className="">License key is expired</div>
            <FormControlLabel control={<IOSSwitch sx={{ mx: 1 }} />} label="" />
          </div>
        </div>

        <div className="px-8 shadow-6 rounded-2xl">
          <div className="py-4 text-xl font-medium border-b border-[#e0e0e0] text-[#1f325c]">
            Send reminders for license activities
          </div>
          <div className="py-4 px-2">
            <div className="flex items-center gap-2">
              <TextField
                hiddenLabel
                defaultValue={1}
                type="number"
                id="filled-hidden-label-small"
                size="small"
                sx={{ width: "100px" }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  defaultValue={dayjs("2022-04-17")}
                  slotProps={{
                    textField: { size: "small", sx: { width: "180px" } },
                  }}
                />
              </LocalizationProvider>
              <FormControl sx={{ width: "100px" }}>
                <Select
                  defaultValue={"before"}
                  displayEmpty
                  size="small"
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value={"before"}>Before</MenuItem>
                  <MenuItem value={"after"}>After</MenuItem>
                </Select>
              </FormControl>
              <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                size="small"
                sx={{ width: "100px" }}
              />
              <Button variant="contained">Apply</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
