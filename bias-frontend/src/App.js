import logo from "./logo.svg";
import "antd/dist/antd.css";
import "./App.css"
import { useState } from "react";
import { Typography, Row, Col, Input, Menu, Breadcrumb, Divider, Button } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderStatement } from "./reorder";
import { WordList } from "./WordList.tsx";
import { Layout } from 'antd';

import { CloudUploadOutlined } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const provided_labels = ["{Countries}","{Races}","{Universities}"];
  const { Title } = Typography;
  const { Search } = Input;
  const [statement, setStatement] = useState({Labels: provided_labels,
    UserInputs: []});

  const onSubmit = (value) => {
    if (value === "") {
      return;
    }
    const splitted = value.trim().replace(/\s\s+/g, ' ').split(" ");
    setStatement({ Labels: provided_labels,
                    UserInputs: splitted });
  };

  const capitalizeFirstLetterAndAppendPeriod = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1) + ".";
  }
  

  const onExamine = () => {
    if (statement.UserInputs.length === 0) {
      return;
    }
    console.log(statement.UserInputs);
    var sentence = statement.UserInputs.join(" ");
    sentence = capitalizeFirstLetterAndAppendPeriod(sentence);
    console.log(sentence)
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
      </Row>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>BiasExaminer ©2022 V0.0.1</Footer>
  </Layout>
    </>
  );
}

export default App;
