<template>
    <w-elem>
        <!--    Year mode    -->
        <div v-if="props.modeYear.modeActive" class="year-calendar">
            <!--     Switch      -->
            <div v-if="props.switch.enabled" class="year-calendar__switch calendar-switch">
                <div class="cursor-pointer" @click="setPrevYear">
                    <i class="calendar-switch__pref-icon" />
                </div>
                <div class="calendar-switch__year">
                    {{ currentYear }}
                </div>
                <div class="cursor-pointer" @click="setNextYear">
                    <i class="calendar-switch__post-icon" />
                </div>
            </div>

            <div v-if="props.modeYear.title.show" class="year-calendar__title">{{ props.modeYear.title.text }}</div>

            <div class="year-calendar__wrapper">
                <!--    Month     -->
                <div
                    v-for="item in 12"
                    :key="item"
                    class="year-calendar__month-wrapper"
                    @click="handleClickByMonth(item - 1)">
                    <div class="d-flex">
                        <div
                            class="year-calendar__month"
                            v-if="props.modeYear.header.show"
                            :class="{ skeleton: isLoading }">
                            {{ isLoading ? '' : getMonthNameForYearMode(item - 1) }}
                        </div>
                        <!--     Metrics      -->
                        <div class="calendar-metrics" v-if="!isLoading">
                            <div
                                class="calendar-metrics__wrapper"
                                v-for="(metric, idx) in resolveMetricValueByMonth(item - 1)"
                                :key="idx"
                                :style="metric.cssVars">
                                <span class="calendar-metrics__prefix">{{ metric.prefix.text }}</span>
                                <span class="calendar-metrics__metric">{{ metric.value }}</span>
                                <span class="calendar-metrics__postfix">{{ metric.postfix.text }}</span>
                            </div>
                        </div>
                    </div>
                    <!--    Cells     -->
                    <div class="calendar">
                        <div class="calendar__date-wrapper">
                            <div
                                v-for="date in currentMonthDates(currentYear, item - 1)"
                                :key="new Date(date).getTime()">
                                <div v-if="isLoading" class="calendar__date skeleton skeleton-small" />
                                <div
                                    v-else
                                    class="calendar__date"
                                    :style="buildColorCssVarsStyle(currentYear, item - 1, date)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--    Month mode    -->
        <div v-if="props.modeMonth.modeActive" class="month-calendar">
            <!--     Switch      -->
            <div v-if="props.switch.enabled" class="month-calendar__switch calendar-switch">
                <div class="cursor-pointer" @click="setPrevMonth(currentMonth)">
                    <i class="calendar-switch__pref-icon" />
                </div>
                <div class="calendar-switch__year">
                    <span>
                        {{ currentDate }}
                    </span>
                </div>
                <div class="cursor-pointer" @click="setNextMonth(currentMonth)">
                    <i class="calendar-switch__post-icon" />
                </div>
            </div>

            <!--    Cells     -->
            <div class="month-calendar__dates-wrapper">
                <div v-for="date in currentMonthDates(currentYear, currentMonth)" :key="new Date(date).getTime()">
                    <div v-if="isLoading" class="month-calendar__date-block skeleton skeleton-small" />
                    <div v-else-if="showDay(date)" class="month-calendar__date-block" />
                    <div
                        v-else
                        class="month-calendar__date-block"
                        :class="{ active: isActiveDay(date) }"
                        :style="buildColorCssVarsStyle(currentYear, currentMonth, date)"
                        @click="handleClickByDay(currentMonth, date)">
                        <div class="month-calendar__date-wrapper">
                            <!--      Date      -->
                            <div v-if="props.modeMonth.date.show" class="month-calendar__date">
                                {{ formatDateForMonthMode(date) }}
                            </div>
                            <ui-tooltip
                                v-if="props.modeMonth.tooltip.enabled"
                                class="cursor-pointer"
                                :position="position">
                                <template #target="{ events, binds }">
                                    <div class="month-calendar__tooltip" v-on="events" v-bind="binds">!</div>
                                </template>
                                <div>Tooltip here</div>
                            </ui-tooltip>
                        </div>
                        <!--     Metric      -->
                        <div class="calendar-metrics">
                            <div
                                class="calendar-metrics__wrapper"
                                v-for="(metric, idx) in resolveMetricValueByDate(currentYear, currentMonth, date)"
                                :key="idx"
                                :style="metric.cssVars">
                                <span class="calendar-metrics__prefix">{{ metric.prefix.text }}</span>
                                <span class="calendar-metrics__metric">{{ metric.value }}</span>
                                <span class="calendar-metrics__postfix">{{ metric.postfix.text }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </w-elem>
</template>

<script>
import { Elem } from '@goodt-wcore/core';
import { useDremio } from '@goodt-common/dremio';
import { uniqBy } from 'lodash';
import dayJs from 'dayjs';
import { Tooltip as UiTooltip } from 'goodteditor-ui';
import { meta, Events, Vars } from './descriptor';
import { generateColor, currentMonthDates, getMonthNameForYearMode } from './utils';
import {
    COLOURS_LENGTH,
    DEFAULT_COLOR_BY_MONTH,
    MAX_MONTH_NUMBER,
    MIN_MONTH_NUMBER,
    MonthNumbers,
    YearModeMonthNames
} from './constants';
import { formatDate, formatDateForCommitToStore, formatDateForMonthMode } from './config';
import { dateCssVarsStyle } from './css-vars';

/**
 * @typedef {import('./types/ElemHeatCalendar').TInstance} TInstance
 * @type {TInstance}
 */
const ComponentInstanceTypeDescriptor = undefined;

export default {
    meta,
    extends: Elem,
    implicitCssModule: true,
    static: {
        formatDateForMonthMode,
        generateColor,
        currentMonthDates,
        getMonthNameForYearMode,
        formatDateForCommitToStore,
        YearModeMonthNames,
        COLOURS_LENGTH,
        DEFAULT_COLOR_BY_MONTH,
        MAX_MONTH_NUMBER,
        MIN_MONTH_NUMBER,
        MonthNumbers
    },
    components: { UiTooltip },
    mixins: [useDremio().mixin],
    data: (vm) => ({
        position: 'top',
        /** @public */
        isStateChanged: true,
        currentMonth: dayJs().month(),
        currentYear: dayJs().year(),
        activeDate: null,
        DATE_DIMENSION_KEY: null,
        /* Vetur HACK */
        ...ComponentInstanceTypeDescriptor
    }),
    computed: {
        dremioData() {
            if (this.loading === false && this.result && this.DATE_DIMENSION_KEY) {
                const years = uniqBy(this.result.rows, (itemData) =>
                    dayJs(itemData[this.DATE_DIMENSION_KEY]).year()
                ).map((itemData) => Number(dayJs(itemData[this.DATE_DIMENSION_KEY]).year()));
                return years.map((year) => {
                    const months = this.result.rows.filter(
                        (itemData) => dayJs(itemData[this.DATE_DIMENSION_KEY]).year() === year
                    );
                    return {
                        year,
                        dates: this.MonthNumbers.map((month) =>
                            months.filter((monthItem) => dayJs(monthItem[this.DATE_DIMENSION_KEY]).month() === month)
                        )
                    };
                });
            }

            return [];
        },
        monthMetricValues() {
            const { metricForColor } = this.props;
            if (metricForColor == null || this.currentDates == null) {
                return [];
            }

            return this.currentDates.dates.map((monthData) => {
                const metricValues = monthData.map((item) => Number(item[metricForColor]));
                const minValue = Math.min(...metricValues);
                const maxValue = Math.max(...metricValues);
                return {
                    minValue,
                    maxValue,
                    step: (maxValue - minValue) / (this.COLOURS_LENGTH - 1),
                    totalValue: metricValues.reduce((acc, cur) => acc + cur, 0)
                };
            });
        },
        currentDates() {
            const {
                modeYear: { modeActive: modeYearActive },
                modeMonth: { modeActive: modeMonthActive }
            } = this.props;

            const currentDates = this.dremioData.find(
                ({ year }) => (modeYearActive || modeMonthActive) && year === this.currentYear
            );
            if (currentDates === undefined) {
                return { year: this.currentYear, dates: [] };
            }

            return currentDates;
        },
        defaultColor() {
            const {
                modeYear: { modeActive: yearModeActive },
                modeMonth: {
                    blocks: { background: dateBlocksBackground }
                }
            } = this.props;
            if (yearModeActive === true) {
                return this.DEFAULT_COLOR_BY_MONTH;
            }

            return dateBlocksBackground;
        },
        currentDate() {
            return `${this.getMonthNameForYearMode([this.currentMonth])} ${this.currentYear}`;
        },
        isLoading() {
            return this.loading || this.isStateChanged;
        },
        gradient() {
            return this.generateColor(this.props.gradientMinColor, this.props.gradientMaxColor, this.COLOURS_LENGTH);
        }
    },
    watchStore: [
        {
            all: true,
            vars: [Vars.SELECT_DATE],
            handler([date]) {
                const newDate = formatDate(date);
                this.activeDate = newDate;
                this.currentMonth = dayJs(date).month();
                this.currentYear = dayJs(date).year();
                if (this.currentDates !== null) {
                    this.handleClickByDay(this.currentMonth, date);
                }
            }
        },
        {
            vars: [Vars.SELECT_MONTH],
            handler([date]) {
                this.currentMonth = dayJs(date).month();
                this.currentYear = dayJs(date).year();
            }
        }
    ],
    watchEditor: {
        'props.dimension': {
            immediate: true,
            handler(dimension) {
                this.DATE_DIMENSION_KEY = dimension;
            }
        }
    },
    created() {
        this.DATE_DIMENSION_KEY = this.props.dimension;

        this.$watch(
            'dremioData',
            () => {
                this.isStateChanged = false;
            },
            { immediate: true }
        );
        this.$watch('currentYear', () => {
            this.isStateChanged = false;
        });
        this.$watch('currentMonth', () => {
            this.isStateChanged = false;
        });
    },
    methods: {
        /**
         * @param {string} date
         * @description get active day for outline properties
         * @return {boolean}
         * */
        isActiveDay(date) {
            const tmpMonth = dayJs(date).month();
            return this.activeDate === formatDate(date) && tmpMonth === this.currentMonth;
        },
        /**
         * @param {string} date
         * @description return day in the current month
         * @return {boolean}
         * */
        showDay(date) {
            const { currentMonth } = this.props.modeMonth;
            return currentMonth && dayJs(date).month() !== this.currentMonth;
        },
        /**
         * @param {number} month
         * @description handle click by month - send event, route, trigger metric
         * */
        handleClickByMonth(month) {
            const { link, event } = this.props.actionType;
            if (link.enabled) {
                this.$routeNavigate({ path: link.url });
            }

            if (event.enabled) {
                this.$eventTrigger(Events.TRIGGER_BY_CLICK);
            }

            const varAliasesKeys = Object.keys(this.props.varAliases);
            varAliasesKeys.forEach((key) => {
                const currentVar = this.props.varAliases[key];
                if (Object.prototype.hasOwnProperty.call(currentVar, 'trigger')) {
                    const metrics = this.resolveMetricValueByMonth(month);
                    metrics.forEach(({ name, value }) => {
                        if (key === name) {
                            this.$storeCommit({ [key]: value });
                        }
                    });
                }
            });

            this.$storeCommit({
                [Vars.TRIGGER_YEAR]: this.currentYear,
                [Vars.TRIGGER_MONTH_METRIC]: this.YearModeMonthNames[month],
                [Vars.SELECT_MONTH]: dayJs(`${this.currentYear}-${month + 1}`)
            });
        },
        /**
         * @param {number} month
         * @param {string} date
         * @description handle click by day - send event, route, trigger metric
         * */
        handleClickByDay(month, date) {
            const currentMonth = dayJs(date).month();
            if (currentMonth !== month) {
                return;
            }

            this.commitDateMetricsToStore(month, date);
            this.activeDate = formatDate(date);
            this.callRouteNavigate(month);

            const { event } = this.props.actionType;
            if (event.enabled === false) {
                return;
            }

            this.$eventTrigger(Events.TRIGGER_BY_CLICK);
        },

        commitDateMetricsToStore(month, date) {
            const varAliasesKeys = Object.keys(this.props.varAliases);
            varAliasesKeys.forEach((key) => {
                const currentVar = this.props.varAliases[key];
                if (Object.prototype.hasOwnProperty.call(currentVar, 'trigger')) {
                    const metrics = this.resolveMetricValueByDate(this.currentYear, month, date);
                    metrics.forEach(({ name, value }) => {
                        if (key === name) {
                            this.$storeCommit({ [key]: value });
                        }
                    });
                }
            });
            this.$storeCommit({
                [Vars.SELECT_DATE]: dayJs(date).format('YYYY-MM-DD'),
                [Vars.TRIGGER_YEAR]: this.currentYear,
                [Vars.TRIGGER_MONTH_METRIC]: this.YearModeMonthNames[month],
                [Vars.TRIGGER_DAY]: this.formatDateForCommitToStore(date).toLowerCase()
            });
        },

        callRouteNavigate(month) {
            const {
                link: { enabled, fromMetric, metric, url }
            } = this.props.actionType;
            if (enabled === false) {
                return;
            }

            if (fromMetric === false) {
                this.$routeNavigate({ path: url });
                return;
            }

            const currentDates = this.currentDates.dates[month];
            if (currentDates === undefined || currentDates.length === 0) {
                return;
            }

            const selectedDate = currentDates.find(
                (dimItem) => formatDate(dimItem[this.DATE_DIMENSION_KEY]) === this.activeDate
            );
            if (selectedDate == null) {
                return;
            }

            const path = selectedDate[metric];
            this.$routeNavigate({ path });
        },
        setPrevYear() {
            this.isStateChanged = true;
            this.currentYear--;
        },
        setNextYear() {
            this.isStateChanged = true;
            this.currentYear++;
        },
        /**
         * @param {number} month
         * @description set prev month
         * */
        setPrevMonth(month) {
            this.isStateChanged = true;
            if (month === this.MIN_MONTH_NUMBER) {
                this.currentMonth = this.MAX_MONTH_NUMBER;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
        },
        /**
         * @param {number} month
         * @description set next month
         * */
        setNextMonth(month) {
            this.isStateChanged = true;
            if (month === this.MAX_MONTH_NUMBER) {
                this.currentMonth = this.MIN_MONTH_NUMBER;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
        },
        /**
         * @param {number} year
         * @param {number} month
         * @param {string} date
         * @description calc background-color by metric
         * @return {object} style background
         * */
        buildColorCssVarsStyle(year, month, date) {
            const { dates } = this.currentDates;
            const { defaultColor } = this;

            const defaultCssVar = this.$genCssVarsStyle({
                'day_background-color': defaultColor
            });

            if (dates.length === 0) {
                return defaultCssVar;
            }

            const currentDate = formatDate(date);
            const tmpData = dates[month].find(
                (dimItem) => currentDate === formatDate(dimItem[this.DATE_DIMENSION_KEY])
            );

            if (tmpData == null) {
                return defaultCssVar;
            }

            const { gradientActive, metricForColor } = this.props;
            const metricValue = Number(tmpData[metricForColor]);
            if (gradientActive === false) {
                return this.$genCssVarsStyle({
                    'day_background-color': this.resolveGradientColorByMetric(metricValue)
                });
            }

            const monthMetric = this.monthMetricValues[month];
            if (monthMetric != null) {
                if (metricValue === monthMetric.maxValue) {
                    return this.$genCssVarsStyle({
                        'day_background-color': this.props.gradientMaxColor
                    });
                }

                if (metricValue === monthMetric.minValue) {
                    return this.$genCssVarsStyle({
                        'day_background-color': this.props.gradientMinColor
                    });
                }

                return this.$genCssVarsStyle({
                    'day_background-color':
                        this.gradient[Math.ceil((metricValue - monthMetric.minValue) / monthMetric.step)]
                });
            }

            return defaultCssVar;
        },
        /**
         * @param {number} metricValue
         * @description get color by metric
         * @return {string}
         * */
        resolveGradientColorByMetric(metricValue) {
            const { rules } = this.props;
            const foundRule = rules.find((rule) => Number(rule.from) < metricValue && Number(rule.to) >= metricValue);
            return foundRule ? foundRule.background : this.defaultColor;
        },

        /**
         * @param {number} year
         * @param {number} month
         * @param {string} date
         * @description mapping metrics and cssVars
         * @return {array} metrics array with custom cssVars
         * */
        resolveMetricValueByDate(year, month, date) {
            const formattedDate = formatDate(date);
            const { metrics } = this.props.modeMonth;
            const { dates } = this.currentDates;
            if (dates.length === 0) {
                return [];
            }

            const currentDate = dates[month].find(
                ({ [this.DATE_DIMENSION_KEY]: curDate }) => formatDate(curDate) === formattedDate
            );

            if (currentDate === undefined) {
                return [];
            }

            return metrics
                .map((metricItem) => ({
                    ...metricItem,
                    name: metricItem.metric,
                    value: Number(currentDate[metricItem.metric]),
                    cssVars: this.generateCssVarsForMetric(metricItem)
                }))
                .filter(({ value }) => value !== 0 && Number(value));
        },
        /**
         * @param {number} month
         * @description get calc value for month by metrics array and cssVars for style
         * @return {array}
         * */
        resolveMetricValueByMonth(month) {
            const { metrics } = this.props.modeYear;
            if (this.currentDates == null) {
                return [];
            }

            const currentDates = this.currentDates.dates[month];
            if (currentDates === undefined) {
                return [];
            }

            return metrics
                .map((metricItem) => {
                    let value;
                    // can be undefined because new field in the descriptor
                    if (metricItem.dontSum == null || metricItem.dontSum === false) {
                        value = currentDates.reduce((acc, cur) => acc + Number(cur[metricItem.metric]), 0);
                    } else if (currentDates.length > 0) {
                        value = currentDates[0][metricItem.metric];
                    }

                    return {
                        ...metricItem,
                        name: metricItem.metric,
                        value,
                        cssVars: this.generateCssVarsForMetric(metricItem)
                    };
                })
                .filter(({ value }) => value !== 0 && Number(value));
        },
        /**
         * @param {object} metric's properties from param panel
         * @description generate css vars for metrics
         * @return {object} */
        generateCssVarsForMetric({ color, fontSize, fontStyle, fontWeight, align, prefix, postfix }) {
            return this.$buildCssVarsStyle(dateCssVarsStyle, {
                color,
                fontSize,
                fontStyle,
                fontWeight,
                align,
                prefix,
                postfix
            });
        },
        /** @public */
        loadDataPage() {
            this.loadData();
        }
    }
};
</script>

<style src="./style.pcss" lang="postcss" module />
