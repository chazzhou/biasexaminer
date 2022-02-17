import logo from "./logo.svg";
import "antd/dist/antd.css";
import { useState } from "react";
import { Typography, Row, Col, Input } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderStatement } from "./reorder";
import { WordList } from "./WordList.tsx";

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
      <Row align="middle">
        <Col offset={10}>
          <Title>CS 338 Bias Project</Title>
          <Search
            placeholder="Please enter a statement"
            enterButton="Submit"
            onSearch={onSubmit}
          />
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
    </>
  );
}

export default App;
