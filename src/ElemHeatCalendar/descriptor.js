import panels from './panels';
import { cssVars } from './css-vars';

/**
 * @enum {string}
 * @type {Readonly<Record<string, string>>}
 */
export const Vars = Object.freeze({
    SELECT_DATE: 'selectDate',
    SELECT_MONTH: 'selectMonth',
    TRIGGER_MONTH_METRIC: 'trigger month name',
    TRIGGER_YEAR: 'trigger year',
    TRIGGER_DAY: 'trigger day'
});

export const Events = Object.freeze({
    TRIGGER_BY_CLICK: 'trigger by click'
});

/**
 * @description Don't change `descriptor` exported name
 * @return {ElemDescriptor}
 */
export const descriptor = () => ({
    props: {
        dremio: {
            type: Object,
            default: null
        },
        dimension: {
            type: String,
            default: ''
        },
        metricForColor: {
            type: String,
            default: ''
        },
        switch: {
            type: Object,
            default() {
                return {
                    enabled: true,
                    align: 'flex-start',
                    color: '#000',
                    fontSize: '1.5rem',
                    fontWeight: '500',
                    fontStyle: 'normal',
                    marginLeft: '1rem',
                    marginRight: '1rem',
                    prefixIcon: {
                        width: '1.5rem',
                        height: '1.5rem',
                        fontSize: '1rem',
                        color: 'rgba(3,169,244,0.6)',
                        background: '#fff',
                        boxShadow: '0 0.125rem 0.25rem #00000014',
                        borderRadius: '0.25rem'
                    },
                    postfixIcon: {
                        width: '1.5rem',
                        height: '1.5rem',
                        fontSize: '1rem',
                        color: 'rgba(3,169,244,0.6)',
                        background: '#fff',
                        boxShadow: '0 0.125rem 0.25rem #00000014',
                        borderRadius: '0.25rem'
                    }
                };
            }
        },
        rules: {
            type: Array,
            default() {
                return [];
            }
        },
        gradientActive: {
            type: Boolean,
            default: true
        },
        gradientMinColor: {
            type: String,
            default: 'rgba(205, 238, 253, 1)'
        },
        gradientMaxColor: {
            type: String,
            default: 'rgba(53, 186, 246, 1)'
        },
        fontFamily: {
            type: String,
            default: 'Roboto'
        },
        modeYear: {
            type: Object,
            default() {
                return {
                    modeActive: true,
                    header: {
                        show: true,
                        color: '#000000',
                        fontSize: '1rem',
                        fontWeight: '500',
                        align: 'left'
                    },
                    title: {
                        show: true,
                        color: '#000000',
                        fontSize: '1rem',
                        fontWeight: '500',
                        align: 'left',
                        text: 'Месяцы'
                    },
                    metrics: [],
                    blocks: {
                        width: '15.5rem',
                        height: '10rem',
                        background: '#fff',
                        boxShadow: '0 0.125rem 1rem #00000014',
                        borderRadius: '0.25rem',
                        verticalGap: '2rem',
                        horizontalGap: '2.5rem'
                    },
                    cells: {
                        width: '1.5rem',
                        height: '0.5rem',
                        borderRadius: '0.25rem',
                        verticalGap: '0.5rem',
                        horizontalGap: '0.5rem'
                    }
                };
            }
        },
        modeMonth: {
            type: Object,
            default() {
                return {
                    modeActive: false,
                    metrics: [],
                    date: {
                        show: true,
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: '1rem',
                        align: 'left'
                    },
                    blocks: {
                        width: '9rem',
                        height: '4rem',
                        background: '#fff',
                        boxShadow: '0 0.125rem 1rem #00000014',
                        borderRadius: '0.25rem',
                        verticalGap: '1rem',
                        horizontalGap: '1rem'
                    },
                    border: {
                        width: '0.125rem',
                        color: '#000'
                    },
                    tooltip: {
                        enabled: false
                    },
                    currentMonth: false
                };
            }
        },
        actionType: {
            type: Object,
            default() {
                return {
                    link: {
                        enabled: false,
                        fromMetric: false,
                        metric: '',
                        url: '/'
                    },
                    event: {
                        enabled: false,
                        name: ''
                    }
                };
            }
        }
    },
    events: {
        [Events.TRIGGER_BY_CLICK]: {
            trigger: `actionType.event.name`
        }
    },
    vars: Object.values(Vars).reduce((acc, varName) => ({ ...acc, [varName]: { description: varName } }), {})
});

export const meta = {
    descriptor,
    cssVars,
    panels,
    slotNames: ['default']
};
