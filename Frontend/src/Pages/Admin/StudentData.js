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
  const [chartData, setChartData] = useState({});
  const [barChartData, setBarChartData] = useState();
  const [dataFromTableForChart, setDataFromTableForChart] = useState([]);
  const [dataFromTableForBarChart, setDataFromTableForBarChart] = useState([]);

  useEffect(() => {
    if (!loading) {
      if (data[0].data) {
        formatData(data[0].data);
      }
    }
  }, [data]);

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
    var new_question = {
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

  const handleFetchQuestions = async () => {
    setLoadingState(true);
    const response = await fetch("http://localhost:5000/api/fetchQuestions");
    const data = await response.json();
    var listOfQuestions = [];
    for (var i in data.data) {
      var emptyQuestion = {
        Question: "",
        Options: [],
        Correct: "",
      };
      emptyQuestion["Question"] = data.data[i][0];
      emptyQuestion["Options"] = data.data[i][1];
      emptyQuestion["Correct"] = data.data[i][2];
      listOfQuestions.push(emptyQuestion);
    }
    setQuestions(listOfQuestions);
    setLoadingState(false);
  };

  const formatData = (toFormat) => {
    var dataFromTableForChartList = [];
    var dataFromTableForBarChartList = [];
    if (toFormat.length) {
      const headers = Object.keys(toFormat[0]);
      const formattedData = toFormat.map((row, index) => {
        var dataForChart = {
          "Student Name": row["Student Name"],
          "Pre Test Score": row["Pre Test Score"],
          "Post Test Score": row["Post Test Score"],
        };
        var dataForBarChart = {
          "Student Name": row["Student Name"],
          "Lecture Audio Time": row["Lecture Audio Time"],
          "Lecture Text Time": row["Lecture Text Time"],
        };
        dataFromTableForBarChartList.push(dataForBarChart);
        dataFromTableForChartList.push(dataForChart);
        return (
          <tr key={index}>
            {headers.map((header) => {
              var info = row[header];
              if (info && (header === "Question wise Pre Test Data" ||
                header === "Question wise Post Test Data" ||
                header === "Lecture Audio Complete Data")) {
                info = info.split("||").map((data, index) => (
                  <p key={index}>{data}</p>
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
    var chartData = [];
    for (var i in dataFromTableForChart) {
      var pre_test = dataFromTableForChart[i]["Pre Test Score"];
      var post_test = dataFromTableForChart[i]["Post Test Score"];
      console.log(pre_test);
      if (pre_test === "0") {
        pre_test = 100;
      }
      if (post_test === "0") {
        post_test = 100;
      }
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
      const dataWithName = {
        "Student Name": dataFromTableForChart[i]["Student Name"],
        Data: chartInfo,
      };
      chartData.push(dataWithName);
    }
    var barChartData = [];
    for (var j in dataFromTableForBarChart) {
      var audio = dataFromTableForBarChart[j]["Lecture Audio Time"];
      var text = dataFromTableForBarChart[j]["Lecture Text Time"];
      const chartInfo = {
        labels: ["Audio Time", "Text Time"],
        datasets: [
          {
            label: "Time",
            data: [audio, text],
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      };
      const dataWithName = {
        "Student Name": dataFromTableForBarChart[j]["Student Name"],
        Data: chartInfo,
      };
      barChartData.push(dataWithName);
    }
    setChartData(chartData);
    setBarChartData(barChartData);
  };

  const handleChangeStudentInfo = (e) => {
    e.preventDefault();
    console.log(tableData);
    var name = e.target.student_name.value;
    var filteredChartData = chartData.filter(
      (data) => data["Student Name"] === name
    );
    var filteredTableData = barChartData.filter(
      (data) => data["Student Name"] === name
    );
    setChartData(filteredChartData);
    setBarChartData(filteredTableData);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div>
        <p className="text-xl py-5">Student Data</p>
        <div>
          {loading ? (
            <p className="text-xl">Loading...</p>
          ) : tableData.length ? (
            <div>
              <div className="flex gap-5 pb-5">
                <button
                  className="border border-black px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setDataType("Table")}
                >
                  Table
                </button>
                <button
                  className="border border-black px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => handleShowChart()}
                >
                  Chart
                </button>
              </div>
              {dataType === "Table" ? (
                <table className="table-auto border-collapse border border-black">
                  <thead>
                    <tr>
                      {Object.keys(data[0]?.data[0] || {}).map((header) => (
                        <th
                          className="border px-4 py-2 border-black"
                          key={header}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{tableData}</tbody>
                </table>
              ) : (
                <div>
                  <div className="pb-5">
                    <p className="pb-2">Query Specific Student</p>
                    <form
                      onSubmit={handleChangeStudentInfo}
                      className="flex gap-4"
                    >
                      <input
                        type="text"
                        name="student_name"
                        placeholder="Type Name"
                        className="border-2 border-black px-2"
                      ></input>
                      <button
                        className="border border-black px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                        type="submit"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                  <div className="grid grid-cols-4">
                    {chartData.map((data, index) => (
                      <div key={index} className="py-5">
                        <p className="text-xl text-center font-semibold">
                          {data["Student Name"]}
                        </p>
                        <div className="h-[300px] w-[300px]">
                          <Pie data={data["Data"]} />
                        </div>
                        <div className="h-[400px] w-[300px] pt-4">
                          <Bar data={barChartData[index]["Data"]} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg italic text-red-500"> No Data Found</p>
          )}
        </div>
      </div>
    </div>
  );
}
