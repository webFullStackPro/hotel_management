import {AfterViewInit, Component} from '@angular/core';
import {SharedModule} from '../shared.module';
import * as echarts from 'echarts';

@Component({
  selector: 'chart',
  imports: [
    SharedModule
  ],
  templateUrl: './chart-list.component.html',
  standalone: true
})
export class ChartListComponent implements AfterViewInit {

  constructor(
  ) {}

  ngAfterViewInit(): void {
    this.displayChart1()
    this.displayChart2()
  }

  displayChart1() {
    const chartDom = document.getElementById('chart1');
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '销售额',
        subtext: '2010',
        left: 'center',
        top: 'top',
        textStyle: {
          fontSize: 20
        },
        subtextStyle: {
          fontSize: 14
        }
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [12320, 14300, 15550, 8230, 7530, 11220, 13130],
          type: 'bar'
        }
      ]
    };

    myChart.setOption(option);
  }

  displayChart2() {
    const chartDom = document.getElementById('chart2');
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: '入驻比例',
        subtext: '2010-07',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '考勤数据',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 24, name: '标准单人间' },
            { value: 6, name: '豪华单人间' },
            { value: 55, name: '标准双人间' },
            { value: 9, name: '豪华双人间' },
            { value: 4, name: '标准套房' },
            { value: 2, name: '豪华套房' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    myChart.setOption(option);
  }
}
