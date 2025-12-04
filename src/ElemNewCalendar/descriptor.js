import panels from './panels';
import { PRESETS_MODES, DRILLDOWN_LEVELS, DATE_FORMATS, SELECTION_MODES } from './constants';

/**
 * @enum {string}
 * @type {Readonly<Record<string, string>>}
 */
export const Vars = Object.freeze({
    DATE_RANGE: 'dateRange'
});

export const Events = Object.freeze({
    DATE_RANGE_SELECTED: 'dateRangeSelected'
});

/**
 * @description Don't change `descriptor` exported name
 * @return {ElemDescriptor}
 */
export const descriptor = () => ({
    props: {
        // Selection mode
        selectionMode: {
            type: String,
            default: SELECTION_MODES.SINGLE,
            label: 'Режим выбора дат'
        },
        // Date format
        dateFormat: {
            type: String,
            default: DATE_FORMATS['DD.MM.YYYY'],
            label: 'Формат отображения дат'
        },
        // Selected dates
        selectedFromDate: {
            type: String,
            default: '',
            label: 'Начальная дата'
        },
        selectedToDate: {
            type: String,
            default: '',
            label: 'Конечная дата'
        },
        // Presets configuration (optional)
        presetsEnabled: {
            type: Boolean,
            default: false,
            label: 'Включить пресеты'
        },
        presetsMode: {
            type: String,
            default: PRESETS_MODES.BOTH,
            label: 'Режим отображения пресетов'
        },
        // Drill-down configuration (optional)
        drilldownEnabled: {
            type: Boolean,
            default: false,
            label: 'Включить drill-down'
        },
        drilldownLevel: {
            type: String,
            default: DRILLDOWN_LEVELS.DAYS,
            label: 'Уровень drill-down'
        },
        // Calendar styling
        calendar: {
            type: Object,
            default() {
                return {
                    cellSize: { size: 20, unit: 'px' },
                    cellGap: { size: 4, unit: 'px' },
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                    borderWidth: { size: 1, unit: 'px' },
                    borderRadius: { size: 4, unit: 'px' }
                };
            }
        },
        // Selected range styling
        selectedRange: {
            type: Object,
            default() {
                return {
                    backgroundColor: 'rgba(3, 169, 244, 0.2)',
                    borderColor: 'rgba(3, 169, 244, 0.8)',
                    borderWidth: { size: 2, unit: 'px' }
                };
            }
        },
        // Presets styling
        presets: {
            type: Object,
            default() {
                return {
                    buttonBackground: '#f5f5f5',
                    buttonHoverBackground: '#e0e0e0',
                    buttonActiveBackground: 'rgba(3, 169, 244, 0.1)',
                    buttonColor: '#000000',
                    buttonBorderRadius: { size: 4, unit: 'px' },
                    buttonPadding: { size: 8, unit: 'px' },
                    buttonFontSize: { size: 14, unit: 'px' },
                    buttonFontWeight: '500'
                };
            }
        },
        // Drill-down controls styling
        drilldownControls: {
            type: Object,
            default() {
                return {
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                    color: '#000000',
                    fontSize: { size: 14, unit: 'px' },
                    borderRadius: { size: 4, unit: 'px' }
                };
            }
        },
        // Date input fields styling
        dateInput: {
            type: Object,
            default() {
                return {
                    backgroundColor: '#ffffff',
                    borderColor: '#e0e0e0',
                    color: '#000000',
                    fontSize: { size: 14, unit: 'px' },
                    padding: { size: 8, unit: 'px' },
                    borderRadius: { size: 4, unit: 'px' }
                };
            }
        },
        // Font settings
        fontFamily: {
            type: String,
            default: 'Roboto',
            label: 'Шрифт'
        },
        // Action configuration
        actionType: {
            type: Object,
            default() {
                return {
                    link: {
                        enabled: false,
                        url: '/'
                    },
                    event: {
                        enabled: false,
                        name: ''
                    }
                };
            }
        },
        // Variable aliases for trigger
        varAliases: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    events: {
        [Events.DATE_RANGE_SELECTED]: {
            trigger: `actionType.event.name`
        }
    },
    vars: Object.values(Vars).reduce((acc, varName) => ({ ...acc, [varName]: { description: varName } }), {})
});

export const meta = {
    descriptor,
    panels,
    isChildAllowed: false
};


