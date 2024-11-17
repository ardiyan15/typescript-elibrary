import CryptoJs from "crypto-js";
const password = "123456";

const encrypt = (data: string) => {
  const cipherText: string = CryptoJs.AES.encrypt(data, password).toString();
  return encodeURIComponent(cipherText.toString());
};

const decrypt = (data: string) => {
  const bytes = CryptoJs.AES.decrypt(decodeURIComponent(data), password);
  const originalText = bytes.toString(CryptoJs.enc.Utf8);

  return originalText;
};

export { encrypt, decrypt };