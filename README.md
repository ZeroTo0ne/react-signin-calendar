# React-Signin-Calendar
![](https://img.shields.io/npm/v/rc-signin-calendar)  ![](https://img.shields.io/npm/l/rc-signin-calendar)
# Screenshots
![](screenshots/calendar_screenshot.gif)

# Getting started
you should use npm to install it.
```
npm install rc-signin-calendar
```

# Usage
```
import Calendar from "rc-signin-calendar";

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

```
# API
Properties | Type | Descrition | Required
|:-:|:-:|:-:|:-:|
signDates | Date [] | sign in dates | true|
reSignDates | Date [] | resign in dates | true |
onSelect | (date: Date) => void | select date callback | true | 
optionalDateRange|Object | sign in begin and end date | false |
selectedBgColor| string |sign in background color| false |
...|...|...|...
# License

[The MIT License](https://github.com/ZeroTo0ne/react-signin-calendar/blob/master/LICENSE)

