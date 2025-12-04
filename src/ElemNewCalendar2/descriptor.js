import { cssVars } from './css-vars';
import panels from './panels';

export const Vars = Object.freeze({
    DATE_RANGE: 'dateRange',
    SELECTED_DATE: 'selectedDate'
});

export const Events = Object.freeze({
    CHANGE_DATE: 'changeDate'
});

export const descriptor = () => ({
    props: {
        presets: {
            type: Array,
            default: () => [
                { label: 'Сегодня', value: 'today' },
                { label: 'Вчера', value: 'yesterday' },
                { label: 'Последние 7 дней', value: 'last7days' },
                { label: 'Последние 30 дней', value: 'last30days' },
                { label: 'Последний месяц', value: 'lastMonth' },
                { label: 'Полгода', value: 'halfYear' },
                { label: 'Год', value: 'year' }
            ]
        },
        viewMode: {
            type: String,
            default: 'month' // day, week, month, year
        },
        inputMode: {
            type: String,
            default: 'single' // single, range, manual
        },
        colors: {
            type: Object,
            default: () => ({
                selected: '#409EFF',
                today: '#E6A23C',
                range: '#A0CFFF'
            })
        },
        showPresets: {
            type: Boolean,
            default: true
        },
        enableDateRange: {
            type: Boolean,
            default: false
        },
        showWeekDays: {
            type: Boolean,
            default: true
        },
        dateFormat: {
            type: String,
            default: 'DD-MM-YYYY'
        },
        actionType: {
            type: Object,
            default: () => ({
                event: {
                    enabled: true,
                    name: 'changeDate'
                }
            })
        },
        echartsOptions: {
            type: Object,
            default: () => ({})
        }
    },
    vars: Object.values(Vars).reduce((acc, varName) => ({ ...acc, [varName]: { description: varName } }), {}),
    events: {
        [Events.CHANGE_DATE]: {
            trigger: 'changeDate'
        }
    }
});

export const meta = {
    descriptor,
    panels,
    cssVars,
    slotNames: []
};
