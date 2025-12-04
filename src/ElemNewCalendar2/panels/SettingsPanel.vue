<template>
    <ui-panel-container>
        <ui-select class="p" prop="viewMode" :options="viewModeOptions">Режим просмотра</ui-select>
        <ui-select class="p" prop="inputMode" :options="inputModeOptions">Режим ввода</ui-select>
        <ui-input-cp class="p" prop="colors.selected">Цвет выделения</ui-input-cp>
        <ui-input-cp class="p" prop="colors.today">Цвет "Сегодня"</ui-input-cp>
        <ui-input-cp class="p" prop="colors.range">Цвет диапазона</ui-input-cp>
        
        <ui-switch class="p" prop="showPresets">Отображать пресеты</ui-switch>
        <ui-switch class="p" prop="enableDateRange">Выбор диапазона</ui-switch>
        <ui-switch class="p" prop="showWeekDays">Отображать дни недели</ui-switch>
        <ui-input class="p" prop="dateFormat">Формат даты (напр. DD-MM-YYYY)</ui-input>
    </ui-panel-container>
</template>

<script>
import { Panel } from '@goodt-wcore/core';

export default {
    extends: Panel,
    data() {
        return {
            $meta: { name: 'Настройки виджета', icon: 'cog' },
            viewModeOptions: [
                { value: 'day', label: 'День' },
                { value: 'week', label: 'Неделя' },
                { value: 'month', label: 'Месяц' },
                { value: 'year', label: 'Год' }
            ],
            inputModeOptions: [
                { value: 'single', label: 'Одиночный' },
                { value: 'range', label: 'Диапазон' },
                { value: 'manual', label: 'Ручной' }
            ]
        };
    }
};
</script>
