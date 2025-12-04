/* place utility functions here */
import { isNaN } from 'lodash';
import { MAX_DAY_NUMBER, MonthModeMonthNames, WEEK_LENGTH, YearModeMonthNames } from './constants';

export const rgbaToHex = (rgb) => {
    const tmpRGB = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    return tmpRGB && tmpRGB.length === 4
        ? `#${parseInt(tmpRGB[1], 10).toString(16).slice(-2)}${parseInt(tmpRGB[2], 10)
              .toString(16)
              .slice(-2)}${parseInt(tmpRGB[3], 10).toString(16).slice(-2)}`
        : '';
};

export const getHex = (color) => {
    const source = '0123456789abcdef';
    let i = parseInt(color, 10);
    if (i === 0 || isNaN(color)) {
        return '00';
    }
    i = Math.round(Math.min(Math.max(0, i), 255));
    return source.charAt((i - (i % 16)) / 16) + source.charAt(i % 16);
};
export const convertToHex = (rgb) => getHex(rgb[0]) + getHex(rgb[1]) + getHex(rgb[2]);

export const trim = (source) => (source.charAt(0) === '#' ? source.substring(1, 7) : source);

export const convertToRGB = (hex) => {
    const colors = [];
    colors[0] = parseInt(trim(hex).substring(0, 2), 16);
    colors[1] = parseInt(trim(hex).substring(2, 4), 16);
    colors[2] = parseInt(trim(hex).substring(4, 6), 16);
    return colors;
};

export const generateColor = (colorStart, colorEnd, colorCount) => {
    const start = convertToRGB(rgbaToHex(colorStart));
    const end = convertToRGB(rgbaToHex(colorEnd));
    const len = colorCount;
    let alpha = 0.0;
    const colours = [];
    for (let i = 0; i < len; i++) {
        const colors = [];
        alpha += 1 / len;
        colors[0] = start[0] * alpha + (1 - alpha) * end[0];
        colors[1] = start[1] * alpha + (1 - alpha) * end[1];
        colors[2] = start[2] * alpha + (1 - alpha) * end[2];
        colours.push(`#${convertToHex(colors)}`);
    }
    return colours.reverse();
};

/**
 * @param {number} year
 * @param {number} month
 * @description calc first day in the month
 * @return {number}
 * */
export const firstDayOfMonth = (year, month) => {
    const dayNumber = new Date(year, month, 1).getDay() - 1;
    return dayNumber < 0 ? WEEK_LENGTH + dayNumber : dayNumber;
};

/**
 * @param {number} year
 * @param {number} month
 * @description calc last day in the month
 * @return {number}
 * */
export const lastDayOfMonth = (year, month) => {
    const dayNumber = new Date(year, month + 1, 0).getDay() - 1;
    return dayNumber < 0 ? WEEK_LENGTH + dayNumber : dayNumber;
};

/**
 * @param {number} year
 * @param {number} month
 * @description get day in the month
 * @return {number}
 * */
export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

/**
 * @param {number} year
 * @param {number} month
 * @description get days in the prev month
 * @return {array}
 * */
export const prevMonthDates = (year, month) => {
    const dayNumber = firstDayOfMonth(year, month);
    const pmd = new Date(year, month, 0).getDate();
    return [...new Array(dayNumber)].map((day, i) => new Date(year, month - 1, pmd - i)).reverse();
};

/**
 * @param {number} year
 * @param {number} month
 * @description get days in the next month
 * @return {array}
 * */
export const resolveMonthDates = (year, month) => {
    const dayNumber = MAX_DAY_NUMBER - lastDayOfMonth(year, month);
    return [...new Array(dayNumber)].map((day, i) => new Date(year, month + 1, i + 1));
};

/**
 * @param {number} year
 * @param {number} month
 * @description get days in the month
 * @return {array}
 * */
export const currentMonthDates = (year, month) => {
    const dates = [...new Array(daysInMonth(year, month))].map((day, i) => new Date(year, month, i + 1));
    return [...prevMonthDates(year, month), ...dates, ...resolveMonthDates(year, month)];
};

/**
 * @param {number} month
 * @description return month name
 * @return {string}
 * */
export const getMonthNameForYearMode = (month) => YearModeMonthNames[month];

/**
 * @param {number} month
 * @description return month name
 * @return {string}
 * */
export const getMonthNameForModeMode = (month) => MonthModeMonthNames[month];
