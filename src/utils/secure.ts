import CryptoJs from "crypto-js";
const password = "123456";

const encrypt = (data: string) => {
  const cipherText: string = CryptoJs.AES.encrypt(data, password).toString();
  return encodeURIComponent(cipherText.toString());
};

export { encrypt };
