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
  let urlWithMake = "https://motorcycle-specs-database.p.rapidapi.com/make/";
  let urlWithMakeAndModel = "";
  if (model) {
    urlWithMakeAndModel = `${urlWithMake}${make}/model/${model}`;
    options4.url = urlWithMakeAndModel;
    try {
      // const spec = await axios.request(options4);
      // console.log("fetchSpec: spec is ", spec);
      // console.log("fetchSpec: spec.data[0] is like this ", spec.data[0]);
      return null;
      // return spec.data[0];
    } catch (error) {
      console.log(error);
    }
  }
};

export const fetchSpecById = async (specId) => {
  var urlWithSpecId =
    "https://motorcycle-specs-database.p.rapidapi.com/article/";
  if (specId) {
    urlWithSpecId = `${urlWithSpecId}${specId}`;
    options5.url = urlWithSpecId;
    try {
      // const spec = await axios.request(options5);
      // console.log(`spec that i got byID is ${spec}`);

      // console.log("fetchSpecById: spec is like this ", spec);
      return null;
      // return spec;
    } catch (error) {
      console.log(
        "fetchSpecById: error occured hereherehrehrrh. error is ",
        error
      );
      return null;
    }
  } else {
    return "hang on...";
  }
};

export const fetchModels = async (make) => {
  var urlWithMake =
    "https://motorcycle-specs-database.p.rapidapi.com/model/make-name/";
  if (make) {
    urlWithMake = `${urlWithMake}${make}`;
    options3.url = urlWithMake;
    try {
      const models = await axios.request(options3);
      const returnModels = models.data.map((model) => model.name);
      console.log("fetchModels: returnModels is like this ", returnModels);
      return returnModels;
    } catch (error) {}
  } else {
    return "hang on...";
  }
};

export const makeList = async () => {
  try {
    // const { data } = await axios.request(options2);
    // const returnValue = data.map((make) => make.name);
    // console.log("makeList: returnValue is like this ", returnValue);
    return null;
    // return returnValue;
  } catch (error) {}
};
