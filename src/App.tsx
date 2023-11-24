import React from "react";
import style from "./App.module.css";
import BoardComponent from "./components/BoardComponent";

const App: React.FC = () => {
  return (
    <div className={style.app}>
      <BoardComponent />
    </div>
  );
};

export default App;
