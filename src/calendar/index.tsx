import React from "react";
import moment from "moment";
import styles from "./index.less";

interface IProps {
  defaultDateValue?: Date;
  signDates: Date[];
  reSignDates: Date[];
  optionalDateRange?: OptionDateRange;
  onSelect(date: Date): void;
  selectedBgColor?: string;
  dotBgColor?: string;
  dotContent?: string;
  showToday?: boolean;
}
interface OptionDateRange {
  beginDate: Date;
  endDate: Date;
}
interface Row {
  columns: DayItem[];
}
interface DayItem {
  day: number;
  month: number;
  year: number;
  showDot: boolean;
  isSelected: boolean;
}

interface IState {
  currentMonthDatas: Row[];
  currentDate: Date;
  signDates: Date[];
  reSignDates: Date[];
}
enum MonthType {
  PRE_MONTH,
  NEXT_MONTH
}
const weeks = ["日", "一", "二", "三", "四", "五", "六"];
const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const today = new Date();

export default class Calendar extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentMonthDatas: [],
      currentDate: new Date(),
      signDates: [],
      reSignDates: []
    };
  }

  componentDidMount() {
    const { defaultDateValue } = this.props;
    if (defaultDateValue) {
      this.setState(
        {
          currentDate: defaultDateValue
        },
        () => {
          this.generateMonthDatas(defaultDateValue);
        }
      );
    } else {
      this.loadCurrentMonthDatas();
    }
  }
  static getDerivedStateFromProps(props: any, state: any) {
    const { reSignDates, signDates } = props;
    if (signDates !== state.signDates || reSignDates !== state.reSignDates) {
      return {
        signDates: props.signDates,
        reSignDates: props.reSignDates
      };
    }
    return null;
  }

  loadCurrentMonthDatas = () => {
    const { currentDate } = this.state;
    this.generateMonthDatas(currentDate);
  };

  getDaysOfMonth = (date: Date) => {
    const month = date.getMonth();
    if (month == 1 && this.isLeapYear(date)) {
      return 29;
    }
    return daysOfMonths[month];
  };

  isLeapYear = (date: Date) => {
    const year = date.getFullYear();
    return moment([year]).isLeapYear();
  };

  getFristDayOfMonth = (date: Date) => {
    date.setDate(1);
    return date.getDay();
  };

  getDaysOfFristRow = (date: Date) => {
    return weeks.length - this.getFristDayOfMonth(date);
  };

  checkDateBetweenInRange = (year: number, month: number, day: number) => {
    const { optionalDateRange } = this.props;
    if (typeof optionalDateRange === "undefined") {
      return true;
    }
    const { beginDate, endDate } = optionalDateRange;
    const currentDateStr = `${year}-${month + 1}-${day}`;
    const startDateStr = moment(beginDate).format("YYYY-MM-DD");
    const endDateStr = moment(endDate).format("YYYY-MM-DD");
    if (
      moment(currentDateStr, "YYYY-MM-DD").isSame(startDateStr) ||
      moment(currentDateStr, "YYYY-MM-DD").isSame(endDateStr)
    ) {
      return true;
    }
    return moment(currentDateStr, "YYYY-MM-DD").isBetween(
      startDateStr,
      endDateStr
    );
  };

  showSignDayBackGround = (year: number, month: number, _day: number) => {
    const { signDates } = this.state;
    if (!signDates) {
      return false;
    }
    return (
      signDates.filter(
        day =>
          day.getFullYear() === year &&
          day.getMonth() === month &&
          day.getDate() === _day
      ).length > 0
    );
  };

  showReSignDayDot = (year: number, month: number, _day: number) => {
    const { reSignDates } = this.state;
    if (!reSignDates) {
      return false;
    }
    return (
      reSignDates.filter(
        day =>
          day.getFullYear() === year &&
          day.getMonth() === month &&
          day.getDate() === _day
      ).length > 0
    );
  };

  onSelectDay = (date: DayItem) => {
    const { onSelect } = this.props;
    const _date = new Date();
    _date.setFullYear(date.year);
    _date.setMonth(date.month);
    _date.setDate(date.day);
    onSelect(_date);
  };

  isToday = (cell: DayItem) => {
    return (
      today.getFullYear() === cell.year &&
      today.getMonth() === cell.month &&
      today.getDate() === cell.day
    );
  };

  generateExtraMonthDatas = (
    type: MonthType,
    currentDate: Date,
    daysInRow: number
  ) => {
    if (daysInRow === 0 || daysInRow === 7) {
      return [];
    }
    const currentmonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const cellsOfExtraMonth: DayItem[] = [];
    const newDate = new Date();
    let year = currentYear;
    let month = currentmonth;
    let startPos = 0;
    let endPos = 0;
    switch (type) {
      case MonthType.NEXT_MONTH:
        year = currentmonth === 11 ? currentYear + 1 : currentYear;
        month = currentmonth === 11 ? 0 : currentmonth + 1;
        startPos = 1;
        endPos = 7 - daysInRow;
        break;
      case MonthType.PRE_MONTH:
        year = currentmonth === 0 ? currentYear - 1 : currentYear;
        month = currentmonth === 0 ? 11 : currentmonth - 1;
        newDate.setMonth(month);
        const daysInPreMonth = this.getDaysOfMonth(newDate);
        const lackDays = 7 - daysInRow;
        startPos = daysInPreMonth - lackDays + 1;
        endPos = daysInPreMonth;
        break;
      default:
        break;
    }
    newDate.setFullYear(year);
    newDate.setMonth(month);
    for (let i = startPos; i <= endPos; i++) {
      const dayItem: DayItem = {
        day: i,
        month: month,
        year: year,
        showDot: this.showReSignDayDot(year, month, i),
        isSelected: this.showSignDayBackGround(year, month, i)
      };
      cellsOfExtraMonth.push(dayItem);
    }
    return cellsOfExtraMonth;
  };

  generateMonthDatas = (date: Date) => {
    const fristRowDays = this.getDaysOfFristRow(date);
    const daysOfOtherRow = this.getDaysOfMonth(date) - fristRowDays;
    const lastRowDays = daysOfOtherRow % 7;
    let rowCount = Number.parseInt((daysOfOtherRow / 7 + 1).toString());
    if (lastRowDays !== 0) {
      rowCount++;
    }
    const datasOfPreMonth = this.generateExtraMonthDatas(
      MonthType.PRE_MONTH,
      date,
      fristRowDays
    );
    const datasOfNextMonth = this.generateExtraMonthDatas(
      MonthType.NEXT_MONTH,
      date,
      lastRowDays
    );
    const currentMonthDatas: Row[] = [];
    let dayPos = 1;
    for (let i = 0; i < rowCount; i++) {
      const row: Row = {
        columns: []
      };
      let cellDatas: DayItem[] = [];
      let startPos = 0;
      let endPos = 7;
      if (i === 0 && datasOfPreMonth.length !== 0) {
        cellDatas = cellDatas.concat(datasOfPreMonth);
        startPos = datasOfPreMonth.length;
      } else if (i === rowCount - 1) {
        endPos = lastRowDays === 0 ? 7 : lastRowDays;
      }
      for (let j = startPos; j < endPos; j++) {
        const cell: DayItem = {
          day: dayPos,
          month: date.getMonth(),
          year: date.getFullYear(),
          showDot: this.showReSignDayDot(
            date.getFullYear(),
            date.getMonth(),
            dayPos
          ),
          isSelected: this.showSignDayBackGround(
            date.getFullYear(),
            date.getMonth(),
            dayPos
          )
        };
        dayPos++;
        cellDatas.push(cell);
      }
      if (i === rowCount - 1 && lastRowDays !== 0) {
        cellDatas = cellDatas.concat(datasOfNextMonth);
      }
      row.columns = cellDatas;
      currentMonthDatas.push(row);
    }
    this.setState({
      currentMonthDatas: currentMonthDatas
    });
  };

  onLoadNewMonthData = (type: MonthType) => {
    const { currentDate } = this.state;
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();
    const newDate = currentDate;
    switch (type) {
      case MonthType.PRE_MONTH:
        if (month === 0) {
          year--;
          month = 11;
        } else {
          month--;
        }
        break;
      case MonthType.NEXT_MONTH:
        if (month === 11) {
          year++;
          month = 0;
        } else {
          month++;
        }
        break;
      default:
        break;
    }
    newDate.setFullYear(year);
    newDate.setMonth(month);
    this.generateMonthDatas(newDate);
    this.setState({
      currentDate: newDate
    });
  };

  render() {
    const { currentMonthDatas, currentDate, reSignDates } = this.state;
    const {
      optionalDateRange,
      dotBgColor,
      selectedBgColor,
      dotContent,
      showToday
    } = this.props;
    const showEnableDataRange = typeof optionalDateRange !== "undefined";
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img
            className={styles.arrow}
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAYAAAGpAGuzAAAAAXNSR0IArs4c6QAABApJREFUSA21l0tIVFEYx+eOr1R66KJFQRA9wKCgxyLoAbaoJAg3iQuJxBfRrqCgtrXpuQlCRxsUKbCgB2lFlBVFq5IiWjQFtTEJolGyKXOcft/1nuO5954Zp6ILcr7z//7/7zvf+c65c41EbE97e3vGxTFGxYh6rHneOD1omkxjsdhGF9aoNqbZkQjAe2VrquNDmMD6yLBE4xLHFivT0dHRo1lBw1P9CuJ6DuGungQN26oyBQUFNT6i5Ojp6VmoQYBlAmpADIBjIRBcNrVVCNaH4s7YVC6ZzV5jOn3LzWQyUdTpioqKkmyhV/oUVhYgKR4wVIs/p4B0KdLOESK7tLq5ufl1SMBOladSqW9Ckqe4uLi0sbHxx/TMyEC0GqINiMNxnHRra2uhIpmjw/rWATz3wLG2trb5JiFo6yWR4T4ZtnmEJwi3BMky1wLlRFiP8LI3H0W4QPlkDAmUs7OzszKdTn9Rc4QuN6tAEWWkTjnH1k0weT6bjGsFmDVDb2/vvPHxcfeis91rcwo4eVVTU1NvvFTfqaNcvR186WXCumsVmcjDQhbcKiDycXzXhMAzRNcXT5uWGujDAH1wryORb0CuVWQZfTWwjHdgyzzCKZZx2LP1oAVE/kZkd51EbiLyRc0yDFdAZH3Xo9FodUtLy0OD4zPltGoyZ38lZz/hYwQmBIyuUtjExMTbwcHBnEfAXZLZTRGTqYJMSRXIHHXRFOxQ+JThXM4u+d/WOHXj2JkMBAZnwhO9o4GhS6QFKjLbWYJoWOYcjceI9iqfjCGBgHIUED0VG1E3O3lCbHmsAnEg2sxwQWyeo9R3VQxdtExsD8R9bEhcfLRgq40TwqhjPcIb4pg1Q0idBejr6ytOJpPdrKbeDew4Zynr0D8n6OrqWsTb6DaB1wRy/2S+9K8T8NLZRIduErgyEPhrYWHhrqampmduJQHnrFNavh/Sef6CHU9wxLdzxD+YQfKqQC5UIpGIsdp9plhsztujsrKy3Q0NDWNBn+u3gQqTjwJ+6vqZb1CYMcb5aW6pq6tLG1jItFZA4zZMTk5K4JmvjhnpEe7kyZlpbsuXwDv0MSTBd4yciHoCX88dLux1E9A4adqBsDvyGayGwC8svrygKNsxl0bVZWFf4rIMZfHlBestynFhJFA/Dd1DQ1N5RTVIOoHCglde4TJS6auioqIdnPURE89lhxKYZJp+kPlpzn+QN8Jt3cltfWnybXZQaOPIh0A1DjlB/n8hIpGU9I8+3bIKAfNKoMQkWkLAO1RUpTAZwYAyhzht50zc9QWBfObxeHwOv8nyIej78PC0HVS0n6TuL+ofVWBLTlXHwOXzyPeQ4B6fHDv+OYGKyoGQT6orbJX7AYT9qbS0dIXy/7fxN6A0oMs0pJDBAAAAAElFTkSuQmCC"
            }
            onClick={() => this.onLoadNewMonthData(MonthType.PRE_MONTH)}
          />
          <span className={styles.title}>
            {moment(currentDate).format("YYYY年MM月")}
          </span>
          <img
            className={styles.arrow}
            src={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAnCAYAAAFiXLgWAAAAAXNSR0IArs4c6QAAA4hJREFUSA29lj9MU1EUxnltgDQ0sSUuLpoIIUZNjImDTMKi0U0SutQwECpsOsmoM5OjtPxZJJriZqKRaNiUxIQBlIWExAUGhzcYGEpp/Z3nO89733ttAVNv0t57zvm+e84999x7X0dHuM3OztYtnSgSlkaECCxAlEqlm4HgQz94imKxuO0NIB+GIfWlpaWspTQFccfviegc0yBj5l2t1+tDgR6FawWI4oqlUOjc3NxVHZt94ujoaDOWISgMB82Mu82M62qMrEMMjuNsmIF4iSb8YkQJejSiXFhYuBhRlsvlLkuJ4EhKSNo3MWSz2e5cLlcJg0w5iBZiFWJSjJ2dnX3j4+M7JlDHAUEVEF2IGV/OTU5OLqtN+ghBjRC3IfZ7IMcpPaQ1JRjEVYhDPnEjWsaKpCef6wpGXMHJtdiQAO4COOdzp1nHjD+21wDwAENKjIlEYrBQKKwpUHvPAwus4dobp9Pp3nw+7yogtm9UtrFgUc7Pz99oaAwZEsRdr1arX+nLIVusmKBoH/uWUUifY1GGUhedZ9Evff0OaewzMNYw2AcydRfSO9/qQuq1kL4QEERm8YOsxwuLUCvsbHeYZBHEyEm6fHh4+F2BeLIwkVriHGwBvqAEySItwFlsBUkP8CzdT9WlUqn02NjYfkOCADnTadd1fymJvitwZSgbDgcGBv7GFkZJSObsEtLw8HA1NiTA55ngh05CepOkuSZyJCRJqwmWtCo4QpCnRPdANi68BxZBSqNWq30RJc2N22UxeCEBluLTOpLii60jjwD4EWCvUgljDXDDSvUIgJ/LgLZMGIN/hi3+T3JEvX0gO09Z8DOZl7BKXC9TZipb+GtqdtjUS0y2xVLCm75CNYxIgTadoYUxmJTkFnDyAny4WDbR3SHZey3mijUHDtRKukZw9Ipfl+r8fi+ZTN6emJjwHsOQraEYcaBIHA2xL2+R06qTnnTu43yEFa2Y+kbjhg6UwCtwne8UmUwuELPVcDZF6ZVMZXjc0oEScNSPo0/IctKthqMZHE1bSl84tgMlU3XyrH7kJ7dEuC3zofLA/FA5sQOdcXFxMcPN8p79sD9WAbCitZ6ennvyCp/agToidb2kTr6QzqhOe6ru1qkdyAoqlYrcYJH75Z9W0GwPmPhNJpPJn2oP2lZFbTsHbTvJXHr32bjXcXcRern05PI7dguqqG236X95D9r5ov0Gg77GWz71emgAAAAASUVORK5CYII="
            }
            onClick={() => this.onLoadNewMonthData(MonthType.NEXT_MONTH)}
          />
          <img
            className={styles.leftcircle}
            src="data:image/png;base64,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"
          />
          <img
            className={styles.rightcircle}
            src="data:image/png;base64,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"
          />
        </div>
        <div className={styles.mid}>
          {weeks.map((item, index) => {
            return (
              <div className={styles.weekItem} key={index}>
                {item}
              </div>
            );
          })}
        </div>
        <div className={styles.mainBody}>
          {currentMonthDatas.map((row, pos) => {
            return (
              <div className={styles.row} key={pos}>
                {row.columns.map((cell, index) => {
                  return (
                    <div
                      className={styles.dateItem}
                      key={index}
                      onClick={() => this.onSelectDay(cell)}
                    >
                      <div className={styles.dateContent}>
                        <span
                          className={`${styles.date} ${
                            cell.showDot || cell.isSelected
                              ? styles.selected
                              : ""
                          } ${
                            showEnableDataRange
                              ? !this.checkDateBetweenInRange(
                                  cell.year,
                                  cell.month,
                                  cell.day
                                )
                                ? styles.grey
                                : ""
                              : cell.month !== currentDate.getMonth()
                              ? styles.grey
                              : ""
                          }  ${
                            typeof showToday !== "undefined"
                              ? this.isToday(cell)
                                ? styles.today
                                : ""
                              : ""
                          } }`}
                          style={{
                            backgroundColor:
                              cell.isSelected || cell.showDot
                                ? selectedBgColor
                                  ? selectedBgColor
                                  : ""
                                : ""
                          }}
                        >
                          {cell.day}
                        </span>
                        {reSignDates && cell.showDot && (
                          <span
                            style={{
                              backgroundColor: `${
                                dotBgColor ? `${dotBgColor}` : ""
                              }`
                            }}
                            className={`${styles.dot}`}
                          >
                            {dotContent ? dotContent.substring(0, 1) : "补"}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
