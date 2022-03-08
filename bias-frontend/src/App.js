import logo from "./logo.svg";
import "antd/dist/antd.css";
import "./App.css"
import { useState } from "react";
import { Typography, Row, Col, Input, Menu, Breadcrumb, Divider, Button } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderStatement } from "./reorder";
import { WordList } from "./WordList.tsx";
import { Layout } from 'antd';
import ReactDOM from 'react-dom';

import { CloudUploadOutlined } from '@ant-design/icons';
import { generateInputs } from "./generateInputs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale,BarElement, Title, ArcElement, Tooltip, Legend);


const { Header, Footer, Sider, Content } = Layout;

let labels = [];
let frequencies= [];
const wordSet = new Set([]);
const wordCount = {};
const wordDict = {};
const commonalityScore = {};
let chartdata;

const analyze = (results) => {
  for (let index in results) {
    for (const [key, value] of Object.entries(results[index][1])) {
      let token_word = value.token_str.trim();
      if (!wordSet.has(token_word)) {
        wordDict[token_word] = {};
        wordCount[token_word] = 0;
      }
      wordCount[token_word] += 1;
      wordDict[token_word][results[index][0]] = value.score;
      wordSet.add(token_word);
    }
  };
  for (let index in results) {
    commonalityScore[results[index][0]] = 0;
    for (const [key, value] of Object.entries(results[index][1])) {
      let token_word = value.token_str.trim();
      let token_score = wordCount[token_word];
      if (token_score > 1) {
        commonalityScore[results[index][0]] += token_score;
      }
    }
  };
  console.log("wordSet",wordSet);
  console.log("wordDict",wordDict);
  console.log("wordCount",wordCount);
  console.log("commonalityScore",commonalityScore);

  sortWordCount();
  console.log("labels", labels);
  console.log("frequencies", frequencies);

  chartdata = {
    labels: labels,
    datasets: [
      {
        label: '# of Votes',
        data: frequencies,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };  

  console.log("chartdata",chartdata);



  const pie = (
    <Pie data={chartdata} />
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };
  const commonalityLabels = Object.keys(commonalityScore);
  const commonalityValues = Object.values(commonalityScore);
  console.log('commonalityLabels',commonalityLabels);
  console.log('commonalityValues',commonalityValues);
  const bardata = {
    commonalityLabels,
    datasets: [
      {
        label: 'Commonality Scores',
        data: commonalityValues,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };
  const barchart = (
    <Bar options={options} data={bardata} />
  );
  ReactDOM.render(pie, document.getElementById('piechart'));
  ReactDOM.render(barchart, document.getElementById('barchart'));
  
};

function sortWordCount()
{
  labels = []
  frequencies = []
  for (const [key, value] of Object.entries(wordCount)) {
    labels.push(key);
    frequencies.push(value);
  }

  console.log("labels", labels);
  console.log("frequencies", frequencies);
  
  let arrayOfObj = labels.map(function(d, i) {
    return {
      label: d,
      data: frequencies[i] || 0
    };
  });


  
  let sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
    return b.data>a.data;
  });

  let newArrayLabel = [];
  let newArrayData = [];

  sortedArrayOfObj.forEach(function(d){
    newArrayLabel.push(d.label);
    newArrayData.push(d.data);
  });

  labels = newArrayLabel;
  frequencies = newArrayData;
};



function App() {
  const provided_labels = ["{companies}","{race singular}","{race plural}", "{jobs}", "{nationalities}" ];
  const { Title } = Typography;
  const { Search } = Input;
  const [statement, setStatement] = useState({Labels: provided_labels,
    UserInputs: []});

  

  const onSubmit = (value) => {
    if (value === "") {
      return;
    }
    let splitted = value.trim().replace(/\s\s+/g, ' ').split(" ");
    splitted.push("<mask>")
    setStatement({ Labels: provided_labels,
                    UserInputs: splitted });
  };

  const capitalizeFirstLetterAndAppendPeriod = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1) + ".";
  }

  const getRepliesFromBackend = async (sentences) => {
    let results = [];
    await Promise.all(
      sentences.map(async (item) => {
        const result = await fetch(`http://165.124.25.24:5000/RunTest?TestSentence=${item[1]}&TargetWord=${item[0]}`);
        // console.log("emotions", result['emotions']);
        result.json().then((item) => results.push([item.target, item.results]));
      }));
    console.log('Items processed');
    console.log("results",results);
    return results;
  };
  

  const onExamine = () => {
    if (statement.UserInputs.length === 0) {
      return;
    }
    let generatedSentences = generateInputs(statement["UserInputs"]);
    getRepliesFromBackend(generatedSentences).then((results) => analyze(results));
   
  };
  



  return (
    <>
    <Layout className="layout">
    <Header>
      <div className="logo">BiasExaminer</div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['Examine']}>
        <Menu.Item key="Examine">Examine</Menu.Item>
        <Menu.Item key="Settings">Settings</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>BiasExaminer</Breadcrumb.Item>
        <Breadcrumb.Item>Examine</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">
      <Row justify="space-around" align="middle">
        <Col>
          <Search
            placeholder="Please enter a statement"
            enterButton="Submit"
            onSearch={onSubmit}
            size="large"
          />
        </Col>
        <Divider></Divider>
        <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) {
                return;
              }

              setStatement(reorderStatement(statement, source, destination));
            }}
          >
        <Col>
            <div>
              <WordList
                internalScroll
                key="Labels"
                listId="Labels"
                listType="CARD"
                words={statement["Labels"]}
              />
            </div>
          </Col>
        <Divider></Divider>
        <Col>
            <div>
                <WordList
                  internalScroll
                  key="UserInputs"
                  listId="UserInputs"
                  listType="CARD"
                  words={statement["UserInputs"]}
                />
            </div>
          </Col>
          </DragDropContext>
          <Divider></Divider>
          <Col>
            <Button type="primary" icon={<CloudUploadOutlined />} size="large"
            onClick={onExamine}>
              Examine Bias
            </Button>
          </Col>
          <Divider></Divider>
          <Col>
            <div id="piechart" ></div>
          </Col>
          <Divider></Divider>
          <Col>
            <div id="barchart" ></div>
          </Col>
      </Row>
      
      
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>BiasExaminer ©2022 V0.0.2</Footer>
  </Layout>
    </>
  );
}

export default App;
