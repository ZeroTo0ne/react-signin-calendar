import React from "react";
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
declare enum MonthType {
    PRE_MONTH = 0,
    NEXT_MONTH = 1
}
export default class Calendar extends React.Component<IProps, IState> {
    constructor(props: IProps);
    componentDidMount(): void;
    static getDerivedStateFromProps(props: any, state: any): {
        signDates: any;
        reSignDates: any;
    };
    loadCurrentMonthDatas: () => void;
    getDaysOfMonth: (date: Date) => number;
    isLeapYear: (date: Date) => boolean;
    getFristDayOfMonth: (date: Date) => number;
    getDaysOfFristRow: (date: Date) => number;
    checkDateBetweenInRange: (year: number, month: number, day: number) => boolean;
    showSignDayBackGround: (year: number, month: number, _day: number) => boolean;
    showReSignDayDot: (year: number, month: number, _day: number) => boolean;
    onSelectDay: (date: DayItem) => void;
    isToday: (cell: DayItem) => boolean;
    generateExtraMonthDatas: (type: MonthType, currentDate: Date, daysInRow: number) => DayItem[];
    generateMonthDatas: (date: Date) => void;
    onLoadNewMonthData: (type: MonthType) => void;
    render(): JSX.Element;
}
export {};
