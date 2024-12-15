export const generateOTP = (length = 6) => {
  let otp = "";
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    otp += characters[index];
  }

  return otp;
};

export const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertToBase64 = (file: any) => {
  if (typeof file === "string") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const feetToCms = (height: string) => {
  const cmPerFoot = 30.48;
  const cmPerInch = 2.54;
  const regex = /^(\d+)'(\d+)''$/;

  if (height) {
    const match = height.match(regex);
    if (match) {
      const feet = parseInt(match[1]);
      const inches = parseInt(match[2]);
      const totalCm = feet * cmPerFoot + inches * cmPerInch;
      return totalCm;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export const successResponse = (message: string, data: any = null) => ({
  status: "success",
  code: 200,
  message,
  data,
});

export const errorResponse = (
  message: string,
  code: number = 500,
  errors: any = []
) => ({
  status: "error",
  code,
  message,
  errors,
});

export const convertMlTOLiters = (ml: number) => {
  if (ml) {
    return ml / 1000;
  } else {
    return 0;
  }
};
