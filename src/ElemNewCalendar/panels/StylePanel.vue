<template>
    <w-panel>
        <ui-container>
            <div class="form-label form-label-small">Стилизация календаря</div>

            <ui-has-panel>
                <span class="form-label form-label-small">Основные цвета</span>
                <template #panel>
                    <ui-input-cp prop="calendar.backgroundColor" @change="propChanged('calendar')">
                        Цвет фона ячеек
                    </ui-input-cp>
                    <ui-input-cp prop="calendar.borderColor" @change="propChanged('calendar')">
                        Цвет границ ячеек
                    </ui-input-cp>
                    <ui-input-cp prop="selectedRange.backgroundColor" @change="propChanged('selectedRange')">
                        Цвет фона выбранного диапазона
                    </ui-input-cp>
                    <ui-input-cp prop="selectedRange.borderColor" @change="propChanged('selectedRange')">
                        Цвет границ выбранного диапазона
                    </ui-input-cp>
                </template>
            </ui-has-panel>

            <ui-has-panel>
                <span class="form-label form-label-small">Размеры ячеек</span>
                <template #panel>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="cellSizeString"
                        @change="saveCellSize">
                        Размер ячеек
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="cellGapString"
                        @change="saveCellGap">
                        Расстояние между ячейками
                    </ui-input-units>
                </template>
            </ui-has-panel>

            <ui-has-panel>
                <span class="form-label form-label-small">Границы</span>
                <template #panel>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="borderWidthString"
                        @change="saveBorderWidth">
                        Толщина границы
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="borderRadiusString"
                        @change="saveBorderRadius">
                        Скругление углов
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="selectedBorderWidthString"
                        @change="saveSelectedBorderWidth">
                        Толщина границы выбранного диапазона
                    </ui-input-units>
                </template>
            </ui-has-panel>

            <ui-divider></ui-divider>

            <div class="form-label form-label-small">Стилизация пресетов</div>

            <ui-has-panel>
                <span class="form-label form-label-small">Цвета пресетов</span>
                <template #panel>
                    <ui-input-cp prop="presets.buttonBackground" @change="propChanged('presets')">
                        Цвет фона кнопок
                    </ui-input-cp>
                    <ui-input-cp prop="presets.buttonHoverBackground" @change="propChanged('presets')">
                        Цвет фона при наведении
                    </ui-input-cp>
                    <ui-input-cp prop="presets.buttonActiveBackground" @change="propChanged('presets')">
                        Цвет фона активной кнопки
                    </ui-input-cp>
                    <ui-input-cp prop="presets.buttonColor" @change="propChanged('presets')">
                        Цвет текста кнопок
                    </ui-input-cp>
                </template>
            </ui-has-panel>

            <ui-has-panel>
                <span class="form-label form-label-small">Размеры кнопок пресетов</span>
                <template #panel>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="buttonPaddingString"
                        @change="saveButtonPadding">
                        Внутренние отступы
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="buttonFontSizeString"
                        @change="saveButtonFontSize">
                        Размер шрифта
                    </ui-input-units>
                    <ui-input-units
                        :units="FontSizeFirstPxUnits"
                        v-model="buttonBorderRadiusString"
                        @change="saveButtonBorderRadius">
                        Скругление углов
                    </ui-input-units>
                </template>
            </ui-has-panel>

            <ui-input prop="presets.buttonFontWeight" @change="propChanged('presets')">
                Насыщенность шрифта
            </ui-input>
        </ui-container>
    </w-panel>
</template>

<script>
import { Panel } from '@goodt-wcore/panel';
import { Panels } from '@goodt-wcore/core';

const { FontSizeFirstPxUnits } = Panels;

export default {
    extends: Panel,

    meta: { name: 'Стилизация', icon: 'palette' },

    static: {
        FontSizeFirstPxUnits
    },

    computed: {
        cellSizeString: {
            get() {
                const defaultSize = 20; // eslint-disable-line no-magic-numbers
                const cellSize = this.props.calendar?.cellSize || { size: defaultSize, unit: 'px' };
                return `${cellSize.size}${cellSize.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.calendar) {
                            this.props.calendar = {};
                        }
                        this.props.calendar.cellSize = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.calendar) {
                        this.props.calendar = {};
                    }
                    this.props.calendar.cellSize = val;
                }
            }
        },
        cellGapString: {
            get() {
                const defaultSize = 4; // eslint-disable-line no-magic-numbers
                const cellGap = this.props.calendar?.cellGap || { size: defaultSize, unit: 'px' };
                return `${cellGap.size}${cellGap.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.calendar) {
                            this.props.calendar = {};
                        }
                        this.props.calendar.cellGap = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.calendar) {
                        this.props.calendar = {};
                    }
                    this.props.calendar.cellGap = val;
                }
            }
        },
        borderWidthString: {
            get() {
                const defaultSize = 1; // eslint-disable-line no-magic-numbers
                const borderWidth = this.props.calendar?.borderWidth || { size: defaultSize, unit: 'px' };
                return `${borderWidth.size}${borderWidth.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.calendar) {
                            this.props.calendar = {};
                        }
                        this.props.calendar.borderWidth = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.calendar) {
                        this.props.calendar = {};
                    }
                    this.props.calendar.borderWidth = val;
                }
            }
        },
        borderRadiusString: {
            get() {
                const defaultSize = 4; // eslint-disable-line no-magic-numbers
                const borderRadius = this.props.calendar?.borderRadius || { size: defaultSize, unit: 'px' };
                return `${borderRadius.size}${borderRadius.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.calendar) {
                            this.props.calendar = {};
                        }
                        this.props.calendar.borderRadius = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.calendar) {
                        this.props.calendar = {};
                    }
                    this.props.calendar.borderRadius = val;
                }
            }
        },
        selectedBorderWidthString: {
            get() {
                const defaultSize = 2; // eslint-disable-line no-magic-numbers
                const borderWidth = this.props.selectedRange?.borderWidth || { size: defaultSize, unit: 'px' };
                return `${borderWidth.size}${borderWidth.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.selectedRange) {
                            this.props.selectedRange = {};
                        }
                        this.props.selectedRange.borderWidth = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.selectedRange) {
                        this.props.selectedRange = {};
                    }
                    this.props.selectedRange.borderWidth = val;
                }
            }
        },
        buttonPaddingString: {
            get() {
                const defaultSize = 8; // eslint-disable-line no-magic-numbers
                const padding = this.props.presets?.buttonPadding || { size: defaultSize, unit: 'px' };
                return `${padding.size}${padding.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.presets) {
                            this.props.presets = {};
                        }
                        this.props.presets.buttonPadding = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.presets) {
                        this.props.presets = {};
                    }
                    this.props.presets.buttonPadding = val;
                }
            }
        },
        buttonFontSizeString: {
            get() {
                const defaultSize = 14; // eslint-disable-line no-magic-numbers
                const fontSize = this.props.presets?.buttonFontSize || { size: defaultSize, unit: 'px' };
                return `${fontSize.size}${fontSize.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.presets) {
                            this.props.presets = {};
                        }
                        this.props.presets.buttonFontSize = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.presets) {
                        this.props.presets = {};
                    }
                    this.props.presets.buttonFontSize = val;
                }
            }
        },
        buttonBorderRadiusString: {
            get() {
                const defaultSize = 4; // eslint-disable-line no-magic-numbers
                const borderRadius = this.props.presets?.buttonBorderRadius || { size: defaultSize, unit: 'px' };
                return `${borderRadius.size}${borderRadius.unit}`;
            },
            set(val) {
                if (typeof val === 'string') {
                    const match = val.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)$/);
                    if (match != null) {
                        if (!this.props.presets) {
                            this.props.presets = {};
                        }
                        this.props.presets.buttonBorderRadius = { size: parseFloat(match[1]), unit: match[2] };
                    }
                } else if (val != null && typeof val === 'object') {
                    if (!this.props.presets) {
                        this.props.presets = {};
                    }
                    this.props.presets.buttonBorderRadius = val;
                }
            }
        }
    },

    methods: {
        saveCellSize() {
            this.propChanged('calendar');
        },
        saveCellGap() {
            this.propChanged('calendar');
        },
        saveBorderWidth() {
            this.propChanged('calendar');
        },
        saveBorderRadius() {
            this.propChanged('calendar');
        },
        saveSelectedBorderWidth() {
            this.propChanged('selectedRange');
        },
        saveButtonPadding() {
            this.propChanged('presets');
        },
        saveButtonFontSize() {
            this.propChanged('presets');
        },
        saveButtonBorderRadius() {
            this.propChanged('presets');
        }
    }
};
</script>




