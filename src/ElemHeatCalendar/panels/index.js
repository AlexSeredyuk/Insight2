import { DremioPanelAsync } from '@goodt-common/dremio-panels';

const MetricSettingsPanel = () => import('./MetricSettingsPanel.vue');
const YearSettingPanelAsync = () => import('./YearSettingsPanel.vue');
const MonthSettingPanelAsync = () => import('./MonthSettingsPanel.vue');
const ActionsSettingsPanelAsync = () => import('./ActionsSettingsPanel.vue');
const SettingsPanelAsync = () => import('./SettingsPanel.vue');

export default [
    DremioPanelAsync,
    MetricSettingsPanel,
    YearSettingPanelAsync,
    MonthSettingPanelAsync,
    ActionsSettingsPanelAsync,
    SettingsPanelAsync
];
