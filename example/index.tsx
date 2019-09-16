import React from "react";
import ReactDOM from "react-dom";
import Calendar from "../src/calendar/index";

class App extends React.Component {
  onSelect = (date: Date) => {
    console.log("onSelect date => ", date);
  };
  render() {
    return (
      <Calendar
        signDates={[]}
        reSignDates={[]}
        onSelect={date => this.onSelect(date)}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
