import axios from "axios";

const options1 = {
  method: "GET",
  url: "https://motorcycle-specs-database.p.rapidapi.com/model/make-name/Yamaha",
  headers: {
    "X-RapidAPI-Key": "723a040345msh9777641212e2f87p121c09jsn695f86c6a7e8",
    "X-RapidAPI-Host": "motorcycle-specs-database.p.rapidapi.com",
  },
};
const options2 = {
  method: "GET",
  url: "https://motorcycle-specs-database.p.rapidapi.com/make",
  headers: {
    "X-RapidAPI-Key": "723a040345msh9777641212e2f87p121c09jsn695f86c6a7e8",
    "X-RapidAPI-Host": "motorcycle-specs-database.p.rapidapi.com",
  },
};

const options3 = {
  method: "GET",
  url: "https://motorcycle-specs-database.p.rapidapi.com/model/make-name/",
  headers: {
    "X-RapidAPI-Key": "723a040345msh9777641212e2f87p121c09jsn695f86c6a7e8",
    "X-RapidAPI-Host": "motorcycle-specs-database.p.rapidapi.com",
  },
};

const options4 = {
  method: "GET",
  url: "https://motorcycle-specs-database.p.rapidapi.com/make/",
  headers: {
    "X-RapidAPI-Key": "723a040345msh9777641212e2f87p121c09jsn695f86c6a7e8",
    "X-RapidAPI-Host": "motorcycle-specs-database.p.rapidapi.com",
  },
};
const options5 = {
  method: "GET",
  url: "https://motorcycle-specs-database.p.rapidapi.com/article/",
  headers: {
    "X-RapidAPI-Key": "723a040345msh9777641212e2f87p121c09jsn695f86c6a7e8",
    "X-RapidAPI-Host": "motorcycle-specs-database.p.rapidapi.com",
  },
};
export const fetchSpec = async (makeAndModel) => {
  let make = makeAndModel.make;
  let model = makeAndModel.model.replace(/ /g, "%20");
  //console.log('makeAndModel', make, model);
  let urlWithMake = "https://motorcycle-specs-database.p.rapidapi.com/make/";
  let urlWithMakeAndModel = "";
  if (model) {
    urlWithMakeAndModel = `${urlWithMake}${make}/model/${model}`;
    options4.url = urlWithMakeAndModel;
    try {
      const spec = await axios.request(options4);
      //console.log('returned spec looks like this', spec.data[0]);
      return spec.data[0];
      //ok fucking awesome.
      //next session, we will pass this spec data
      // and then show that in the page. see you soon.
    } catch (error) {
      console.log(error);
    }
  }
};

export const fetchSpecById = async (specId) => {
  //console.log('now, make is this in fetchModels function', make);
  var urlWithSpecId =
    "https://motorcycle-specs-database.p.rapidapi.com/article/";
  //console.log(urlWithMake);
  if (specId) {
    urlWithSpecId = `${urlWithSpecId}${specId}`;
    options5.url = urlWithSpecId;
    //console.log('options3.url after recieving makel', options3.url);
    try {
      const spec = await axios.request(options5);
      console.log(`spec that i got byID is ${spec}`);
      // const returnModels = models.data.map((model) => model.name);
      return spec;
      //who needs this information?? modelPicker.jsx.
      //so in modelPicker.jsx, import fetchModels from './api' or somethnig
    } catch (error) {}
  } else {
    return "hang on...";
  }
};
export const fetchModels = async (make) => {
  //console.log('now, make is this in fetchModels function', make);
  var urlWithMake =
    "https://motorcycle-specs-database.p.rapidapi.com/model/make-name/";
  //console.log(urlWithMake);
  if (make) {
    urlWithMake = `${urlWithMake}${make}`;
    options3.url = urlWithMake;
    //console.log('options3.url after recieving makel', options3.url);
    try {
      const models = await axios.request(options3);
      // console.log('models looks like this', models.data);
      const returnModels = models.data.map((model) => model.name);
      return returnModels;
      //who needs this information?? modelPicker.jsx.
      //so in modelPicker.jsx, import fetchModels from './api' or somethnig
    } catch (error) {}
  } else {
    return "hang on...";
  }
};
export const makeList = async () => {
  try {
    const { data } = await axios.request(options2);
    // console.log('list of all makes is like this now', data);
    const returnValue = data.map((make) => make.name);
    //console.log('returnValue is ', returnValue);
    return returnValue;
  } catch (error) {}
};
/*
export const fetchData = async ()=>{
 try{
     const response = await axios.request(options1);
     return response;

 } 
 catch(error){

 }

}
*/
/*
var Twit = require('twit');

const T = new Twit({
    appKey:'0RFuPKRFbQryrAYWcm0z0fw7W',
    appSecret:'eAExm4Kzqvc1TuapK8MQwuDFUonO3fHa7jDlnSVrkXdd8i0SX1',
    accessToken:'1200308573898604544-LDMxxzsVd8Jj0LmjC0woyBjFbs8Ve5',
    accessSecret:'X3Ooopmd3YlScCtMcg3Lp71oOOgUKSNOYbFOoDUNV6s0n',


})


*/

/**
 * Twitter
 * API key:tNOddDQtF0Soavr2SaSrgYlpo
 *
 * API key secret: Rd6ClNpIoAjoM4rkZAvR4o7RaYoWxkbke2qEciGsuphDbw1uxt
 *
 *
 * bearer token: AAAAAAAAAAAAAAAAAAAAAJKHcQEAAAAAJaKkGOBtAuRc0Sxdn9JVpkF%2BSWI%3DBIzwo60vlgzeYAAHMiuz0OOouX1YflwuEADsuHPWyxFNPybqfC
 *
 */
