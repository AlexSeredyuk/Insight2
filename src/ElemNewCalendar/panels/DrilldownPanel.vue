<template>
    <w-panel>
        <ui-container>
            <ui-select prop="drilldownLevel" :options="drilldownOptions" @change="propChanged('drilldownLevel')">
                Уровень drill-down
            </ui-select>

            <ui-divider></ui-divider>

            <div class="form-label form-label-small">Стилизация контролов drill-down</div>

            <ui-has-panel>
                <span class="form-label form-label-small">Цвета</span>
                <template #panel>
                    <ui-input-cp prop="drilldownControls.backgroundColor" @change="propChanged('drilldownControls')">
                        Цвет фона
                    </ui-input-cp>
                    <ui-input-cp prop="drilldownControls.borderColor" @change="propChanged('drilldownControls')">
                        Цвет границы
                    </ui-input-cp>
                    <ui-input-cp prop="drilldownControls.color" @change="propChanged('drilldownControls')">
                        Цвет текста
                    </ui-input-cp>
                </template>
            </ui-has-panel>

            <ui-has-panel>
                <span class="form-label form-label-small">Размеры</span>
                <template #panel>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="drilldownFontSizeString"
                        @change="saveDrilldownFontSize">
                        Размер шрифта
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="drilldownBorderRadiusString"
                        @change="saveDrilldownBorderRadius">
                        Скругление углов
                    </ui-input-units>
                </template>
            </ui-has-panel>
        </ui-container>
    </w-panel>
</template>

<script>
import { Panel } from '@goodt-wcore/panel';
import { Panels } from '@goodt-wcore/core';
import { DRILLDOWN_OPTIONS } from '../constants';

const { FontSizeFirstPxUnits } = Panels;

export default {
    extends: Panel,

    meta: { name: 'Drill-down', icon: 'layers' },

    static: {
        FontSizeFirstPxUnits,
        drilldownOptions: DRILLDOWN_OPTIONS
    },

    computed: {
        drilldownFontSizeString: {
            get() {
                const defaultSize = 14; // eslint-disable-line no-magic-numbers
                const fontSize = this.props.drilldownControls?.fontSize || { size: defaultSize, unit: 'px' };
                return `${fontSize.size}${fontSize.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.drilldownControls) {
                            this.props.drilldownControls = {};
                        }
                        this.props.drilldownControls.fontSize = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.drilldownControls) {
                        this.props.drilldownControls = {};
                    }
                    this.props.drilldownControls.fontSize = val;
                }
            }
        },
        drilldownBorderRadiusString: {
            get() {
                const defaultSize = 4; // eslint-disable-line no-magic-numbers
                const borderRadius = this.props.drilldownControls?.borderRadius || { size: defaultSize, unit: 'px' };
                return `${borderRadius.size}${borderRadius.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.drilldownControls) {
                            this.props.drilldownControls = {};
                        }
                        this.props.drilldownControls.borderRadius = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.drilldownControls) {
                        this.props.drilldownControls = {};
                    }
                    this.props.drilldownControls.borderRadius = val;
                }
            }
        }
    },

    methods: {
        saveDrilldownFontSize() {
            this.propChanged('drilldownControls');
        },
        saveDrilldownBorderRadius() {
            this.propChanged('drilldownControls');
        }
    }
};
</script>




