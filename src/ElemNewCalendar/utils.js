/* eslint-disable no-magic-numbers */
import dayJs from 'dayjs';
import { PRESET_TYPES } from './constants';

/**
 * Вычисляет диапазон дат для пресета
 * @param {string} preset - тип пресета
 * @returns {{from: string, to: string}} - объект с датами в формате YYYY-MM-DD
 */
export const calculatePresetRange = (preset) => {
    const today = dayJs();
    let fromDate;
    let toDate = today.format('YYYY-MM-DD');

    switch (preset) {
        case PRESET_TYPES.TODAY:
            fromDate = today.format('YYYY-MM-DD');
            break;
        case PRESET_TYPES.YESTERDAY:
            fromDate = today.subtract(1, 'day').format('YYYY-MM-DD');
            toDate = fromDate;
            break;
        case PRESET_TYPES.LAST_7_DAYS:
            fromDate = today.subtract(7, 'day').format('YYYY-MM-DD');
            break;
        case PRESET_TYPES.LAST_30_DAYS:
            fromDate = today.subtract(30, 'day').format('YYYY-MM-DD');
            break;
        case PRESET_TYPES.LAST_MONTH:
            fromDate = today.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
            toDate = today.subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
            break;
        case PRESET_TYPES.HALF_YEAR:
            fromDate = today.subtract(6, 'month').format('YYYY-MM-DD');
            break;
        case PRESET_TYPES.YEAR:
            fromDate = today.subtract(1, 'year').format('YYYY-MM-DD');
            break;
        default:
            fromDate = today.format('YYYY-MM-DD');
    }

    return { from: fromDate, to: toDate };
};

/**
 * Форматирует диапазон дат в строку
 * @param {string} fromDate - начальная дата
 * @param {string} toDate - конечная дата
 * @returns {string} - строка в формате "YYYY-MM-DD,YYYY-MM-DD"
 */
export const formatDateRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) {
        return '';
    }
    return `${fromDate},${toDate}`;
};

/**
 * Парсит строку диапазона дат
 * @param {string} rangeString - строка в формате "YYYY-MM-DD,YYYY-MM-DD"
 * @returns {{from: string, to: string} | null} - объект с датами или null
 */
export const parseDateRange = (rangeString) => {
    if (!rangeString || typeof rangeString !== 'string') {
        return null;
    }

    const parts = rangeString.split(',');
    if (parts.length !== 2) {
        return null;
    }

    const from = parts[0].trim();
    const to = parts[1].trim();

    // Валидация формата дат
    if (dayJs(from).isValid() && dayJs(to).isValid()) {
        return { from, to };
    }

    return null;
};

/**
 * Получает все дни в диапазоне
 * @param {string} fromDate - начальная дата
 * @param {string} toDate - конечная дата
 * @returns {string[]} - массив дат в формате YYYY-MM-DD
 */
export const getDaysInRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) {
        return [];
    }

    const from = dayJs(fromDate);
    const to = dayJs(toDate);
    const days = [];

    let current = from;
    while (current.isBefore(to, 'day') || current.isSame(to, 'day')) {
        days.push(current.format('YYYY-MM-DD'));
        current = current.add(1, 'day');
    }

    return days;
};

/**
 * Валидирует дату
 * @param {string} dateString - строка с датой
 * @returns {boolean} - валидна ли дата
 */
export const isValidDate = (dateString) => {
    if (!dateString) {
        return false;
    }
    return dayJs(dateString).isValid();
};

/**
 * Форматирует дату для отображения
 * @param {string} dateString - дата в формате YYYY-MM-DD
 * @param {string} format - формат для вывода
 * @returns {string} - отформатированная дата
 */
export const formatDateForDisplay = (dateString, format = 'DD.MM.YYYY') => {
    if (!dateString || !isValidDate(dateString)) {
        return '';
    }
    return dayJs(dateString).format(format);
};

/**
 * Нормализует дату к формату YYYY-MM-DD
 * @param {string} dateString - дата в любом формате
 * @returns {string | null} - дата в формате YYYY-MM-DD или null
 */
export const normalizeDate = (dateString) => {
    if (!dateString) {
        return null;
    }

    const date = dayJs(dateString);
    if (!date.isValid()) {
        return null;
    }

    return date.format('YYYY-MM-DD');
};

/**
 * Получает диапазон для drill-down уровня
 * @param {string} level - уровень drill-down
 * @param {string} fromDate - начальная дата
 * @param {string} toDate - конечная дата
 * @returns {Object} - конфигурация для календаря
 */
export const getDrilldownRange = (level, fromDate, toDate) => {
    const from = dayJs(fromDate);
    const to = dayJs(toDate);

    switch (level) {
        case 'weeks':
            return {
                start: from.startOf('week').format('YYYY-MM-DD'),
                end: to.endOf('week').format('YYYY-MM-DD'),
                cellSize: ['auto', 30]
            };
        case 'months':
            return {
                start: from.startOf('month').format('YYYY-MM-DD'),
                end: to.endOf('month').format('YYYY-MM-DD'),
                cellSize: ['auto', 60]
            };
        case 'years':
            return {
                start: from.startOf('year').format('YYYY-MM-DD'),
                end: to.endOf('year').format('YYYY-MM-DD'),
                cellSize: ['auto', 80]
            };
        default: // days
            return {
                start: from.format('YYYY-MM-DD'),
                end: to.format('YYYY-MM-DD'),
                cellSize: ['auto', 20]
            };
    }
};

