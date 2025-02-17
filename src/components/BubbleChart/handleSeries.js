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
import { getColor, codeToRGB } from '../../util/color';
import cloneDeep from '../../util/cloneDeep';
import { getMarkLineDefault } from '../../option/config/mark';
import chartToken from './chartToken';
import merge from '../../util/merge';

export const seriesInit = {
  // 数据
  data: [],
  // 气泡图
  type: 'scatter',
  // 鼠标hover时显示label，并且其他legend变成灰色
  emphasis: {
    label: {
      show: true,
      color: '#ffffff',
      fontSize: 14,
      formatter(param) {
        return param.data[3];
      },
      position: 'top',
    },
  },
  // 气泡失去焦点时，配置样式
  blur:{},
  // 气泡样式
  itemStyle: {},
};

export function setSeries({ legendData, data, markLine, color, iChartOption }) {
  // 更改hover时显示的label颜色
  seriesInit.emphasis.label.color = chartToken.emphasisLabelColor;
  const series = [];
  legendData.forEach((legend, index) => {
    const seriesUnit = cloneDeep(seriesInit);
    const itemBorderColor = getColor(color, index);
    // 设置图元透明度
    const itemColor = codeToRGB(itemBorderColor, iChartOption.symbolOpacity || 0.2);
    // 阈值线
    if (markLine) {
      seriesUnit.markLine = getMarkLineDefault(true);
      if (markLine.y) {
        seriesUnit.markLine.data.push({ yAxis: markLine.y });
      }
      if (markLine.x) {
        seriesUnit.markLine.data.push({ xAxis: markLine.x });
      }
    }
    // 数据 / 数据名称
    seriesUnit.name = legend;
    seriesUnit.data = data[legend];
    seriesUnit.itemStyle = {
      color: itemColor,
      borderColor: itemBorderColor,
      borderWidth: 1,
    };
    series.push(seriesUnit);
  });
  return series;
}

// 添加seires属性
export function handleSeriesExtra(baseOpt, iChartOption) {
  const { symbol, symbolRotate, symbolOffset, cursor, label, itemStyle, blur, emphasis } = iChartOption;
  baseOpt.series.forEach(item => {
    item.symbol = symbol;
    item.symbolRotate = symbolRotate;
    item.symbolOffset = symbolOffset;
    item.cursor = cursor;
    item.label = label;
    merge(item.itemStyle, itemStyle);
    merge(item.blur, blur);
    merge(item.emphasis, emphasis);
  });
}
