/**
 * Copyright (c) 2024 - present OpenTiny HUICharts Authors.
 * Copyright (c) 2024 - present Huawei Cloud Computing Technologies Co., Ltd.
 *
 * Use of this source code is governed by an MIT-style license.
 *
 * THE OPEN SOURCE SOFTWARE IN THIS PRODUCT IS DISTRIBUTED IN THE HOPE THAT IT WILL BE USEFUL,
 * BUT WITHOUT ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR
 * A PARTICULAR PURPOSE. SEE THE APPLICABLE LICENSES FOR MORE DETAILS.
 *
 */
// 处理第二种数据且有标定值的sum和max
const setChildMax = (data, max) => {
    data.forEach(dataItem => {
        if (dataItem.children) {
            dataItem.children.forEach(child => {
                child.max = max;
            });
        } else {
            dataItem.max = max;
        }
    });
};

// 处理第一种数据且无标定值的sum和max
const setNoChildDefaultMax = (data, angleAxis, fill) => {
    data.forEach(dataItem => {
        // data中的value是数值类型，处理数据
        if (!dataItem.children) {
            let sum = 0;
            data.forEach(item => {
                sum += item.value;
            });
            // 当数据全为0时，手动设置sum和max使其不为0，避免视图丢失
            if (sum === 0) {
                sum = 1;
            }
            angleAxis.max = (sum * 4) / 3;
            angleAxis.sum = sum;
            if (fill) {
                angleAxis.max = sum;
            }
        }
    });
};

// 处理第二种数据且无标定值的sum和max
const setChildDefaultMax = (data, angleAxis, fill) => {
    data.forEach(dataItem => {
        if (dataItem.children) {
            let sum = 0;
            data.forEach(item => {
                item.children.forEach(item_ => {
                    sum += item_.value;
                });
            });
            // 当数据全为0时，手动设置sum和max使其不为0，避免视图丢失
            if (sum === 0) {
                sum = 1;
            }
            angleAxis.sum = sum;
            angleAxis.max = (sum * 4) / 3;
            if (fill) {
                angleAxis.max = sum;
            }
        }
    });
};

/**
 * 此函数两部分作用：（1）根据data和max,将数据分为四种数据类型，分类处理angleAxis的sum和max值
 * （2）根据用户传入的formatter，配置极坐标系文本
 * @param {*} iChartOption
 * @param {*} baseOpt
 */
const handleLabelFormatter = (iChartOption, baseOpt) => {
    let { max, data, fill = false, type = 'base' } = iChartOption;
    const { angleAxis } = baseOpt;
    if (type === 'process') {
        fill = true;
    }
    // 有标定值
    if (max) {
        // 第一种数据类型
        angleAxis.sum = max;
        angleAxis.max = max * 4 / 3;
        // 第二种数据类型
        setChildMax(data, max);
        if (fill) {
            angleAxis.max = max;
        }
    }
    // 无标定值
    else {
        if (type === 'process') {
            angleAxis.max = 100;
            angleAxis.sum = 100;
        } else if (type === 'base') {
            // 第一种数据类型
            setNoChildDefaultMax(data, angleAxis, fill);
        } else {
            // 第二种数据类型
            setChildDefaultMax(data, angleAxis, fill);
        }
    }

    /**
     * 处理显示文本:根据用户传入的formatter，配置极坐标系文本
     * 传入"percent"或者未传，展示百分比
     * 传入"number",展示纯数值
     * 传入函数，用户自定义展示内容
     */
    let formatter = angleAxis.axisLabel.formatter;
    const defaultFormatter = (params) => `${(params / angleAxis.sum * 100).toFixed(0)}%`;
    switch (formatter) {
        case 'percent':
            formatter = defaultFormatter;
            break;
        case 'number':
            formatter = undefined;
            break;
        case undefined:
            formatter = defaultFormatter;
            break;
    }
    if (type === 'process') {
        angleAxis.axisLabel.show = false;
        angleAxis.axisTick.show = false;
        return;
    }
    angleAxis.axisLabel.formatter = formatter;
    // 使用customValues属性(echarts5.5.1以上版本才支持)将刻度均分为5份。
    const customValues = [0];
    const interval = angleAxis.splitNumber || 5;
    const averageVal = angleAxis.sum / interval;
    for (let i = 0; i < interval; i++) {
        customValues.push(customValues[customValues.length - 1] + averageVal);
    }
    angleAxis.axisTick.customValues = customValues;
    angleAxis.axisLabel.customValues = customValues;
};

export { handleLabelFormatter };