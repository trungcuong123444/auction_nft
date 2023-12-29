import axios from "axios";
import FormData from "form-data";
import { pinataApi } from "./pinataApi";

export const uploadJsonToIPFS = async (json) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  try {
    const res = await axios.post(url, json, {
      headers: {
        pinata_api_key: pinataApi.apiKey,
        pinata_secret_api_key: pinataApi.apiSecret,
      },
    });
    console.log(res.data.IpfsHash);
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //making axios POST request to Pinata ⬇️

  let data = new FormData();
  data.append("file", file);
  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);
  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  try {
    const res = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        pinata_api_key: pinataApi.apiKey,
        pinata_secret_api_key: pinataApi.apiSecret,
      },
    });
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  } catch (error) {
    console.log(error);
  }
};
