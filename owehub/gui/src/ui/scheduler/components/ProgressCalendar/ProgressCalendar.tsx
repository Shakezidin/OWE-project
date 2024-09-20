import { useState } from "react";
import { DayPicker, DayButtonProps, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import CircularProgress from "../CircularProgress/CircularProgress";
import styles from "./styles/index.module.css";

type DayWithProgress = {
    date: Date,
    progress: number,
    id: number
}
type TEvent = {
    id: number
}
type DayPickerCalendarProps = {
    dayWithProgress?: DayWithProgress[],
    onClick?: ({ date, event }: { date: Date, event: TEvent }) => void
}

interface ExtendedDayButtonProps extends DayButtonProps {
    dayWithProgress: DayWithProgress[] | undefined;
    selected: Date | undefined;
    onDateSelect?: ({ date, event }: { date: Date; event: TEvent }) => void;
}

const getCurrentDayExcludedHoliday = () => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0);
    const currentDay = currentDate.getDay()
    if (currentDay === 0 || currentDay === 6) {
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return currentDate
}

const getNextSevenWeekdays = () => {
    const nextSevenWeekdays = [];
    let currentDate = getCurrentDayExcludedHoliday()
    currentDate.setHours(0, 0, 0, 0);
    while (nextSevenWeekdays.length < 7) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            nextSevenWeekdays.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return nextSevenWeekdays;
};
const getColorByPercent = (percent: number): string => {
    if (percent >= 90) {
        return '#F73419';
    } else if (percent > 70 && percent < 90) {
        return '#F8B128';
    } else {
        return '#53B543';
    }
};

const DayButton = (props: ExtendedDayButtonProps) => {
    const { day, modifiers, selected, dayWithProgress, onSelect, className, ...buttonProps } = props;
    const nextSevenWeekdays = getNextSevenWeekdays();
    const isNext = nextSevenWeekdays.some(date =>
        date.getTime() === new Date(day.date).setHours(0, 0, 0, 0)
    );
    const findDay = dayWithProgress?.find(date =>
        date.date.getDate() === day.date.getDate()
        && date.date.getMonth() === day.date.getMonth()
        && date.date.getFullYear() === day.date.getFullYear()
    );
    const colorProgress = findDay?.progress
    const getColor = colorProgress ? getColorByPercent(colorProgress) : ""
    const isSelected = selected?.getTime() === new Date(day.date).setHours(0, 0, 0, 0)
    return <button {...buttonProps} disabled={!isNext} className={` ${className} ${!isNext ? styles.disable_day_cell : ""}`} onClick={() => props.onDateSelect?.({ date: day.date, event: { id: findDay?.id! } })} style={{ width: "52px" }}  >

        {isNext ?
            <CircularProgress filledColor={getColor} strokeWidth={7} size={50} progress={colorProgress || 0}>
                <button className={`${styles.day_cell} ${isNext ? isSelected ? styles.active_selected_cell : styles.active_day_cell : ''}`}  >
                    {day.date.getDate()}
                </button>
            </CircularProgress>
            : day.date.getDate()
        }
    </button>
}
const DayPickerCalendar = (props: DayPickerCalendarProps) => {
    const [selected, setSelected] = useState<Date>();
    const defaultClassNames = getDefaultClassNames();
    return (
        <DayPicker
            className={`mx-auto ${styles.day_picker}`}
            mode="single"
            modifiersClassNames={{ selected: styles.selected_cell, caption: styles.caption_label }}
            required
            showOutsideDays
            selected={selected}
            classNames={{ caption_label: styles.caption_label, month_caption: `${defaultClassNames.month_caption} items-center`, }}
            components={{
                DayButton: (prop) => <DayButton {...prop} selected={selected} dayWithProgress={props.dayWithProgress} onDateSelect={props.onClick} />
            }}
            onSelect={setSelected}
        />
    )
}

export default DayPickerCalendar