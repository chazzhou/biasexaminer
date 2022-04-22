import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Tag, Empty } from "antd";

export const WordList = ({ listId, listType, words, color }) => {
  if (words.length === 0) {
    return (<Empty 
      description={
      <span>
        No Data<br/>
        Please submit a sentence first.
      </span>
    }/>)
  }
  return (
    <Droppable
      droppableId={listId}
      type={listType}
      direction="horizontal"
      isCombineEnabled={false}
    >
      {(dropProvided) => (
        <div {...dropProvided.droppableProps}>
          <div>
            <div>
              <div style={{ display: "flex" }} ref={dropProvided.innerRef}>
                {words.map((word, index) => (
                  <Draggable key={`${word}_${index}`} draggableId={`${word}_${index}`} index={index}>
                    {(dragProvided) => (
                      <div
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        ref={dragProvided.innerRef}
                      >
                        <Tag color={color}>{word}</Tag>
                      </div>
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
              </div>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};
