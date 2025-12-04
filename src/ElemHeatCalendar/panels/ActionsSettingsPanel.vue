<template>
    <ui-panel-container>
        <ui-has-panel class="p">
            <ui-checkbox v-model="props.actionType.link.enabled" @change="propChanged('actionType')">
                Переход по ссылке
            </ui-checkbox>
            <template #panel>
                <ui-switch
                    v-if="props.modeMonth.modeActive"
                    class="p"
                    v-model="props.actionType.link.fromMetric"
                    @change="propChanged('actionType')">
                    Ссылка из метрики
                </ui-switch>
                <ui-select
                    v-if="props.modeMonth.modeActive"
                    class="p"
                    :options="metricNamesOptions"
                    v-model="props.actionType.link.metric"
                    @change="propChanged('actionType')">
                    Метрика
                </ui-select>
                <ui-input
                    :disabled="props.actionType.link.fromMetric"
                    v-model="props.actionType.link.url"
                    @change="propChanged('actionType')">
                    Url
                </ui-input>
            </template>
        </ui-has-panel>

        <ui-has-panel class="p">
            <ui-checkbox v-model="props.actionType.event.enabled" @change="propChanged('actionType')">
                Триггерить событие
            </ui-checkbox>
            <template #panel>
                <ui-input v-model="props.actionType.event.name" @change="propChanged('actionType')">
                    Название события
                </ui-input>
            </template>
        </ui-has-panel>
    </ui-panel-container>
</template>

<script>
import { Panel } from '@goodt-wcore/core';
import { Dremio } from 'goodt-wcore';

/**
 * @typedef {import('../types/SettingsPanel').TInstance} TInstance
 * @type {TInstance}
 */
const ComponentInstanceTypeDescriptor = undefined;

const { Query } = Dremio;

export default {
    extends: Panel,
    data: () => ({
        /** @public */
        $meta: { name: 'Действия', icon: 'list-status' },
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
            return Query.queryMetricNames(query)?.map((value) => ({
                label: value,
                value
            }));
        }
    }
};
</script>
