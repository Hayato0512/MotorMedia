import {
  React,
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
} from "react";
//important imports
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import QuestionTextSearch from "../../components/QuestionTextSearch/QuestionTextSearch";
import QuestionRightbar from "../../components/QuestionRightbar/QuestionRightbar";
import QuestionDialog from "../../components/questionDialog/QuestionDialog";
import TagSearch from "../../components/TagSearch/TagSearch";
import "./job.css";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

/** Jobs.
 *  I wanna be able to :
 *      - create a job posting.
 *      - apply for a job posting.
 *      - delete a job posting.
 *      - bookmark a job.
 *      -  Search for a job posting by category, keywords, and filtering like newest, oldest, or popular.
 *      - I wanna be able to share a link to a friend through chat. I can do it -> search for a way to create link, jump to a link, all the stuff.
 *      -
 *
 * So the things to do:
 *  1,  make the UI and everything.
 *  2, and keep doing it.
 *
 */
export default function Job() {
  const [order, setOrder] = useState("");
  const [tags, setTags] = useState([]); //so I need these tags here, to show the chips. but also I wanna let the parent component
  const [isQuestionPosted, setIsQuestionPosted] = useState(false);
  const { jobList, setJobList } = useState([]); //make custom hook for this one.
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const jobCreateClicked = () => {};
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleChange = () => {};
  return (
    <>
      <Topbar />
      <div className="job">
        <Sidebar />
        <div className="jobContainer">
          <div className="jobTitleContainer">
            <div className="jobTitle">JOBS</div>
          </div>
          <div className="jobCreateButtonDiv">
            <div className="jobCreateButton">
              <button onClick={jobCreateClicked} className="JobCreateButton">
                + Post Job
              </button>
            </div>
          </div>
          <div className="jobSearchInputDiv">
            <QuestionTextSearch />
          </div>
          <div className="jobFilterContainer">
            <FormControl sx={{ width: "30%" }}>
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={order}
                label="Order"
                onChange={handleChange}
              >
                <MenuItem value={"oldest"}>oldest</MenuItem>
                <MenuItem value={"popular"}>most popular</MenuItem>
                <MenuItem value={"newest"}>newest</MenuItem>
              </Select>
            </FormControl>
          </div>
          <TagSearch onChange={setTags} />
          <div className="jobList">
            {/* {jobList.map(
              (job) =>
                // <Question question={job} />
                job
            )} */}
            jo
          </div>
        </div>
        <QuestionRightbar isQuestionPosted={isQuestionPosted} />
      </div>
      <QuestionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onPost={setIsQuestionPosted}
      />
    </>
  );
}
