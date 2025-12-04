<template>
    <w-elem class="elem-new-calendar2">
        <div class="elem-new-calendar2__header" :style="{ background: props.colors.selected }">
            <div class="elem-new-calendar2__header-left">
                <div class="elem-new-calendar2__nav-btn" @click="toggleViewMode">
                    <i class="mdi mdi-chevron-left"></i>
                    <span class="elem-new-calendar2__year-btn">{{ currentYear }}</span>
                </div>
            </div>
            
            <div class="elem-new-calendar2__header-center">
                <div class="elem-new-calendar2__nav-btn" @click="prev">
                    <i class="mdi mdi-chevron-left"></i>
                </div>
                <div class="elem-new-calendar2__title">
                    {{ currentTitle }}
                </div>
                <div class="elem-new-calendar2__nav-btn" @click="next">
                    <i class="mdi mdi-chevron-right"></i>
                </div>
            </div>

            <div class="elem-new-calendar2__header-right"></div>
        </div>

        <div class="elem-new-calendar2__controls" v-if="props.showPresets && props.presets.length">
            <div class="elem-new-calendar2__presets">
                <button
                    v-for="preset in props.presets"
                    :key="preset.value"
                    class="elem-new-calendar2__preset-btn"
                    @click="applyPreset(preset.value)">
                    {{ preset.label }}
                </button>
            </div>
        </div>
        
        <div class="elem-new-calendar2__inputs" v-if="props.inputMode === 'manual'">
             <input v-model="manualStartDate" placeholder="YYYY-MM-DD" @change="updateManualDate" />
             <span v-if="isRangeMode">-</span>
             <input v-if="isRangeMode" v-model="manualEndDate" placeholder="YYYY-MM-DD" @change="updateManualDate" />
        </div>

        <div class="elem-new-calendar2__content">
            <div v-if="props.showWeekDays && currentViewMode === 'month'" class="elem-new-calendar2__weekdays">
                <div 
                    v-for="(day, index) in weekDays" 
                    :key="index"
                    class="elem-new-calendar2__weekday"
                    :class="{ 'is-weekend': index >= 5 }">
                    {{ day }}
                </div>
            </div>
            <div v-show="currentViewMode === 'month'" class="elem-new-calendar2__chart" ref="chart"></div>
            <div v-if="currentViewMode === 'year'" class="elem-new-calendar2__year-view">
                <div 
                    v-for="(month, index) in monthsList" 
                    :key="index"
                    class="elem-new-calendar2__month-item"
                    :class="{ 'active': isMonthActive(index) }"
                    @click="selectMonth(index)">
                    {{ month }}
                </div>
            </div>
        </div>
    </w-elem>
</template>

<script>
import { Elem } from '@goodt-wcore/core';
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { meta, Vars, Events } from './descriptor';
import { getPresetRange } from './utils';

dayjs.locale('ru');

const MonthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const WeekDays = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export default {
    extends: Elem,
    meta,
    data() {
        return {
            chartInstance: null,
            selectedDate: [dayjs().format('YYYY-MM-DD')],
            manualStartDate: '',
            manualEndDate: '',
            currentViewDate: dayjs(),
            currentViewMode: 'month', // 'month' or 'year'
            monthsList: MonthNames,
            weekDays: WeekDays
        };
    },
    computed: {
        isRangeMode() {
            return this.props.enableDateRange;
        },
        currentYear() {
            return this.currentViewDate.year();
        },
        currentTitle() {
            if (this.currentViewMode === 'year') {
                return this.currentYear;
            }
            return this.currentViewDate.format('MMMM'); // Only month name
        }
    },
    mounted() {
        this.initChart();
        this.applyPreset('today');
        if (this.$el) {
            this.initResizeObserver();
        }
    },
    beforeDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.chartInstance) {
            this.chartInstance.dispose();
        }
    },
    methods: {
        initResizeObserver() {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.chartInstance && this.currentViewMode === 'month') {
                    this.chartInstance.resize();
                }
            });
            this.resizeObserver.observe(this.$el);
        },
        initChart() {
            if (!this.$refs.chart) return;
            this.chartInstance = echarts.init(this.$refs.chart);
            this.chartInstance.on('click', this.handleChartClick);
            this.renderChart();
        },
        toggleViewMode() {
            this.currentViewMode = this.currentViewMode === 'month' ? 'year' : 'month';
            if (this.currentViewMode === 'month') {
                this.$nextTick(() => {
                    this.chartInstance.resize();
                    this.renderChart();
                });
            }
        },
        prev() {
            if (this.currentViewMode === 'month') {
                this.currentViewDate = this.currentViewDate.subtract(1, 'month');
                this.renderChart();
            } else {
                this.currentViewDate = this.currentViewDate.subtract(1, 'year');
            }
        },
        next() {
            if (this.currentViewMode === 'month') {
                this.currentViewDate = this.currentViewDate.add(1, 'month');
                this.renderChart();
            } else {
                this.currentViewDate = this.currentViewDate.add(1, 'year');
            }
        },
        selectMonth(index) {
            this.currentViewDate = this.currentViewDate.month(index);
            this.currentViewMode = 'month';
            this.$nextTick(() => {
                this.chartInstance.resize();
                this.renderChart();
            });
        },
        isMonthActive(index) {
            return this.currentViewDate.month() === index;
        },
        renderChart() {
            if (!this.chartInstance) return;

            const range = this.currentViewDate.format('YYYY-MM');
            const { colors } = this.props;
            
            const daysInMonth = this.currentViewDate.daysInMonth();
            const data = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const date = this.currentViewDate.date(i).format('YYYY-MM-DD');
                let value = 0;
                if (this.selectedDate.includes(date)) {
                    value = 1;
                } else if (this.isRangeMode && this.selectedDate.length === 2) {
                    const start = dayjs(this.selectedDate[0]);
                    const end = dayjs(this.selectedDate[1]);
                    const current = dayjs(date);
                    if ((current.isAfter(start) && current.isBefore(end)) || current.isSame(start) || current.isSame(end)) {
                        value = 1;
                    }
                }
                data.push([date, value]);
            }

            const option = {
                tooltip: { show: false },
                visualMap: {
                    min: 0,
                    max: 1,
                    show: false,
                    inRange: {
                        color: ['#fff', colors.selected]
                    }
                },
                calendar: {
                    orient: 'vertical',
                    top: 20, // Reduced top since header is external
                    left: 20,
                    right: 20,
                    bottom: 20,
                    cellSize: ['auto', 'auto'],
                    range: range,
                    itemStyle: {
                        borderWidth: 0,
                        borderColor: 'transparent'
                    },
                    splitLine: { show: false },
                    yearLabel: { show: false },
                    monthLabel: { show: false },
                    dayLabel: { show: false } // Hide Echarts day labels
                },
                series: [{
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: data,
                    label: {
                        show: true,
                        formatter: (params) => dayjs(params.value[0]).date(),
                        color: '#000'
                    },
                    itemStyle: {
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }
                }]
            };

            this.chartInstance.setOption(option);
        },
        getCalendarRange() {
            return this.currentViewDate.format('YYYY-MM');
        },
        applyPreset(presetValue) {
            const range = getPresetRange(presetValue);
            if (this.isRangeMode) {
                this.selectedDate = range;
                this.manualStartDate = range[0];
                this.manualEndDate = range[1];
            } else {
                this.selectedDate = [range[0]];
                this.manualStartDate = range[0];
            }
            this.currentViewDate = dayjs(range[0]);
            this.updateStore();
            this.renderChart();
        },
        handleChartClick(params) {
            if (params.componentType === 'series') {
                const date = params.data[0];
                if (this.isRangeMode) {
                    if (this.selectedDate.length === 0 || this.selectedDate.length === 2) {
                        this.selectedDate = [date];
                    } else {
                        const start = dayjs(this.selectedDate[0]);
                        const end = dayjs(date);
                        if (end.isBefore(start)) {
                            this.selectedDate = [date, this.selectedDate[0]];
                        } else {
                            this.selectedDate = [this.selectedDate[0], date];
                        }
                    }
                } else {
                    this.selectedDate = [date];
                }
                this.updateStore();
                this.renderChart();
            }
        },
        updateManualDate() {
            if (this.isRangeMode) {
                if (dayjs(this.manualStartDate).isValid() && dayjs(this.manualEndDate).isValid()) {
                    this.selectedDate = [this.manualStartDate, this.manualEndDate];
                    this.updateStore();
                    this.renderChart();
                }
            } else {
                if (dayjs(this.manualStartDate).isValid()) {
                    this.selectedDate = [this.manualStartDate];
                    this.updateStore();
                    this.renderChart();
                }
            }
        },
        updateStore() {
            if (this.selectedDate.length === 0) return;
            
            const format = this.props.dateFormat || 'DD-MM-YYYY';
            
            if (this.isRangeMode && this.selectedDate.length === 2) {
                 this.$storeCommit({
                    [Vars.DATE_RANGE]: this.selectedDate.map(d => dayjs(d).format(format)),
                    [Vars.SELECTED_DATE]: dayjs(this.selectedDate[0]).format(format)
                });
            } else {
                this.$storeCommit({
                    [Vars.SELECTED_DATE]: dayjs(this.selectedDate[0]).format(format)
                });
            }
            
            if (this.props.actionType && this.props.actionType.event) {
                 this.$eventTrigger(Events.CHANGE_DATE);
            }
        }
    }
};
</script>

<style scoped>
.elem-new-calendar2 {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    border-radius: 4px;
    overflow: hidden;
}
.elem-new-calendar2__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    color: #fff;
    height: 50px;
}
.elem-new-calendar2__header-left, .elem-new-calendar2__header-right {
    flex: 1;
    display: flex;
    align-items: center;
}
.elem-new-calendar2__header-center {
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
}
.elem-new-calendar2__title {
    font-size: 16px;
    font-weight: 500;
    text-transform: capitalize;
    margin: 0 10px;
}
.elem-new-calendar2__nav-btn {
    cursor: pointer;
    font-size: 20px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    padding: 0 5px;
}
.elem-new-calendar2__nav-btn:hover {
    background: rgba(255,255,255,0.2);
}
.elem-new-calendar2__year-btn {
    font-size: 14px;
    margin-left: 5px;
}
.elem-new-calendar2__controls {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid #eee;
}
.elem-new-calendar2__presets {
    display: flex;
    width: 100%;
    gap: 10px;
}
.elem-new-calendar2__preset-btn {
    flex: 1;
    padding: 6px 0;
    cursor: pointer;
    background: #f5f7fa;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    color: #606266;
    transition: all 0.3s;
    text-align: center;
}
.elem-new-calendar2__preset-btn:hover {
    background: #e4e7ed;
    color: #409eff;
}
.elem-new-calendar2__content {
    flex: 1;
    position: relative;
    width: 100%;
    min-height: 300px;
    display: flex;
    flex-direction: column;
}
.elem-new-calendar2__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 10px 20px 0 20px;
}
.elem-new-calendar2__weekday {
    text-align: center;
    font-size: 14px;
    color: #666;
    font-weight: 500;
}
.elem-new-calendar2__weekday.is-weekend {
    color: #f56c6c;
}
.elem-new-calendar2__chart {
    width: 100%;
    flex: 1;
}
.elem-new-calendar2__year-view {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    height: 100%;
    padding: 20px;
    gap: 10px;
}
.elem-new-calendar2__month-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    text-transform: capitalize;
}
.elem-new-calendar2__month-item:hover {
    background: #f5f7fa;
    color: #409eff;
}
.elem-new-calendar2__month-item.active {
    background: #ecf5ff;
    color: #409eff;
    font-weight: bold;
}
.elem-new-calendar2__inputs {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px;
}
</style>
