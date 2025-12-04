<template>
    <ui-panel-container>
        <ui-switch class="p" v-model="props.modeYear.modeActive" @change="handleChangeMode">
            Включить режим "Год"
        </ui-switch>
        <ui-has-panel class="p">
            <ui-checkbox v-model="props.modeYear.header.show" @change="propChanged('modeYear')">
                Вывод заголовков месяцев
            </ui-checkbox>
            <template #panel>
                <ui-input-cp class="p" v-model="props.modeYear.header.color" @change="propChanged('modeYear')">
                    Цвет текста
                </ui-input-cp>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeYear.header.fontSize"
                    @change="propChanged('modeYear')">
                    Размер текста
                </ui-input-units>
                <ui-input class="p" v-model="props.modeYear.header.fontWeight" @change="propChanged('modeYear')">
                    Плотность текста
                </ui-input>
                <ui-select
                    :options="alignOptions"
                    v-model="props.modeYear.header.align"
                    @change="propChanged('modeYear')">
                    Выравнивание
                </ui-select>
            </template>
        </ui-has-panel>

        <div v-for="(metric, idx) in props.modeYear.metrics" :key="metric.id">
            <ui-collapse class="p">
                <template #header>{{ getMetricNameByIndex(idx) }}</template>
                <div>
                    <ui-select
                        :options="metricNamesOptions"
                        v-model="metric.metric"
                        class="p"
                        @change="propChanged('modeYear')">
                        Метрика
                    </ui-select>
                    <ui-switch class="p" v-model="metric.dontSum" @change="propChanged('modeYear')">
                        Не суммировать метрику
                    </ui-switch>
                    <ui-has-two-columns>
                        <template #left>
                            <ui-input-cp class="p" v-model="metric.color" @change="propChanged('modeYear')">
                                Цвет текста
                            </ui-input-cp>
                        </template>
                        <template #right>
                            <ui-input-units
                                :units="SizeUnits"
                                class="p"
                                v-model="metric.fontSize"
                                @change="propChanged('modeYear')">
                                Размер текста
                            </ui-input-units>
                        </template>
                    </ui-has-two-columns>
                    <ui-select
                        :options="alignOptions"
                        class="p"
                        v-model="metric.align"
                        @change="propChanged('modeYear')">
                        Выравнивание
                    </ui-select>
                    <ui-input class="p" v-model="metric.fontWeight" @change="propChanged('modeYear')">
                        Плотность текста
                    </ui-input>
                    <ui-select
                        class="p"
                        :options="FontStyleOptions"
                        v-model="metric.fontStyle"
                        @change="propChanged('modeYear')">
                        Стиль текста
                    </ui-select>
                    <ui-panel
                        class="p"
                        :groups="[
                            { name: 'Префикс', slot: 'prefix' },
                            { name: 'Постфикс', slot: 'postfix' }
                        ]">
                        <template #prefix>
                            <ui-input class="p" v-model="metric.prefix.text" @change="propChanged('modeYear')">
                                Текст
                            </ui-input>
                            <ui-has-two-columns>
                                <template #left>
                                    <ui-input-cp
                                        class="p"
                                        v-model="metric.prefix.color"
                                        @change="propChanged('modeYear')">
                                        Цвет текста
                                    </ui-input-cp>
                                </template>
                                <template #right>
                                    <ui-input-units
                                        :units="SizeUnits"
                                        class="p"
                                        v-model="metric.prefix.fontSize"
                                        @change="propChanged('modeYear')">
                                        Размер текста
                                    </ui-input-units>
                                </template>
                            </ui-has-two-columns>
                        </template>
                        <template #postfix>
                            <ui-input class="p" v-model="metric.postfix.text" @change="propChanged('modeYear')">
                                Текст
                            </ui-input>
                            <ui-has-two-columns>
                                <template #left>
                                    <ui-input-cp
                                        class="p"
                                        v-model="metric.postfix.color"
                                        @change="propChanged('modeYear')">
                                        Цвет текста
                                    </ui-input-cp>
                                </template>
                                <template #right>
                                    <ui-input-units
                                        :units="SizeUnits"
                                        class="p"
                                        v-model="metric.postfix.fontSize"
                                        @change="propChanged('modeYear')">
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
            <span class="form-label form-label-small">Настройка окон</span>
            <template #panel>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeYear.blocks.width"
                            @change="propChanged('modeYear')">
                            Ширина
                        </ui-input-units>
                    </template>
                    <template #right>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeYear.blocks.height"
                            @change="propChanged('modeYear')">
                            Высота
                        </ui-input-units>
                    </template>
                </ui-has-two-columns>
                <ui-input-cp class="p" v-model="props.modeYear.blocks.background" @change="propChanged('modeYear')">
                    Цвет фона
                </ui-input-cp>
                <ui-input class="p" v-model="props.modeYear.blocks.boxShadow" @change="propChanged('modeYear')">
                    Настройка тени
                </ui-input>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeYear.blocks.borderRadius"
                    @change="propChanged('modeYear')">
                    Скругление углов
                </ui-input-units>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeYear.blocks.verticalGap"
                    @change="propChanged('modeYear')">
                    Вертикальные отступы
                </ui-input-units>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeYear.blocks.horizontalGap"
                    @change="propChanged('modeYear')">
                    Горизонтальные отступы
                </ui-input-units>
            </template>
        </ui-has-panel>
        <ui-has-panel class="p">
            <span class="form-label form-label-small">Настройка ячеек</span>
            <template #panel>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeYear.cells.width"
                            @change="propChanged('modeYear')">
                            Ширина
                        </ui-input-units>
                    </template>
                    <template #right>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.modeYear.cells.height"
                            @change="propChanged('modeYear')">
                            Высота
                        </ui-input-units>
                    </template>
                </ui-has-two-columns>
                <ui-input-units
                    class="p"
                    :units="SizeUnits"
                    v-model="props.modeYear.cells.borderRadius"
                    @change="propChanged('modeYear')">
                    Скругление углов
                </ui-input-units>
                <ui-input-units
                    class="p"
                    :units="SizeUnits"
                    v-model="props.modeYear.cells.verticalGap"
                    @change="propChanged('modeYear')">
                    Вертикальные отступы
                </ui-input-units>
                <ui-input-units
                    class="p"
                    :units="SizeUnits"
                    v-model="props.modeYear.cells.horizontalGap"
                    @change="propChanged('modeYear')">
                    Горизонтальные отступы
                </ui-input-units>
            </template>
        </ui-has-panel>

        <ui-has-panel class="p">
            <ui-checkbox v-model="props.modeYear.title.show" @change="propChanged('modeYear')">
                Настройка заголовка
            </ui-checkbox>
            <template #panel>
                <ui-input class="p" v-model="props.modeYear.title.text" @change="propChanged('modeYear')">
                    Текст
                </ui-input>
                <ui-input-cp class="p" v-model="props.modeYear.title.color" @change="propChanged('modeYear')">
                    Цвет текста
                </ui-input-cp>
                <ui-input-units
                    :units="SizeUnits"
                    class="p"
                    v-model="props.modeYear.title.fontSize"
                    @change="propChanged('modeYear')">
                    Размер текста
                </ui-input-units>
                <ui-input class="p" v-model="props.modeYear.title.fontWeight" @change="propChanged('modeYear')">
                    Плотность текста
                </ui-input>
                <ui-select
                    :options="alignOptions"
                    v-model="props.modeYear.title.align"
                    @change="propChanged('modeYear')">
                    Выравнивание
                </ui-select>
            </template>
        </ui-has-panel>
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
        $meta: { name: 'Режим год', icon: 'calendar-today' },
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
            const { metrics } = this.props.modeYear;
            const newId = metrics.length === 0 ? 1 : metrics[metrics.length - 1].id + 1;
            const newMetric = {
                id: newId,
                metric: null,
                dontSum: false,
                color: 'rgba(0,0,0,0.6)',
                fontSize: '1rem',
                fontWeight: '500',
                fontStyle: 'normal',
                align: 'right',
                prefix: {
                    text: '',
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '1rem'
                },
                postfix: {
                    text: '',
                    color: 'rgba(0,0,0,0.6)',
                    fontSize: '1rem'
                }
            };
            metrics.push(newMetric);
            this.propChanged('modeYear');
        },
        /**
         * @param {number} idx
         * @description delete metric from props by index
         * */
        deleteMetric(idx) {
            this.props.modeYear.metrics.splice(idx, 1);
            this.propChanged('modeYear');
        },
        handleChangeMode() {
            const { modeMonth } = this.props;
            if (modeMonth.modeActive) {
                modeMonth.modeActive = false;
                this.propChanged('modeMonth');
            }
            this.propChanged('modeYear');
        },
        getMetricNameByIndex(idx) {
            return `Метрика ${idx + 1}`;
        }
    }
};
</script>
