import dayjs from 'dayjs';

export const getDatesInRange = (startDate, endDate) => {
    const date = dayjs(startDate);
    const dates = [];
    let diff = dayjs(endDate).diff(date, 'day');

    if (diff < 0) return [];

    for (let i = 0; i <= diff; i++) {
        dates.push(date.add(i, 'day').format('YYYY-MM-DD'));
    }
    return dates;
};

export const getPresetRange = (preset) => {
    const today = dayjs();
    switch (preset) {
        case 'today':
            return [today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
        case 'yesterday':
            const yesterday = today.subtract(1, 'day');
            return [yesterday.format('YYYY-MM-DD'), yesterday.format('YYYY-MM-DD')];
        case 'last7days':
            return [today.subtract(6, 'day').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
        case 'last30days':
            return [today.subtract(29, 'day').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
        case 'lastMonth':
            const startLastMonth = today.subtract(1, 'month').startOf('month');
            const endLastMonth = today.subtract(1, 'month').endOf('month');
            return [startLastMonth.format('YYYY-MM-DD'), endLastMonth.format('YYYY-MM-DD')];
        case 'halfYear':
            return [today.subtract(6, 'month').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
        case 'year':
            return [today.subtract(1, 'year').format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
        default:
            return [today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')];
    }
};
