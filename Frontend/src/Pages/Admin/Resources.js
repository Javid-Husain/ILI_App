import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Pie, Bar } from "react-chartjs-2";
import useGoogleSheets from "use-google-sheets";
import BeatLoader from "react-spinners/BeatLoader";

export default function Admin() {
  const { data, loading, error } = useGoogleSheets({
    apiKey: 'AIzaSyC8nFH4nDKEpn24vbh8koGWu2mAbuqSfMc',
    sheetId: '1otnCxVm1SUAkGvdThkxi3qxjnKOHnfRCYrxAWv5jD40',
  });

  const [tableData, setTableData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [dataType, setDataType] = useState("Table");
  const [chartData, setChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [dataFromTableForChart, setDataFromTableForChart] = useState([]);
  const [dataFromTableForBarChart, setDataFromTableForBarChart] = useState([]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      formatData(data[0].data);
    }
  }, [data, loading]);

  useEffect(() => {
    handleFetchQuestions();
  }, []);

  const handleDeleteQuestion = async (question) => {
    setLoadingState(true);
    console.log(question);
    const response = await fetch("http://localhost:5000/api/deleteQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Question: question }),
    });
    const data = await response.json();
    console.log(data);
    if (data.message === "Question Deleted") {
      handleFetchQuestions();
    }
    setLoadingState(false);
  };

  const handleAddQuestion = async (e) => {
    setLoadingState(true);
    console.log(e.target.question.value);
    e.preventDefault();
    const new_question = {
      Question: e.target.question.value,
      Options: e.target.options.value,
      Correct: e.target.correct.value,
    };
    const response = await fetch("http://localhost:5000/api/addQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_question),
    });
    const data = await response.json();
    console.log(data);
    if (data.message === "Question Added") {
      handleFetchQuestions();
    }
    setLoadingState(false);
  };

const handleAddParagraph = async (e) => {
  setLoadingState(true);
  console.log(e.target.paragraph.value);
  e.preventDefault();
  const new_paragraph = {
    Paragraph: e.target.paragraph.value,
  };
  const response = await fetch("http://localhost:5000/api/addParagraph", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(new_paragraph),
  });
  const data = await response.json();
  console.log(data);
  if (data.message === "Paragraph Added") {
    // Fetch paragraphs if needed
    // handleFetchParagraphs();
  }
  e.target.paragraph.value = "";
  setLoadingState(false);
};

  const handleFetchQuestions = async () => {
    setLoadingState(true);
    const response = await fetch("http://localhost:5000/api/fetchQuestions");
    const data = await response.json();
    const listOfQuestions = data.data.map((question) => ({
      Question: question[0],
      Options: question[1],
      Correct: question[2],
    }));
    setQuestions(listOfQuestions);
    setLoadingState(false);
  };

  const formatData = (toFormat) => {
    const dataFromTableForChartList = [];
    const dataFromTableForBarChartList = [];
    if (toFormat.length) {
      const headers = Object.keys(toFormat[0]);
      const formattedData = toFormat.map((row, index) => {
        const dataForChart = {
          "Student Name": row["Student Name"],
          "Pre Test Score": row["Pre Test Score"],
          "Post Test Score": row["Post Test Score"],
        };
        const dataForBarChart = {
          "Student Name": row["Student Name"],
          "Lecture Audio Time": row["Lecture Audio Time"],
          "Lecture Text Time": row["Lecture Text Time"],
        };
        dataFromTableForBarChartList.push(dataForBarChart);
        dataFromTableForChartList.push(dataForChart);
        return (
          <tr key={index}>
            {headers.map((header) => {
              let info = row[header];
              if (
                (header === "Question wise Pre Test Data" ||
                  header === "Question wise Post Test Data" ||
                  header === "Lecture Audio Complete Data") &&
                info
              ) {
                info = info.split("||").map((data, idx) => (
                  <p key={idx}>{data}</p>
                ));
              }
              return (
                <td key={header} className="border px-4 py-2 border-black">
                  {info}
                </td>
              );
            })}
          </tr>
        );
      });
      setTableData(formattedData);
      setDataFromTableForChart(dataFromTableForChartList);
      setDataFromTableForBarChart(dataFromTableForBarChartList);
    }
  };

  const handleShowChart = () => {
    setDataType("Chart");
    const chartData = dataFromTableForChart.map((item) => {
      const pre_test = item["Pre Test Score"] === "0" ? 100 : item["Pre Test Score"];
      const post_test = item["Post Test Score"] === "0" ? 100 : item["Post Test Score"];
      const chartInfo = {
        labels: ["Pre Test Score", "Post Test Score"],
        datasets: [
          {
            data: [pre_test, post_test],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      return {
        "Student Name": item["Student Name"],
        Data: chartInfo,
      };
    });

    const barChartData = dataFromTableForBarChart.map((item) => {
      const chartInfo = {
        labels: ["Audio Time", "Text Time"],
        datasets: [
          {
            label: "Time",
            data: [item["Lecture Audio Time"], item["Lecture Text Time"]],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      return {
        "Student Name": item["Student Name"],
        Data: chartInfo,
      };
    });

    setChartData(chartData);
    setBarChartData(barChartData);
  };

  const handleChangeStudentInfo = (e) => {
    e.preventDefault();
    const name = e.target.student_name.value;
    const filteredChartData = chartData.filter(
      (data) => data["Student Name"] === name
    );
    const filteredBarChartData = barChartData.filter(
      (data) => data["Student Name"] === name
    );
    setChartData(filteredChartData);
    setBarChartData(filteredBarChartData);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {loadingState ? (
        <div className="flex justify-center items-center h-screen">
          <BeatLoader color={"#123abc"} loading={loadingState} size={15} />
        </div>
      ) : (
        <div className="py-4 px-8">
          <div className="text-3xl font-semibold pb-5">
            Question Management
            <a
              href='https://docs.google.com/spreadsheets/d/1otnCxVm1SUAkGvdThkxi3qxjnKOHnfRCYrxAWv5jD40/edit?gid=0#gid=0'
              className="text-blue-500 text-lg ml-5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Sheet Link
            </a>
          </div>
          {questions.length ? (
            <div>
              <table className="table-auto border-collapse border border-black">
                <thead>
                  <tr>
                    {Object.keys(questions[0]).map((header) => (
                      <th
                        className="border px-4 py-2 border-black"
                        key={header}
                      >
                        {header}
                      </th>
                    ))}
                    <th className="border px-4 py-2 border-black">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2 border-black">
                        {question["Question"]}
                      </td>
                      <td className="border px-4 py-2 border-black">
                        {question["Options"]}
                      </td>
                      <td className="border px-4 py-2 border-black">
                        {question["Correct"]}
                      </td>
                      <td className="border px-4 py-2 border-black">
                        <button
                          className="border border-black px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                          onClick={() =>
                            handleDeleteQuestion(question["Question"])
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <p className="text-xl pt-5">Add New Question</p>
                <form className="flex gap-5" onSubmit={handleAddQuestion}>
                  <input
                    type="text"
                    placeholder="Question"
                    className="border border-black px-4 py-2 rounded my-2"
                    name="question"
                  />
                  <input
                    type="text"
                    placeholder="Options"
                    className="border border-black px-4 py-2 rounded my-2"
                    name="options"
                  />
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    className="border border-black px-4 py-2 rounded my-2"
                    name="correct"
                  />
                  <button
                    type="submit"
                    className="border border-black px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 my-2"
                  >
                    Add Question
                  </button>
                </form>
              </div>
              <div>
                <p className="text-xl pt-5">Add New Paragraph</p>
                <form className="flex gap-5" onSubmit={handleAddParagraph}>
                  <input
                    type="text"
                    placeholder="Paragraph"
                    className="border border-black px-4 py-2 rounded my-2"
                    name="paragraph"
                  />
                  <button
                    type="submit"
                    className="border border-black px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 my-2"
                  >
                    Add Paragraph
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <p className="text-lg italic text-red-500"> No Data Found</p>
          )}

          {dataType === "Chart" && (
            <div className="pt-5">
              <div>
                <p className="text-xl">Filter by Student Name</p>
                <form className="flex gap-5" onSubmit={handleChangeStudentInfo}>
                  <input
                    type="text"
                    placeholder="Student Name"
                    className="border border-black px-4 py-2 rounded my-2"
                    name="student_name"
                  />
                  <button
                    type="submit"
                    className="border border-black px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 my-2"
                  >
                    Filter
                  </button>
                </form>
              </div>
              <div>
                <p className="text-2xl font-semibold">Pre vs Post Test Scores</p>
                {chartData.length > 0 ? (
                  chartData.map((item, index) => (
                    <div key={index}>
                      <h3>{item["Student Name"]}</h3>
                      <Pie data={item.Data} />
                    </div>
                  ))
                ) : (
                  <p>No Chart Data Available</p>
                )}
              </div>
              <div className="pt-5">
                <p className="text-2xl font-semibold">
                  Lecture Audio vs Text Time
                </p>
                {barChartData.length > 0 ? (
                  barChartData.map((item, index) => (
                    <div key={index}>
                      <h3>{item["Student Name"]}</h3>
                      <Bar data={item.Data} />
                    </div>
                  ))
                ) : (
                  <p>No Bar Chart Data Available</p>
                )}
              </div>
            </div>
          )}
          {/* {dataType === "Table" && (
            <div className="pt-5">
              <p className="text-2xl font-semibold">Table Data</p>
              <table className="table-auto border-collapse border border-black">
                <thead>
                  <tr>
                    {tableData.length > 0 &&
                      Object.keys(tableData[0].props.children).map((header, index) => (
                        <th
                          className="border px-4 py-2 border-black"
                          key={index}
                        >
                          {header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>{tableData}</tbody>
              </table>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
