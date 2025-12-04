<template>
    <w-panel>
        <ui-container>
            <div class="form-label form-label-small">Режим выбора дат</div>
            <ui-select
                prop="selectionMode"
                :options="selectionModeOptions"
                @change="propChanged('selectionMode')">
                Режим выбора
            </ui-select>

            <ui-divider></ui-divider>

            <ui-select prop="dateFormat" :options="dateFormatOptions" @change="propChanged('dateFormat')">
                Формат отображения дат
            </ui-select>

            <ui-input prop="fontFamily" @change="propChanged('fontFamily')">
                Шрифт
            </ui-input>

            <ui-divider></ui-divider>

            <ui-switch prop="presetsEnabled" @change="propChanged('presetsEnabled')">
                Включить пресеты
            </ui-switch>

            <ui-select
                v-if="props.presetsEnabled"
                prop="presetsMode"
                :options="presetsModeOptions"
                @change="propChanged('presetsMode')">
                Режим отображения пресетов
            </ui-select>

            <ui-divider></ui-divider>

            <ui-switch prop="drilldownEnabled" @change="propChanged('drilldownEnabled')">
                Включить drill-down
            </ui-switch>
        </ui-container>
    </w-panel>
</template>

<script>
import { Panel } from '@goodt-wcore/panel';
import { PRESETS_MODES, DATE_FORMATS, SELECTION_MODE_OPTIONS } from '../constants';

export default {
    extends: Panel,

    meta: { name: 'Настройки', icon: 'settings' },

    data() {
        return {
            selectionModeOptions: SELECTION_MODE_OPTIONS,
            presetsModeOptions: [
                { label: 'Кнопки', value: PRESETS_MODES.BUTTONS },
                { label: 'Выпадающий список', value: PRESETS_MODES.DROPDOWN },
                { label: 'Оба', value: PRESETS_MODES.BOTH }
            ],
            dateFormatOptions: [
                { label: 'YYYY-MM-DD', value: DATE_FORMATS['YYYY-MM-DD'] },
                { label: 'DD.MM.YYYY', value: DATE_FORMATS['DD.MM.YYYY'] },
                { label: 'MM/DD/YYYY', value: DATE_FORMATS['MM/DD/YYYY'] },
                { label: 'DD/MM/YYYY', value: DATE_FORMATS['DD/MM/YYYY'] }
            ]
        };
    }
};
</script>


