<template>
    <ui-panel-container>
        <ui-select class="p" :options="dimNamesOptions" v-model="props.dimension" @change="propChanged('dimension')">
            Измерение
        </ui-select>
        <ui-select
            class="p"
            :options="metricNamesOptions"
            v-model="props.metricForColor"
            @change="propChanged('metricForColor')">
            Метрика для покраски
        </ui-select>
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
        $meta: { name: 'Измерения/Метрики', icon: 'gauge' },
        ...ComponentInstanceTypeDescriptor
    }),
    computed: {
        queryHelper() {
            return this.elementInstance ? this.elementInstance.queryHelper : null;
        },
        dimNamesOptions() {
            if (this.queryHelper === null) {
                return [];
            }
            const dimensionsName = Object.keys(this.queryHelper.dimensionList);
            return dimensionsName.map((value) => ({
                label: value,
                value
            }));
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
    }
};
</script>
