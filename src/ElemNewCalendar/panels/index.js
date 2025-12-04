const SettingsPanelAsync = () => import('./SettingsPanel.vue');
const DateInputPanelAsync = () => import('./DateInputPanel.vue');
const DrilldownPanelAsync = () => import('./DrilldownPanel.vue');
const StylePanelAsync = () => import('./StylePanel.vue');

export default [
    SettingsPanelAsync,
    DateInputPanelAsync,
    DrilldownPanelAsync,
    StylePanelAsync
];


