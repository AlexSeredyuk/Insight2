<template>
    <ui-panel-container>
        <ui-has-panel class="p">
            <ui-checkbox v-model="props.switch.enabled" @change="propChanged('switch')">
                Вывод переключателей
            </ui-checkbox>

            <template #panel>
                <ui-select
                    class="p"
                    :options="alignOptions"
                    v-model="props.switch.align"
                    @change="propChanged('switch')">
                    Выравнивание
                </ui-select>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input-cp v-model="props.switch.color" @change="propChanged('switch')">
                            Цвет текста
                        </ui-input-cp>
                    </template>
                    <template #right>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.switch.fontSize"
                            @change="propChanged('switch')">
                            Размер текста
                        </ui-input-units>
                    </template>
                </ui-has-two-columns>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input v-model="props.switch.fontWeight" @change="propChanged('switch')">
                            Плотность текста
                        </ui-input>
                    </template>
                    <template #right>
                        <ui-select
                            :options="FontStyleOptions"
                            v-model="props.switch.fontStyle"
                            @change="propChanged('switch')">
                            Стиль текста
                        </ui-select>
                    </template>
                </ui-has-two-columns>
                <ui-has-two-columns class="p">
                    <template #left>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.switch.marginLeft"
                            @change="propChanged('switch')">
                            Отступ слева
                        </ui-input-units>
                    </template>
                    <template #right>
                        <ui-input-units
                            :units="SizeUnits"
                            v-model="props.switch.marginRight"
                            @change="propChanged('switch')">
                            Отступ справа
                        </ui-input-units>
                    </template>
                </ui-has-two-columns>
                <ui-panel
                    class="p"
                    :groups="[
                        { name: 'Преф. иконка', slot: 'prefixIcon' },
                        { name: 'Пост. иконка', slot: 'postfixIcon' }
                    ]">
                    <template #prefixIcon>
                        <div class="d-flex p">
                            <ui-input-units
                                class="w-50 mar-right-5"
                                :units="SizeUnits"
                                v-model="props.switch.prefixIcon.width"
                                @change="propChanged('switch')">
                                Ширина
                            </ui-input-units>
                            <ui-input-units
                                class="w-50"
                                :units="SizeUnits"
                                v-model="props.switch.prefixIcon.height"
                                @change="propChanged('switch')">
                                Высота
                            </ui-input-units>
                        </div>

                        <ui-input-units
                            class="p"
                            :units="SizeUnits"
                            v-model="props.switch.prefixIcon.fontSize"
                            @change="propChanged('switch')">
                            Размер шрифта
                        </ui-input-units>
                        <ui-input-cp class="p" v-model="props.switch.prefixIcon.color" @change="propChanged('switch')">
                            Цвет иконки
                        </ui-input-cp>
                        <ui-input-cp
                            class="p"
                            v-model="props.switch.prefixIcon.background"
                            @change="propChanged('switch')">
                            Фон иконки
                        </ui-input-cp>

                        <ui-input-units
                            class="p"
                            :units="SizeUnits"
                            v-model="props.switch.prefixIcon.borderRadius"
                            @change="propChanged('switch')">
                            Скругление углов
                        </ui-input-units>
                        <ui-input v-model="props.switch.prefixIcon.boxShadow" @change="propChanged('switch')">
                            Тень
                        </ui-input>
                    </template>

                    <template #postfixIcon>
                        <div class="d-flex p">
                            <ui-input-units
                                class="w-50 mar-right-5"
                                :units="SizeUnits"
                                v-model="props.switch.postfixIcon.width"
                                @change="propChanged('switch')">
                                Ширина
                            </ui-input-units>
                            <ui-input-units
                                class="w-50"
                                :units="SizeUnits"
                                v-model="props.switch.postfixIcon.height"
                                @change="propChanged('switch')">
                                Высота
                            </ui-input-units>
                        </div>

                        <ui-input-units
                            class="p"
                            :units="SizeUnits"
                            v-model="props.switch.postfixIcon.fontSize"
                            @change="propChanged('switch')">
                            Размер шрифта
                        </ui-input-units>
                        <ui-input-cp class="p" v-model="props.switch.postfixIcon.color" @change="propChanged('switch')">
                            Цвет иконки
                        </ui-input-cp>
                        <ui-input-cp
                            class="p"
                            v-model="props.switch.postfixIcon.background"
                            @change="propChanged('switch')">
                            Фон иконки
                        </ui-input-cp>
                        <ui-input-units
                            class="p"
                            :units="SizeUnits"
                            v-model="props.switch.postfixIcon.borderRadius"
                            @change="propChanged('switch')">
                            Скругление углов
                        </ui-input-units>
                        <ui-input v-model="props.switch.postfixIcon.boxShadow" @change="propChanged('switch')">
                            Тень
                        </ui-input>
                    </template>
                </ui-panel>
            </template>
        </ui-has-panel>

        <ui-switch class="p" v-model="props.gradientActive" @change="propChanged('gradientActive')">
            Градиентная окраска
        </ui-switch>

        <ui-input-cp class="p" v-model="props.gradientMinColor" @change="propChanged('gradientMinColor')">
            Цвет минимума
        </ui-input-cp>
        <ui-input-cp class="p" v-model="props.gradientMaxColor" @change="propChanged('gradientMaxColor')">
            Цвет максимума
        </ui-input-cp>

        <ui-has-panel class="p">
            <span class="form-label form-label-small">Правила для покраски по условию</span>

            <template #panel>
                <p class="mar-bot-2">Правила:</p>
                <hr class="mar-bot-4" />
                <div :style="{ overflowY: 'auto', maxHeight: '16rem', height: '16rem' }">
                    <div v-if="props.rules.length === 0">
                        <p class="form-label form-label-small">Пока правил нет</p>
                    </div>
                    <div
                        v-else
                        v-for="(rule, idx) in props.rules"
                        :key="idx"
                        class="row row-gap-3"
                        :class="{ 'mar-bot-4': props.rules.length - 1 !== idx }">
                        <ui-input class="col col-3-12" v-model="rule.from" @change="propChanged('rules')">От</ui-input>
                        <ui-input class="col col-3-12" v-model="rule.to" @change="propChanged('rules')">До</ui-input>
                        <ui-input-cp class="col col-4-12" v-model="rule.background" @change="propChanged('rules')">
                            Цвет
                        </ui-input-cp>
                        <div class="col col-2-12">
                            <div class="form-label text-truncate form-label-xsmall">Удалить</div>
                            <ui-button class="mar-right-1" @click="deleteRule(idx)" icon>
                                <i class="mdi mdi-delete"></i>
                            </ui-button>
                        </div>
                    </div>
                </div>

                <ui-button @click="addRule">Добавить правило</ui-button>
            </template>
        </ui-has-panel>

        <ui-input v-model="props.fontFamily" @change="propChanged('fontFamily')">Шрифт</ui-input>
    </ui-panel-container>
</template>
<script>
import { Panel, Panels } from '@goodt-wcore/core';

/**
 * @typedef {import('../types/SettingsPanel').TInstance} TInstance
 * @type {TInstance}
 */
const ComponentInstanceTypeDescriptor = undefined;

const { SizeUnits, FontStyleOptions } = Panels;

export default {
    extends: Panel,
    static: {
        SizeUnits,
        FontStyleOptions,
        alignOptions: [
            { label: 'слева', value: 'flex-start' },
            { label: 'по центру', value: 'center' },
            { label: 'справа', value: 'flex-end' }
        ]
    },
    data: () => ({
        /** @public */
        $meta: { name: 'Настройки виджета', icon: 'cog-outline' },
        ...ComponentInstanceTypeDescriptor
    }),
    methods: {
        addRule() {
            this.props.rules.push({ from: '', to: '', background: '' });
            this.propChanged('rules');
        },
        deleteRule(idx) {
            this.props.rules.splice(idx, 1);
            this.propChanged('rules');
        }
    }
};
</script>
