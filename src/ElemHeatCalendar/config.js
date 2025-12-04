/* place render data: texts, ui control settings, options lists, css class and styles map here */
import dayJs from 'dayjs';
import { getMonthNameForModeMode } from './utils';

export const formatDate = (date) => dayJs(date).format('DD.MM.YYYY');

/**
 * @param {string} date
 * @description get string for calendar cells
 * @return {string}
 * */
export const formatDateForMonthMode = (date) => {
    const day = dayJs(date).date();
    const month = getMonthNameForModeMode([dayJs(date).month()]);
    return `${day} ${month}`;
};

export const formatDateForCommitToStore = (date) => {
    const day = dayJs(date).format('DD');
    const month = getMonthNameForModeMode([dayJs(date).month()]);
    return `${day} ${month}`;
};
