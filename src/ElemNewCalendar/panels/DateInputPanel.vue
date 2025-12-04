<template>
    <w-panel>
        <ui-container>
            <div class="form-label form-label-small">Настройки полей ввода дат</div>

            <ui-has-panel>
                <span class="form-label form-label-small">Цвета</span>
                <template #panel>
                    <ui-input-cp prop="dateInput.backgroundColor" @change="propChanged('dateInput')">
                        Цвет фона
                    </ui-input-cp>
                    <ui-input-cp prop="dateInput.borderColor" @change="propChanged('dateInput')">
                        Цвет границы
                    </ui-input-cp>
                    <ui-input-cp prop="dateInput.color" @change="propChanged('dateInput')">
                        Цвет текста
                    </ui-input-cp>
                </template>
            </ui-has-panel>

            <ui-has-panel>
                <span class="form-label form-label-small">Размеры</span>
                <template #panel>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="dateInputFontSizeString"
                        @change="saveDateInputFontSize">
                        Размер шрифта
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="dateInputPaddingString"
                        @change="saveDateInputPadding">
                        Внутренние отступы
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="dateInputBorderRadiusString"
                        @change="saveDateInputBorderRadius">
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

const { FontSizeFirstPxUnits } = Panels;

export default {
    extends: Panel,

    meta: { name: 'Ввод дат', icon: 'calendar-edit' },

    static: {
        FontSizeFirstPxUnits
    },

    computed: {
        dateInputFontSizeString: {
            get() {
                const defaultSize = 14; // eslint-disable-line no-magic-numbers
                const fontSize = this.props.dateInput?.fontSize || { size: defaultSize, unit: 'px' };
                return `${fontSize.size}${fontSize.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.dateInput) {
                            this.props.dateInput = {};
                        }
                        this.props.dateInput.fontSize = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.dateInput) {
                        this.props.dateInput = {};
                    }
                    this.props.dateInput.fontSize = val;
                }
            }
        },
        dateInputPaddingString: {
            get() {
                const defaultSize = 8; // eslint-disable-line no-magic-numbers
                const padding = this.props.dateInput?.padding || { size: defaultSize, unit: 'px' };
                return `${padding.size}${padding.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.dateInput) {
                            this.props.dateInput = {};
                        }
                        this.props.dateInput.padding = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.dateInput) {
                        this.props.dateInput = {};
                    }
                    this.props.dateInput.padding = val;
                }
            }
        },
        dateInputBorderRadiusString: {
            get() {
                const defaultSize = 4; // eslint-disable-line no-magic-numbers
                const borderRadius = this.props.dateInput?.borderRadius || { size: defaultSize, unit: 'px' };
                return `${borderRadius.size}${borderRadius.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.dateInput) {
                            this.props.dateInput = {};
                        }
                        this.props.dateInput.borderRadius = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.dateInput) {
                        this.props.dateInput = {};
                    }
                    this.props.dateInput.borderRadius = val;
                }
            }
        }
    },

    methods: {
        saveDateInputFontSize() {
            this.propChanged('dateInput');
        },
        saveDateInputPadding() {
            this.propChanged('dateInput');
        },
        saveDateInputBorderRadius() {
            this.propChanged('dateInput');
        }
    }
};
</script>




