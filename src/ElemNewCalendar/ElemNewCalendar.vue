<template>
    <w-elem :placeholder="$placeholder" class="new-calendar-widget">
        <div class="new-calendar-widget__container">
            <!-- Presets Section -->
            <div v-if="props.presetsEnabled" class="new-calendar-widget__presets">
                <!-- Buttons -->
                <div
                    v-if="props.presetsMode === 'buttons' || props.presetsMode === 'both'"
                    class="new-calendar-widget__presets-buttons">
                    <button
                        v-for="preset in presetsOptions"
                        :key="preset.value"
                        class="new-calendar-widget__preset-button"
                        :class="{ active: activePreset === preset.value }"
                        :style="presetButtonStyle"
                        @click="handlePresetClick(preset.value)"
                        tabindex="0">
                        {{ preset.label }}
                    </button>
                </div>

                <!-- Dropdown -->
                <div
                    v-if="props.presetsMode === 'dropdown' || props.presetsMode === 'both'"
                    class="new-calendar-widget__presets-dropdown">
                    <select
                        v-model="selectedPreset"
                        :style="presetSelectStyle"
                        @change="handlePresetChange">
                        <option :value="null">Выберите период</option>
                        <option
                            v-for="preset in presetsOptions"
                            :key="preset.value"
                            :value="preset.value">
                            {{ preset.label }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Drill-down Controls -->
            <div v-if="props.drilldownEnabled" class="new-calendar-widget__drilldown">
                <button
                    v-for="level in drilldownOptions"
                    :key="level.value"
                    class="new-calendar-widget__drilldown-button"
                    :class="{ active: props.drilldownLevel === level.value }"
                    :style="drilldownButtonStyle"
                    @click="handleDrilldownLevelChange(level.value)"
                    tabindex="0">
                    {{ level.label }}
                </button>
            </div>

            <!-- Separate Input Mode -->
            <div v-if="props.selectionMode === 'separate'" class="new-calendar-widget__separate-input">
                <div class="new-calendar-widget__date-inputs">
                    <div class="new-calendar-widget__input-group">
                        <label>От:</label>
                        <input
                            v-model="fromDateInput"
                            type="text"
                            :placeholder="props.dateFormat"
                            :style="dateInputStyle"
                            @blur="handleFromDateInput"
                            @keydown.enter="handleFromDateInput"
                            tabindex="0" />
                    </div>
                    <div class="new-calendar-widget__input-group">
                        <label>До:</label>
                        <input
                            v-model="toDateInput"
                            type="text"
                            :placeholder="props.dateFormat"
                            :style="dateInputStyle"
                            @blur="handleToDateInput"
                            @keydown.enter="handleToDateInput"
                            tabindex="0" />
                    </div>
                </div>

                <div class="new-calendar-widget__calendars-row">
                    <!-- From Calendar -->
                    <div class="new-calendar-widget__calendar-wrapper">
                        <div class="new-calendar-widget__calendar-label">От</div>
                        <div ref="fromChartContainer" class="new-calendar-widget__chart-container"></div>
                    </div>

                    <!-- To Calendar -->
                    <div class="new-calendar-widget__calendar-wrapper">
                        <div class="new-calendar-widget__calendar-label">До</div>
                        <div ref="toChartContainer" class="new-calendar-widget__chart-container"></div>
                    </div>
                </div>
            </div>

            <!-- Single Calendar Mode -->
            <div v-else class="new-calendar-widget__single-calendar">
                <div ref="chartContainer" class="new-calendar-widget__chart-container" style="width: 100%; height: 500px; min-height: 400px;"></div>
            </div>
        </div>
    </w-elem>
</template>

<script>
import { Elem } from '@goodt-wcore/elem';
import echarts from 'echarts';
import dayJs from 'dayjs';
import { meta, Vars, Events } from './descriptor';
import {
    calculatePresetRange,
    formatDateRange,
    parseDateRange,
    getDaysInRange,
    normalizeDate,
    formatDateForDisplay,
    getDrilldownRange
} from './utils';
import {
    PRESETS_OPTIONS,
    DRILLDOWN_OPTIONS,
    DRILLDOWN_LEVELS,
    PRESETS_MODES,
    SELECTION_MODES
} from './constants';
import { ElemInstanceTypeDescriptor } from './types';

export default {
    extends: Elem,
    meta,
    data() {
        return {
            chartInstance: null,
            fromChartInstance: null,
            toChartInstance: null,
            selectedFromDate: '',
            selectedToDate: '',
            activePreset: null,
            selectedPreset: null,
            fromDateInput: '',
            toDateInput: '',
            isSelectingRange: false,
            selectionStart: null,
            ...ElemInstanceTypeDescriptor
        };
    },
    computed: {
        presetsOptions() {
            return PRESETS_OPTIONS;
        },
        drilldownOptions() {
            return DRILLDOWN_OPTIONS;
        },
        presetButtonStyle() {
            const { presets } = this.props;
            return {
                backgroundColor: presets.buttonBackground,
                color: presets.buttonColor,
                borderRadius: `${presets.buttonBorderRadius.size}${presets.buttonBorderRadius.unit}`,
                padding: `${presets.buttonPadding.size}${presets.buttonPadding.unit}`,
                fontSize: `${presets.buttonFontSize.size}${presets.buttonFontSize.unit}`,
                fontWeight: presets.buttonFontWeight,
                fontFamily: this.props.fontFamily
            };
        },
        presetSelectStyle() {
            const { presets } = this.props;
            return {
                backgroundColor: presets.buttonBackground,
                color: presets.buttonColor,
                borderRadius: `${presets.buttonBorderRadius.size}${presets.buttonBorderRadius.unit}`,
                padding: `${presets.buttonPadding.size}${presets.buttonPadding.unit}`,
                fontSize: `${presets.buttonFontSize.size}${presets.buttonFontSize.unit}`,
                fontWeight: presets.buttonFontWeight,
                fontFamily: this.props.fontFamily
            };
        },
        drilldownButtonStyle() {
            const { drilldownControls } = this.props;
            return {
                backgroundColor: drilldownControls.backgroundColor,
                color: drilldownControls.color,
                borderColor: drilldownControls.borderColor,
                fontSize: `${drilldownControls.fontSize.size}${drilldownControls.fontSize.unit}`,
                borderRadius: `${drilldownControls.borderRadius.size}${drilldownControls.borderRadius.unit}`,
                fontFamily: this.props.fontFamily
            };
        },
        dateInputStyle() {
            const { dateInput } = this.props;
            return {
                backgroundColor: dateInput.backgroundColor,
                color: dateInput.color,
                borderColor: dateInput.borderColor,
                fontSize: `${dateInput.fontSize.size}${dateInput.fontSize.unit}`,
                padding: `${dateInput.padding.size}${dateInput.padding.unit}`,
                borderRadius: `${dateInput.borderRadius.size}${dateInput.borderRadius.unit}`,
                fontFamily: this.props.fontFamily
            };
        },
        calendarData() {
            // Generate calendar data for the current month
            const today = dayJs();
            const monthStart = today.startOf('month');
            const monthEnd = today.endOf('month');

            const data = [];
            let current = monthStart;

            while (current.isBefore(monthEnd, 'day') || current.isSame(monthEnd, 'day')) {
                const dateStr = current.format('YYYY-MM-DD');
                const fromDate = this.selectedFromDate ? dayJs(this.selectedFromDate) : null;
                const toDate = this.selectedToDate ? dayJs(this.selectedToDate) : null;
                
                let isSelected = false;
                if (fromDate) {
                    if (this.props.selectionMode === 'single') {
                        // Single date selection - highlight only the selected day
                        isSelected = current.isSame(fromDate, 'day');
                    } else if (this.props.selectionMode === 'range') {
                        // Range selection - highlight range from to
                        if (toDate) {
                            isSelected =
                                (current.isAfter(fromDate, 'day') || current.isSame(fromDate, 'day')) &&
                                (current.isBefore(toDate, 'day') || current.isSame(toDate, 'day'));
                        } else {
                            // If only from date is set, highlight just that day
                            isSelected = current.isSame(fromDate, 'day');
                        }
                    } else if (this.props.selectionMode === 'separate') {
                        // Separate mode - from calendar shows from date, to calendar shows to date
                        isSelected = current.isSame(fromDate, 'day');
                    }
                }

                // Value: 0 for unselected, 1 for selected
                data.push([dateStr, isSelected ? 1 : 0]);
                current = current.add(1, 'day');
            }

            return data;
        },
        chartOptions() {
            const { calendar = {}, selectedRange = {}, drilldownLevel } = this.props;
            const today = dayJs();
            const monthStart = today.startOf('month').format('YYYY-MM-DD');
            const monthEnd = today.endOf('month').format('YYYY-MM-DD');
            const range = getDrilldownRange(
                drilldownLevel || 'days',
                monthStart,
                monthEnd
            );

            const calendarBgColor = calendar?.backgroundColor || '#ffffff';
            const selectedBgColor = selectedRange?.backgroundColor || 'rgba(3, 169, 244, 0.5)';
            const calendarData = this.calendarData || [];

            // Ensure we have data for calendar
            if (calendarData.length === 0) {
                // Generate default data if empty
                const data = [];
                let current = dayJs(monthStart);
                while (current.isBefore(dayJs(monthEnd), 'day') || current.isSame(dayJs(monthEnd), 'day')) {
                    data.push([current.format('YYYY-MM-DD'), 0]);
                    current = current.add(1, 'day');
                }
                calendarData.push(...data);
            }

            return {
                visualMap: {
                    min: 0,
                    max: 1,
                    calculable: false,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: 10,
                    inRange: {
                        color: [calendarBgColor, selectedBgColor]
                    },
                    show: false
                },
                calendar: {
                    top: 60,
                    left: 30,
                    right: 30,
                    bottom: 60,
                    cellSize: range.cellSize || ['auto', 20],
                    range: [range.start || monthStart, range.end || monthEnd],
                    itemStyle: {
                        borderWidth: calendar?.borderWidth?.size || 1,
                        borderColor: calendar?.borderColor || '#e0e0e0',
                        borderRadius: calendar?.borderRadius?.size || 4
                    },
                    dayLabel: {
                        nameMap: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
                    },
                    monthLabel: {
                        nameMap: [
                            'Январь',
                            'Февраль',
                            'Март',
                            'Апрель',
                            'Май',
                            'Июнь',
                            'Июль',
                            'Август',
                            'Сентябрь',
                            'Октябрь',
                            'Ноябрь',
                            'Декабрь'
                        ]
                    },
                    yearLabel: {
                        show: false
                    }
                },
                series: [
                    {
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data: calendarData,
                        itemStyle: {
                            borderColor: selectedRange?.borderColor || 'rgba(3, 169, 244, 0.8)',
                            borderWidth: selectedRange?.borderWidth?.size || 2
                        }
                    }
                ]
            };
        }
    },
    watch: {
        'props.selectionMode'() {
            this.isSelectingRange = false;
            this.selectionStart = null;
            this.$nextTick(() => {
                this.initializeCalendar();
            });
        },
        'props.selectedFromDate'(newVal) {
            if (newVal) {
                this.selectedFromDate = newVal;
                this.fromDateInput = formatDateForDisplay(newVal, this.props.dateFormat);
                this.updateCalendar();
            }
        },
        'props.selectedToDate'(newVal) {
            if (newVal) {
                this.selectedToDate = newVal;
                this.toDateInput = formatDateForDisplay(newVal, this.props.dateFormat);
                this.updateCalendar();
            }
        },
        chartOptions: {
            handler() {
                this.updateCalendar();
            },
            deep: true
        },
        selectedFromDate() {
            this.commitDateRange();
        },
        selectedToDate() {
            this.commitDateRange();
        }
    },
    watchStore: [
        {
            vars: [Vars.DATE_RANGE],
            handler([dateRange]) {
                if (dateRange) {
                    const parsed = parseDateRange(dateRange);
                    if (parsed) {
                        this.selectedFromDate = parsed.from;
                        this.selectedToDate = parsed.to;
                        this.updateCalendar();
                    }
                }
            }
        }
    ],
    mounted() {
        this.initializeCalendar();
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
        this.destroyChart();
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        ...ElemInstanceTypeDescriptor,
        initializeCalendar() {
            // Initialize with current date if no date is selected
            if (!this.selectedFromDate && !this.props.selectedFromDate) {
                const today = dayJs().format('YYYY-MM-DD');
                this.selectedFromDate = today;
                this.selectedToDate = today;
                this.fromDateInput = formatDateForDisplay(today, this.props.dateFormat);
                this.toDateInput = formatDateForDisplay(today, this.props.dateFormat);
                this.commitDateRange();
            } else if (this.props.selectedFromDate) {
                this.selectedFromDate = this.props.selectedFromDate;
                this.selectedToDate = this.props.selectedToDate || this.props.selectedFromDate;
                this.fromDateInput = formatDateForDisplay(this.selectedFromDate, this.props.dateFormat);
                this.toDateInput = formatDateForDisplay(this.selectedToDate, this.props.dateFormat);
            } else if (this.selectedFromDate) {
                this.fromDateInput = formatDateForDisplay(this.selectedFromDate, this.props.dateFormat);
                this.toDateInput = formatDateForDisplay(this.selectedToDate || this.selectedFromDate, this.props.dateFormat);
            }

            this.$nextTick(() => {
                if (this.props.selectionMode === 'separate') {
                    this.initSeparateCalendars();
                } else {
                    this.initSingleCalendar();
                }
            });
        },
        initSingleCalendar() {
            const container = this.$refs.chartContainer;
            if (!container) {
                console.warn('Calendar container not found');
                return;
            }

            // Ensure container has dimensions
            if (container.offsetWidth === 0 || container.offsetHeight === 0) {
                console.warn('Calendar container has no dimensions:', {
                    width: container.offsetWidth,
                    height: container.offsetHeight
                });
            }

            try {
                // Dispose existing instance if any
                if (this.chartInstance) {
                    this.chartInstance.dispose();
                    this.chartInstance = null;
                }

                this.chartInstance = echarts.init(container);
                
                // Get chart options
                const options = this.chartOptions;
                console.log('Initializing calendar with options:', {
                    calendarRange: options?.calendar?.range,
                    dataLength: this.calendarData?.length
                });
                
                // Set initial option
                if (options) {
                    this.chartInstance.setOption(options, true);
                }
                
                this.chartInstance.on('click', this.handleCalendarClick);
                
                // Resize after initialization
                this.$nextTick(() => {
                    if (this.chartInstance) {
                        this.chartInstance.resize();
                        console.log('Calendar resized');
                    }
                });
            } catch (error) {
                console.error('Error initializing calendar:', error);
            }
        },
        initSeparateCalendars() {
            const fromContainer = this.$refs.fromChartContainer;
            const toContainer = this.$refs.toChartContainer;

            if (fromContainer) {
                this.fromChartInstance = echarts.init(fromContainer);
                this.updateFromCalendar();
                this.fromChartInstance.on('click', (params) => this.handleFromCalendarClick(params));
            }

            if (toContainer) {
                this.toChartInstance = echarts.init(toContainer);
                this.updateToCalendar();
                this.toChartInstance.on('click', (params) => this.handleToCalendarClick(params));
            }
        },
        updateCalendar() {
            if (this.chartInstance && this.chartOptions) {
                try {
                    this.chartInstance.setOption(this.chartOptions, true);
                    this.$nextTick(() => {
                        if (this.chartInstance) {
                            this.chartInstance.resize();
                        }
                    });
                } catch (error) {
                    console.error('Error updating calendar:', error);
                }
            }
        },
        updateFromCalendar() {
            if (this.fromChartInstance) {
                // Similar to updateCalendar but for from date
                this.fromChartInstance.setOption(this.chartOptions, true);
            }
        },
        updateToCalendar() {
            if (this.toChartInstance) {
                // Similar to updateCalendar but for to date
                this.toChartInstance.setOption(this.chartOptions, true);
            }
        },
        handleCalendarClick(params) {
            if (!params.data || params.data.length < 2) return;

            const clickedDate = params.data[0];
            const currentDate = dayJs(clickedDate);

            if (this.props.selectionMode === 'single') {
                // Single date selection - one click selects the date
                this.selectedFromDate = currentDate.format('YYYY-MM-DD');
                this.selectedToDate = currentDate.format('YYYY-MM-DD');
                this.commitDateRange();
                this.updateCalendar();
            } else if (this.props.selectionMode === 'range') {
                // Range selection - first click sets start, second click sets end
                if (!this.isSelectingRange) {
                    this.selectionStart = currentDate;
                    this.selectedFromDate = currentDate.format('YYYY-MM-DD');
                    this.selectedToDate = currentDate.format('YYYY-MM-DD');
                    this.isSelectingRange = true;
                } else {
                    if (currentDate.isBefore(this.selectionStart)) {
                        this.selectedFromDate = currentDate.format('YYYY-MM-DD');
                        this.selectedToDate = this.selectionStart.format('YYYY-MM-DD');
                    } else {
                        this.selectedFromDate = this.selectionStart.format('YYYY-MM-DD');
                        this.selectedToDate = currentDate.format('YYYY-MM-DD');
                    }
                    this.isSelectingRange = false;
                    this.commitDateRange();
                }
                this.updateCalendar();
            }
        },
        handleFromCalendarClick(params) {
            if (!params.data || params.data.length < 2) return;
            const clickedDate = params.data[0];
            this.selectedFromDate = dayJs(clickedDate).format('YYYY-MM-DD');
            this.fromDateInput = formatDateForDisplay(this.selectedFromDate, this.props.dateFormat);
            this.commitDateRange();
            this.updateFromCalendar();
        },
        handleToCalendarClick(params) {
            if (!params.data || params.data.length < 2) return;
            const clickedDate = params.data[0];
            this.selectedToDate = dayJs(clickedDate).format('YYYY-MM-DD');
            this.toDateInput = formatDateForDisplay(this.selectedToDate, this.props.dateFormat);
            this.commitDateRange();
            this.updateToCalendar();
        },
        handlePresetClick(preset) {
            this.activePreset = preset;
            const range = calculatePresetRange(preset);
            this.selectedFromDate = range.from;
            this.selectedToDate = range.to;
            this.fromDateInput = formatDateForDisplay(range.from, this.props.dateFormat);
            this.toDateInput = formatDateForDisplay(range.to, this.props.dateFormat);
            this.commitDateRange();
            this.updateCalendar();
        },
        handlePresetChange() {
            if (this.selectedPreset) {
                this.handlePresetClick(this.selectedPreset);
            }
        },
        handleDrilldownLevelChange(level) {
            // Note: This should trigger a prop change through panels
            // For now, we'll update internal state and calendar
            this.updateCalendar();
        },
        handleFromDateInput() {
            const normalized = normalizeDate(this.fromDateInput);
            if (normalized) {
                this.selectedFromDate = normalized;
                this.fromDateInput = formatDateForDisplay(normalized, this.props.dateFormat);
                this.commitDateRange();
                this.updateCalendar();
            }
        },
        handleToDateInput() {
            const normalized = normalizeDate(this.toDateInput);
            if (normalized) {
                this.selectedToDate = normalized;
                this.toDateInput = formatDateForDisplay(normalized, this.props.dateFormat);
                this.commitDateRange();
                this.updateCalendar();
            }
        },
        commitDateRange() {
            if (this.selectedFromDate) {
                const toDate = this.selectedToDate || this.selectedFromDate;
                const rangeString = formatDateRange(this.selectedFromDate, toDate);
                this.$storeCommit({ [Vars.DATE_RANGE]: rangeString });

                if (this.props.actionType.event.enabled) {
                    this.$eventTrigger(Events.DATE_RANGE_SELECTED);
                }
            }
        },
        handleResize() {
            if (this.chartInstance) {
                this.chartInstance.resize();
            }
            if (this.fromChartInstance) {
                this.fromChartInstance.resize();
            }
            if (this.toChartInstance) {
                this.toChartInstance.resize();
            }
        },
        destroyChart() {
            if (this.chartInstance) {
                this.chartInstance.dispose();
                this.chartInstance = null;
            }
            if (this.fromChartInstance) {
                this.fromChartInstance.dispose();
                this.fromChartInstance = null;
            }
            if (this.toChartInstance) {
                this.toChartInstance.dispose();
                this.toChartInstance = null;
            }
        }
    }
};
</script>

<style lang="postcss" src="./style.pcss" module></style>

