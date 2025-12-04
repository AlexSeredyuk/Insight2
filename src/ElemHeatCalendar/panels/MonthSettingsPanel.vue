<template>
    <ui-panel-container>
        <ui-switch class="p" v-model="props.modeMonth.modeActive" @change="handleChangeMode">
            Включить режим "Месяц"
        </ui-switch>

        <div v-for="(metric, idx) in props.modeMonth.metrics" :key="metric.id">
            <ui-collapse class="p">
                <template #header>{{ getMetricNameByIndex(idx) }}</template>
                <div>
                    <ui-select
                        :options="metricNamesOptions"
                        v-model="metric.metric"
                        class="p"
                        @change="propChanged('modeMonth')">
                        Метрика
                    </ui-select>
                    <ui-has-two-columns>
                        <template #left>
                            <ui-input-cp class="p" v-model="metric.color" @change="propChanged('modeMonth')">
                                Цвет текста
                            </ui-input-cp>
                        </template>
                        <template #right>
                            <ui-input-units
                                :units="SizeUnits"
                                class="p"
                                v-model="metric.fontSize"
                                @change="propChanged('modeMonth')">
                                Размер текста
                            </ui-input-units>
                        </template>
                    </ui-has-two-columns>
                    <ui-select
                        :options="alignOptions"
                        class="p"
                        v-model="metric.align"
                        @change="propChanged('modeMonth')">
                        Выравнивание
                    </ui-select>
                    <ui-input class="p" v-model="metric.fontWeight" @change="propChanged('modeMonth')">
                        Плотность текста
                    </ui-input>
                    <ui-select
                        class="p"
                        :options="FontStyleOptions"
                        v-model="metric.fontStyle"
                        @change="propChanged('modeMonth')">
                        Стиль текста
                    </ui-select>
                    <ui-panel
                        class="p"
                        :groups="[
                            { name: 'Префикс', slot: 'prefix' },
                            { name: 'Постфикс', slot: 'postfix' }
                        ]">
                        <template #prefix>
                            <ui-input class="p" v-model="metric.prefix.text" @change="propChanged('modeMonth')">
                                Текст
                            </ui-input>
                            <ui-has-two-columns>
                                <template #left>
                                    <ui-input-cp
                                        class="p"
                                        v-model="metric.prefix.color"
                                        @change="propChanged('modeMonth')">
                                        Цвет текста
                                    </ui-input-cp>
                                </template>
                                <template #right>
                                    <ui-input-units
                                        :units="SizeUnits"
                                        class="p"
                                        v-model="metric.prefix.fontSize"
                                        @change="propChanged('modeMonth')">
                                        Размер текста
                                    </ui-input-units>
                                </template>
                            </ui-has-two-columns>
                        </template>
                        <template #postfix>
                            <ui-input class="p" v-model="metric.postfix.text" @change="propChanged('modeMonth')">
                                Текст
                            </ui-input>
                            <ui-has-two-columns>
                                <template #left>
                                    <ui-input-cp
                                        class="p"
                                        v-model="metric.postfix.color"
                                        @change="propChanged('modeMonth')">
                                        Цвет текста
                                    </ui-input-cp>
                                </template>
                                <template #right>
                                    <ui-input-units
                                        :units="SizeUnits"
                                        class="p"
                                        v-model="metric.postfix.fontSize"
                                        @change="propChanged('modeMonth')">
                                        Размер текста
                                    </ui-input-units>
                                </template>
                            </ui-has-two-columns>
                        </template>
                    </ui-panel>
                </div>
                <ui-button type="error" @click="deleteMetric(idx)">Удалить</ui-button>
            </ui-collapse>
        </div>
        <ui-button class="p" @click="addMetric">Добавить метрику</ui-button>

        <ui-has-panel class="p">
            <ui-checkbox v-model="props.modeMonth.date.show" @change="propChanged('modeMonth')">Вывод дат</ui-checkbox>
            <template #panel>
                <ui-select
                    :options="alignOptions"
                    class="p"
                    v-model="props.modeMonth.date.align"
                    @change="propChanged('modeMonth')">
                    Выравнивание
                </ui-select>
                <ui-has-two-columns>
                    <template #left>
                        <ui-input-cp class="p" v-model="props.modeMonth.date.color" @change="propChanged('modeMonth')">
                            Цвет текста
                        </ui-input-cp>
                    </template>
                    <template #right>
                        <ui-input-units
                            :units="SizeUnits"
                            class="p"
                            v-model="props.modeMonth.date.fontSize"
                            @change="propChanged('modeMonth')">
                            Размер текста
                        </ui-input-units>
                    </template>
                </ui-has-two-columns>
            </template>
        </ui-has-panel>

        <ui-has-panel class="p">
            <span class="form-label form-label-small">Настройка окон</span>
            <template #panel>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeMonth.blocks.width"
                            @change="propChanged('modeMonth')">
                            Ширина
                        </ui-input-units>
                    </template>
                    <template #right>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeMonth.blocks.height"
                            @change="propChanged('modeMonth')">
                            Высота
                        </ui-input-units>
                    </template>
                </ui-has-two-columns>
                <ui-input-cp class="p" v-model="props.modeMonth.blocks.background" @change="propChanged('modeMonth')">
                    Цвет фона
                </ui-input-cp>
                <ui-input class="p" v-model="props.modeMonth.blocks.boxShadow" @change="propChanged('modeMonth')">
                    Настройка тени
                </ui-input>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeMonth.blocks.borderRadius"
                    @change="propChanged('modeMonth')">
                    Скругление углов
                </ui-input-units>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeMonth.blocks.verticalGap"
                    @change="propChanged('modeMonth')">
                    Вертикальные отступы
                </ui-input-units>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeMonth.blocks.horizontalGap"
                    @change="propChanged('modeMonth')">
                    Горизонтальные отступы
                </ui-input-units>
            </template>
        </ui-has-panel>
        <ui-has-panel class="p">
            <span class="form-label form-label-small">Настройка границ выбранной даты</span>
            <template #panel>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeMonth.border.width"
                            @change="propChanged('modeMonth')">
                            Ширина границы
                        </ui-input-units>
                    </template>
                    <template #right>
                        <ui-input-cp v-model="props.modeMonth.border.color" @change="propChanged('modeMonth')">
                            Цвет границы
                        </ui-input-cp>
                    </template>
                </ui-has-two-columns>
            </template>
        </ui-has-panel>

        <ui-has-panel class="p">
            <ui-checkbox v-model="props.modeMonth.tooltip.enabled" @change="propChanged('modeMonth')">
                Выводить tooltip
            </ui-checkbox>
            <template #panel>Здесь будут настройки для tooltip'a</template>
        </ui-has-panel>
        <ui-switch v-model="props.modeMonth.currentMonth" @change="propChanged('modeMonth')">
            Выводить только текущий месяц
        </ui-switch>
    </ui-panel-container>
</template>
<script>
import { Panel, Panels } from '@goodt-wcore/core';
import { Dremio } from 'goodt-wcore';

/**
 * @typedef {import('../types/SettingsPanel').TInstance} TInstance
 * @type {TInstance}
 */
const ComponentInstanceTypeDescriptor = undefined;

const { Query } = Dremio;
const { SizeUnits, FontStyleOptions } = Panels;

export default {
    extends: Panel,
    static: {
        SizeUnits,
        FontStyleOptions,
        alignOptions: [
            { label: 'По левому краю', value: 'left' },
            { label: 'По центру', value: 'center' },
            { label: 'По правому краю', value: 'right' }
        ]
    },
    data: () => ({
        /** @public */
        $meta: { name: 'Режим месяц', icon: 'calendar-range' },
        ...ComponentInstanceTypeDescriptor
    }),
    computed: {
        queryHelper() {
            return this.elementInstance ? this.elementInstance.queryHelper : null;
        },
        metricNamesOptions() {
            if (this.queryHelper === null) {
                return [];
            }
            const { query } = this.queryHelper;
            return Query.queryMetricNames(query).map((value) => ({
                label: value,
                value
            }));
        }
    },
    methods: {
        /**
         * @description add metric to props
         * */
        addMetric() {
            const { metrics } = this.props.modeMonth;
            const newId = metrics.length === 0 ? 1 : metrics[metrics.length - 1].id + 1;
            const newMetric = {
                id: newId,
                metric: null,
                color: '#000',
                fontSize: '1rem',
                fontWeight: '500',
                fontStyle: 'normal',
                align: 'left',
                prefix: {
                    text: '',
                    color: '#000',
                    fontSize: '1rem'
                },
                postfix: {
                    text: '',
                    color: '#000',
                    fontSize: '1rem'
                }
            };
            metrics.push(newMetric);
            this.propChanged('modeMonth');
        },
        /**
         * @param {number} idx
         * @description delete metric from props by index
         * */
        deleteMetric(idx) {
            this.props.modeMonth.metrics.splice(idx, 1);
            this.propChanged('modeMonth');
        },
        handleChangeMode() {
            const { modeYear } = this.props;
            if (modeYear.modeActive) {
                modeYear.modeActive = false;
                this.propChanged('modeYear');
            }
            this.propChanged('modeMonth');
        },
        getMetricNameByIndex(idx) {
            return `Метрика ${idx + 1}`;
        }
    }
};
</script>
