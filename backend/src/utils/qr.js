import QRCode from "qrcode";

const generateQR = async (text) => {
  return await QRCode.toDataURL(text);
};

export default generateQR;
