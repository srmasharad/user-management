import { z } from "zod";

export const FILE_SIZE = 1000000;
export const IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const textRegex = /^[A-Za-z\s]+$/;

export const phoneRegex =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

export const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] [APap][mM]$/;

export const stringValidate = z
  .string()
  .nonempty("Required field")
  .min(2, "Cannot be less than 2 character");

export const stringNotRequired = stringValidate.optional().or(z.literal(""));

export const phoneValidate = z
  .string()
  .regex(phoneRegex, "Invalid phone number")
  .optional()
  .or(z.literal(""));

export const emailValidate = z
  .string()
  .nonempty("Required field")
  .email("Invalid email");

// Custom validation function to compare start and end times
export const isStartTimeBeforeEndTime = (
  value: string,
  context: { start_at: string }
) => {
  const start = new Date(context.start_at);
  const end = new Date(value);
  return start < end;
};

// Custom validation function for 12-hour format time
export const isValidTime12HourFormat = (value: string) => {
  if (!value || typeof value !== "string") return false;
  return timeRegex.test(value);
};

export const downloadQRCode = (qrName: string) => {
  const canvas = document.getElementById("qrcode-canvas") as HTMLCanvasElement;
  const dataURL = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataURL;
  a.download = `${qrName}-qrcode.png`;
  a.click();
};

export const printQRCode = () => {
  const canvas = document.getElementById("qrcode-canvas") as HTMLCanvasElement;
  const dataURL = canvas.toDataURL("image/png");
  if (dataURL) {
    const windowContent = `<img src="${dataURL}" style="width:100%;" />`;
    const printWindow = window.open("", "", "width=600,height=800");
    printWindow?.document.open();
    printWindow?.document.write(
      `<html><head><title>Print QR Code</title></head><body onload="window.print();">${windowContent}</body></html>`
    );
    printWindow?.document.close();
  }
};
