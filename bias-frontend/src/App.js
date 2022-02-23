import logo from "./logo.svg";
import "antd/dist/antd.css";
import "./App.css"
import { useState } from "react";
import { Typography, Row, Col, Input, Menu, Breadcrumb, Divider } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderStatement } from "./reorder";
import { WordList } from "./WordList.tsx";
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

function App() {
  const { Title } = Typography;
  const { Search } = Input;
  const [statement, setStatement] = useState({});

  const onSubmit = (value) => {
    const splitted = value.split(" ");
    setStatement({ a: splitted });
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
      <Row align="middle">
        <Col offset={10}>
          <Search
            placeholder="Please enter a statement"
            enterButton="Submit"
            onSearch={onSubmit}
          />
        </Col>
        <Divider></Divider>
        <Col offset={10}>
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) {
                return;
              }

              setStatement(reorderStatement(statement, source, destination));
            }}
          >
            <div>
              {Object.entries(statement).map(([k, v]) => (
                <WordList
                  internalScroll
                  key={`${k}_${v}`}
                  listId={k}
                  listType="CARD"
                  words={v}
                />
              ))}
            </div>
          </DragDropContext>
          </Col>
      </Row>
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>BiasExaminer ©2022</Footer>
  </Layout>
    </>
  );
}

export default App;
