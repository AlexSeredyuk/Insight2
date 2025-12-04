/* eslint-disable no-magic-numbers */

export const PRESET_TYPES = {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    LAST_7_DAYS: 'last7days',
    LAST_30_DAYS: 'last30days',
    LAST_MONTH: 'lastMonth',
    HALF_YEAR: 'halfYear',
    YEAR: 'year'
};

export const PRESET_LABELS = {
    [PRESET_TYPES.TODAY]: 'Сегодня',
    [PRESET_TYPES.YESTERDAY]: 'Вчера',
    [PRESET_TYPES.LAST_7_DAYS]: 'Последние 7 дней',
    [PRESET_TYPES.LAST_30_DAYS]: 'Последние 30 дней',
    [PRESET_TYPES.LAST_MONTH]: 'Последний месяц',
    [PRESET_TYPES.HALF_YEAR]: 'Полгода',
    [PRESET_TYPES.YEAR]: 'Год'
};

export const PRESETS_OPTIONS = [
    { value: PRESET_TYPES.TODAY, label: PRESET_LABELS[PRESET_TYPES.TODAY] },
    { value: PRESET_TYPES.YESTERDAY, label: PRESET_LABELS[PRESET_TYPES.YESTERDAY] },
    { value: PRESET_TYPES.LAST_7_DAYS, label: PRESET_LABELS[PRESET_TYPES.LAST_7_DAYS] },
    { value: PRESET_TYPES.LAST_30_DAYS, label: PRESET_LABELS[PRESET_TYPES.LAST_30_DAYS] },
    { value: PRESET_TYPES.LAST_MONTH, label: PRESET_LABELS[PRESET_TYPES.LAST_MONTH] },
    { value: PRESET_TYPES.HALF_YEAR, label: PRESET_LABELS[PRESET_TYPES.HALF_YEAR] },
    { value: PRESET_TYPES.YEAR, label: PRESET_LABELS[PRESET_TYPES.YEAR] }
];

export const DRILLDOWN_LEVELS = {
    DAYS: 'days',
    WEEKS: 'weeks',
    MONTHS: 'months',
    YEARS: 'years'
};

export const DRILLDOWN_LABELS = {
    [DRILLDOWN_LEVELS.DAYS]: 'Дни',
    [DRILLDOWN_LEVELS.WEEKS]: 'Недели',
    [DRILLDOWN_LEVELS.MONTHS]: 'Месяцы',
    [DRILLDOWN_LEVELS.YEARS]: 'Годы'
};

export const DRILLDOWN_OPTIONS = [
    { value: DRILLDOWN_LEVELS.DAYS, label: DRILLDOWN_LABELS[DRILLDOWN_LEVELS.DAYS] },
    { value: DRILLDOWN_LEVELS.WEEKS, label: DRILLDOWN_LABELS[DRILLDOWN_LEVELS.WEEKS] },
    { value: DRILLDOWN_LEVELS.MONTHS, label: DRILLDOWN_LABELS[DRILLDOWN_LEVELS.MONTHS] },
    { value: DRILLDOWN_LEVELS.YEARS, label: DRILLDOWN_LABELS[DRILLDOWN_LEVELS.YEARS] }
];

export const PRESETS_MODES = {
    BUTTONS: 'buttons',
    DROPDOWN: 'dropdown',
    BOTH: 'both'
};

export const DATE_FORMATS = {
    'YYYY-MM-DD': 'YYYY-MM-DD',
    'DD.MM.YYYY': 'DD.MM.YYYY',
    'MM/DD/YYYY': 'MM/DD/YYYY',
    'DD/MM/YYYY': 'DD/MM/YYYY'
};

export const SELECTION_MODES = {
    SINGLE: 'single',
    RANGE: 'range',
    SEPARATE: 'separate'
};

export const SELECTION_MODE_LABELS = {
    [SELECTION_MODES.SINGLE]: 'Один день',
    [SELECTION_MODES.RANGE]: 'Диапазон',
    [SELECTION_MODES.SEPARATE]: 'Раздельный ввод'
};

export const SELECTION_MODE_OPTIONS = [
    { value: SELECTION_MODES.SINGLE, label: SELECTION_MODE_LABELS[SELECTION_MODES.SINGLE] },
    { value: SELECTION_MODES.RANGE, label: SELECTION_MODE_LABELS[SELECTION_MODES.RANGE] },
    { value: SELECTION_MODES.SEPARATE, label: SELECTION_MODE_LABELS[SELECTION_MODES.SEPARATE] }
];


