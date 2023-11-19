<template>
  <v-app id="inspire">
    <!-- <v-system-bar app>
      <v-spacer></v-spacer>

      <v-icon>mdi-square</v-icon>

      <v-icon>mdi-circle</v-icon>

      <v-icon>mdi-triangle</v-icon>
    </v-system-bar> -->

    <v-app-bar app clipped-right flat height="72">
      <div>

      </div>

      <v-slide-group v-model="selectedShowingIndex" multiple show-arrows>
        <v-slide-item v-for="h in headers" :key="h" v-slot="{ active, toggle }">
          <v-btn class="mx-1" :input-value="active" active-class="purple white--text" depressed rounded @click="toggle">
            {{ h }}
          </v-btn>
        </v-slide-item>
      </v-slide-group>

      <!-- <v-spacer></v-spacer>

      <v-responsive max-width="156">
        <v-text-field dense flat hide-details rounded solo-inverted></v-text-field>
      </v-responsive> -->
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app width="250">
      <!-- <v-navigation-drawer v-model="drawer" absolute color="grey lighten-3" mini-variant>
        <v-avatar class="d-block text-center mx-auto mt-4" color="grey darken-1" size="36"></v-avatar>

        <v-divider class="mx-3 my-5"></v-divider>

        <v-avatar v-for="n in 6" :key="n" class="d-block text-center mx-auto mb-9" color="grey lighten-1" size="28"></v-avatar>
      </v-navigation-drawer> -->

      <!-- <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet> -->

      <v-list shaped>
        <!-- <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item> -->

        <!-- 展示导入的成绩表 -->
        <v-list-item v-for="(excel,idx) in excels" :key="excel.filename" link>
          <v-list-item-content>
            <v-list-item-title>{{excel.filename}}</v-list-item-title>
            <v-list-item-subtitle>
              <v-btn depressed plain @click="excelMove(idx,0)">
                上移
              </v-btn>
              <v-btn depressed plain @click="excelMove(idx,1)">
                下移
              </v-btn>
              <v-btn depressed plain @click="excelMove(idx,-1)">
                删除
              </v-btn>
            </v-list-item-subtitle>

          </v-list-item-content>
        </v-list-item>
        <v-list-item>

          <v-btn style="width: 100%;" rounded color="primary" dark @click="selectFile">
            <input multiple style="display: none;" type="file" ref="fileRef" accept=".xls,.xlsx" class="upload_file" @change="readExcel($event)" />
            添加成绩表
          </v-btn>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- <v-navigation-drawer app clipped right>
      <v-list>
        <v-list-item v-for="n in nameList" :key="n.stuNum||n.name" link>
          <v-list-item-content>
            <v-list-item-title>{{ n.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->

    <v-main style="padding: 0;margin: 0;">
      <!--  -->
      <!-- <div style="display: none;">{{ maxScore }}</div> -->
      <div v-show="selectedShowingIndex.length != 0">
        <div id="maxchart" style="width: 1200px;height:600px;"></div>
        <v-simple-table v-if="maxScore.length!=0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  科目
                </th>
                <th v-for="filename in maxScoreForTable(maxScore).filenames" :key="filename" class="text-left">
                  {{filename}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in maxScoreForTable(maxScore).scores" :key="item.subjectHeader">
                <td>{{item.subjectHeader}}</td>
                <td v-for="max in item.max" :key="max">{{max}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <hr>
        <div id="minchart" style="width: 1200px;height:600px;margin-top: 100px;"></div>
        <v-simple-table v-if="maxScore.length!=0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  科目
                </th>
                <th v-for="filename in maxScoreForTable(maxScore).filenames" :key="filename" class="text-left">
                  {{filename}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in maxScoreForTable(maxScore).scores" :key="item.subjectHeader">
                <td>{{item.subjectHeader}}</td>
                <td v-for="min in item.min" :key="min">{{min}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <hr>
        <div id="avgchart" style="width: 1200px;height:600px;margin-top: 100px;"></div>
        <v-simple-table v-if="avgScore.length!=0">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  科目
                </th>
                <th v-for="filename in avgForTable(avgScore).filenames" :key="filename" class="text-left">
                  {{filename}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in avgForTable(avgScore).scores" :key="item.subjectHeader">
                <td>{{item.subjectHeader}}</td>
                <td v-for="avg in item.avg" :key="avg">{{avg}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>

      <hr>
      <div id="avgradar" style="width: 1200px;height:600px;margin-top: 100px;"></div>
      <div style="display: none;">{{ avgRadar }}</div>

    </v-main>

    <!-- <v-footer
      app
      color="transparent"
      height="72"
      inset
    >
      <v-text-field
        background-color="grey lighten-1"
        dense
        flat
        hide-details
        rounded
        solo
      ></v-text-field>
    </v-footer> -->
  </v-app>
</template>

<script>
import XLXS from "xlsx";
// const maxChart = this.$echarts.init(document.getElementById("maxchart"));
import echarts from "echarts";
let maxChart,
  minchart,
  avgchart,
  avgradarchart = null;
export default {
  data: () => ({
    selectedShowingIndex: [],
    drawer: null,
    nameKey: "姓名",
    stuNumKey: "学号",
    excels: [],
  }),
  computed: {
    headers() {
      // 获取所有表的表头，要去重，如果遇到重复的，就在这个重复的前面加上它前一个元素的值，例如["语文","等级","数学","等级"]，就变成["语文","语文等级","数学","数学等级"]
      const headers = [];

      this.excels.forEach((excel) => {
        excel.header.forEach((header, index) => {
          if (headers.includes(header)) {
            return;
            // const preHeader = excel.header[index - 1];
            // headers.splice(index, 0, `${preHeader}${header}`);
          } else {
            headers.push(header);
          }
        });
      });

      return headers;
    },
    maxScore() {
      if (maxChart) {
        maxChart.clear();
      }
      if (minchart) {
        minchart.clear();
      }
      //flag=0表示要找最高分，flag=1表示要找最低分
      const maxScore = [];
      let subjectHeaders = [];
      //根据selectedShowingIndex找出要展示的科目
      this.selectedShowingIndex.forEach((index) => {
        subjectHeaders.push(this.headers[index]);
      });
      if (!maxChart || !minchart) {
        return [];
      }

      // console.log("subjectHeaders", subjectHeaders);

      //找出每个工作表的各科目最高分
      this.excels.forEach((excel, index) => {
        let tmp = {};
        subjectHeaders.forEach((subjectHeader) => {
          const subjectIndex = excel.header.indexOf(subjectHeader);
          // 数据预处理，把excel.exceldata中长度为0的数据过滤掉
          let ed = excel.exceldata.filter((row) => row.length != 0);
          const subjectScores = ed.map((row) => row[subjectIndex]);
          const max = Math.max(...subjectScores);
          const min = Math.min(...subjectScores);
          if (tmp.scoreArray) {
            tmp.scoreArray.push({ subjectHeader, max, min });
          } else {
            tmp.scoreArray = [{ subjectHeader, max, min }];
          }
        });
        tmp.filename = excel.filename;
        maxScore.push(tmp);
      });

      console.log("maxScore", maxScore, "maxChart", maxChart);
      //用echarts画折线图

      if (maxChart && this.selectedShowingIndex.length != 0) {
        // 获取所有科目的科目名(subjectHeader)，用于echarts的legend，去重
        let legendData = [];
        legendData = maxScore.map((item) => {
          return item.filename;
        });
        // maxScore
        //   .map((item) => {
        //     return item.scoreArray.map((score) => {
        //       return score.subjectHeader;
        //     });
        //   })
        //   .flat();
        // legendData = [...new Set(legendData)];
        console.log("legendData", legendData);

        const seriesData = maxScore.map((item) => {
          return {
            name: item.filename,
            type: "line",
            // stack: "Total",
            itemStyle: { normal: { label: { show: true } } },
            data: subjectHeaders.map((sh) => {
              return item.scoreArray.find((score) => score.subjectHeader === sh)
                .max;
            }),
          };
        });
        // subjectHeaders.map((sh) => {
        //   return {
        //     name: sh,
        //     type: "line",
        //     // stack: "Total",
        //     itemStyle: { normal: { label: { show: true } } },
        //     data: maxScore.map((item) => {
        //       return item.scoreArray.find((score) => score.subjectHeader === sh)
        //         .max;
        //     }),
        //   };
        // });
        const maxOption = {
          title: {
            text: "最高分折线图",
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                title: "保存为图片",
                name: "最高分折线图",
                excludeComponents: ["toolbox"],
                pixelRatio: 2,
              },
            },
          },
          legend: {
            show: true, //是否显示
            icon: "circle", //图例样式
            data: legendData, //图例内容
          },
          xAxis: {
            type: "category",
            // data: maxScore.map((item) => item.filename),
            data: subjectHeaders,
          },
          yAxis: {
            max: Math.max(...seriesData.map((item) => Math.max(...item.data))),
            min: Math.min(...seriesData.map((item) => Math.min(...item.data))),
            type: "value",
          },
          series: seriesData,
        };
        maxChart.setOption(maxOption);
        console.log("maxchart", { maxOption });

        const minSerialData = maxScore.map((item) => {
          return {
            name: item.filename,
            type: "line",
            // stack: "Total",
            itemStyle: { normal: { label: { show: true } } },
            data: subjectHeaders.map((sh) => {
              return item.scoreArray.find((score) => score.subjectHeader === sh)
                .min;
            }),
          };
        });
        // subjectHeaders.map((sh) => {
        //   return {
        //     name: sh,
        //     type: "line",
        //     // stack: "Total",
        //     itemStyle: { normal: { label: { show: true } } },
        //     data: maxScore.map((item) => {
        //       return item.scoreArray.find((score) => score.subjectHeader === sh)
        //         .min;
        //     }),
        //   };
        // });

        maxOption.series = minSerialData;
        maxOption.toolbox.feature.saveAsImage.name = "最低分折线图";
        maxOption.title.text = "最低分折线图";
        maxOption.yAxis.max = Math.max(
          ...minSerialData.map((item) => Math.max(...item.data))
        );
        maxOption.yAxis.min = Math.min(
          ...minSerialData.map((item) => Math.min(...item.data))
        );
        console.log("minchart", minSerialData);
        minchart.setOption(maxOption);
      }

      return maxScore;
    },

    avgScore() {
      if (avgchart) {
        avgchart.clear();
      }

      //找出每个工作表的各科目平均分
      const avgScore = [];
      let subjectHeaders = [];
      //根据selectedShowingIndex找出要展示的科目
      this.selectedShowingIndex.forEach((index) => {
        subjectHeaders.push(this.headers[index]);
      });
      if (!avgchart) {
        return [];
      }

      // console.log("subjectHeaders", subjectHeaders);

      this.excels.forEach((excel, index) => {
        let tmp = {};
        subjectHeaders.forEach((subjectHeader) => {
          const subjectIndex = excel.header.indexOf(subjectHeader);
          // 数据预处理，把excel.exceldata中长度为0的数据过滤掉
          let ed = excel.exceldata.filter((row) => row.length != 0);
          const subjectScores = ed.map((row) => row[subjectIndex]);
          const avg = (
            subjectScores.reduce((pre, cur) => pre + cur) / subjectScores.length
          ).toFixed(2);
          if (tmp.scoreArray) {
            tmp.scoreArray.push({ subjectHeader, avg });
          } else {
            tmp.scoreArray = [{ subjectHeader, avg }];
          }
        });
        tmp.filename = excel.filename;
        avgScore.push(tmp);
      });

      //条形图配置项
      const avgOption = {
        title: {
          text: "平均分条形图",
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              title: "保存为图片",
              name: "平均分条形图",
              excludeComponents: ["toolbox"],
              pixelRatio: 2,
            },
          },
        },
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ["科目", ...avgScore.map((item) => item.filename)],
            ...subjectHeaders.map((sh) => {
              return [
                sh,
                ...avgScore.map((item) => {
                  return item.scoreArray.find(
                    (score) => score.subjectHeader === sh
                  ).avg;
                }),
              ];
            }),
          ],
          // [
          //   ["product", "2015", "2016", "2017"],
          //   ["Matcha Latte", 43.3, 85.8, 93.7],
          //   ["Milk Tea", 83.1, 73.4, 55.1],
          //   ["Cheese Cocoa", 86.4, 65.2, 82.5],
          //   ["Walnut Brownie", 72.4, 53.9, 39.1],
          // ],
        },
        xAxis: { type: "category" },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: avgScore.map((item) => {
          return { type: "bar" };
        }),
        // [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
      };
      /* 
      option = {
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
          ]
        },
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
      };
      */

      avgchart.setOption(avgOption);

      console.log("avgOption", avgOption);

      // console.log("avgScore", avgScore);
      return avgScore;
    },

    avgRadar() {
      if (avgradarchart) {
        avgradarchart.clear();
      }
      let avg = this.avgScore;
      let subjectHeaders = [];
      //根据selectedShowingIndex找出要展示的科目
      this.selectedShowingIndex.forEach((index) => {
        subjectHeaders.push(this.headers[index]);
      });
      if (!avgradarchart||this.selectedShowingIndex.length==0) {
        return [];
      }
      let indicator = subjectHeaders.map((sh) => {
        //查找该科目的最大值
        return {
          name: sh,
          max: this.maxScore.map((item) => {
            return item.scoreArray.find((score) => score.subjectHeader === sh)
              .max;
          }),
          min: this.maxScore.map((item) => {
            return item.scoreArray.find((score) => score.subjectHeader === sh)
              .min;
          }),
        };
      });
      let avgdata = avg.map((item) => {
        return {
          value: item.scoreArray.map((score) => score.avg),
          name: item.filename,
        };
      });
      // const max = Math.max(...avgdata.map((item) => Math.max(...item.value)));
      // const min = Math.min(...avgdata.map((item) => Math.min(...item.value)));
      indicator = indicator.map((item) => {
        return {
          name: item.name,
          max: Math.max(...item.max),
          min: Math.min(...item.min),
          // max: max,
          // min: min,
        };
      });
      console.log("indicator", indicator);
      const avgRadarOption = {
        title: {
          text: "平均分雷达图",
        },
        tooltip: {},
        legend: {
          data: avg.map((item) => item.filename),
        },
        radar: {
          splitNumber: 10,
          // shape: 'circle',
          indicator: indicator,
        },
        series: [
          {
            name: "平均分雷达图",
            type: "radar",
            // areaStyle: {normal: {}},
            data: avgdata,
          },
        ],
      };
      /*
      option = {
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        //shape: 'circle',
        indicator: [
          { name: 'Sales', max: 6500 },
          { name: 'Administration', max: 16000 },
          { name: 'Information Technology', max: 30000 },
          { name: 'Customer Support', max: 38000 },
          { name: 'Development', max: 52000 },
          { name: 'Marketing', max: 25000 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: 'Allocated Budget'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: 'Actual Spending'
            }
          ]
        }
      ]
    };
      */
      avgradarchart.setOption(avgRadarOption);
      return avgRadarOption;
    },

    nameList() {
      //找到所有表中的姓名，要根据学号去重，如果没有学号，就根据姓名去重
      const nameList = [];
      this.excels.forEach((excel) => {
        const nameIndex = excel.header.indexOf(this.nameKey);
        const stuNumIndex = excel.header.indexOf(this.stuNumKey);
        excel.exceldata.forEach((row) => {
          const name = row[nameIndex];
          const stuNum = row[stuNumIndex];
          if (stuNum) {
            if (
              !nameList.find(
                (item) => item.name === name && item.stuNum === stuNum
              )
            ) {
              nameList.push({ name, stuNum });
            }
          } else {
            if (!nameList.find((item) => item.name === name)) {
              nameList.push({ name });
            }
          }
        });
      });
      return nameList;
    },
  },
  methods: {
    excelMove(index, up = 1) {
      //up=0表示上移，up=1表示下移,-1表示删除
      if (up===1) {
        if (index < this.excels.length - 1) {
          let tmp = this.excels[index];
          this.excels[index] = this.excels[index + 1];
          this.excels[index + 1] = tmp;
          this.selectedShowingIndex = [];
          this.$forceUpdate();
          console.log("down", this.excels);
        }
      } else if (up===0)
       {
        if (index > 0) {
          let tmp = this.excels[index];
          this.excels[index] = this.excels[index - 1];
          this.excels[index - 1] = tmp;
          this.selectedShowingIndex = [];
          this.$forceUpdate();
          console.log("up", this.excels);
        }
      }
      else if (up===-1)
      {
        this.excels.splice(index,1);
        this.selectedShowingIndex = [];
        this.$forceUpdate();
        console.log("delete", this.excels);
      }
      console.log("index", index, "up", up);
    },
    avgForTable(avg) {
      let subjectHeaders = [];
      //根据selectedShowingIndex找出要展示的科目
      this.selectedShowingIndex.forEach((index) => {
        subjectHeaders.push(this.headers[index]);
      });
      const avgForTable = {};
      avgForTable.filenames = avg.map((item) => item.filename);
      avgForTable.scores = subjectHeaders.map((sh) => {
        return {
          subjectHeader: sh,
          avg: avg.map((item) => {
            return item.scoreArray.find((score) => score.subjectHeader === sh)
              .avg;
          }),
        };
      });
      console.log("avgForTable", avgForTable);
      return avgForTable;
    },
    maxScoreForTable(maxScore) {
      let subjectHeaders = [];
      //根据selectedShowingIndex找出要展示的科目
      this.selectedShowingIndex.forEach((index) => {
        subjectHeaders.push(this.headers[index]);
      });
      const maxScoreForTable = {};
      maxScoreForTable.filenames = maxScore.map((item) => item.filename);
      maxScoreForTable.scores = subjectHeaders.map((sh) => {
        return {
          subjectHeader: sh,
          max: maxScore.map((item) => {
            return item.scoreArray.find((score) => score.subjectHeader === sh)
              .max;
          }),
          min: maxScore.map((item) => {
            return item.scoreArray.find((score) => score.subjectHeader === sh)
              .min;
          }),
        };
      });
      console.log("maxScoreForTable", maxScoreForTable);
      return maxScoreForTable;
    },

    selectFile() {
      this.$refs.fileRef.dispatchEvent(new MouseEvent("click"));
    },
    readExcel(e) {
      //获取文件，注意，可能是多个文件

      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (evt) => {
          const data = evt.target.result;
          const workbook = XLXS.read(data, { type: "binary", sheetStubs: true });
          const wsname = workbook.SheetNames[0];
          const ws = workbook.Sheets[wsname];
          // const dataParse = XLXS.utils.sheet_to_json(ws);
          const exceldata = XLXS.utils.sheet_to_json(ws, { header: 1 });
          const header = exceldata.shift();
          // console.log({ filename, header, exceldata });
          this.excels.push({ filename:file.name, header, exceldata });
        };
      }
      
      // const filename = e.target.files[0].name;
      // const file = e.target.files[0];
      // const reader = new FileReader();
      // reader.readAsBinaryString(file);
      // reader.onload = (evt) => {
      //   const data = evt.target.result;
      //   const workbook = XLXS.read(data, { type: "binary", sheetStubs: true });
      //   const wsname = workbook.SheetNames[0];
      //   const ws = workbook.Sheets[wsname];
      //   // const dataParse = XLXS.utils.sheet_to_json(ws);
      //   const exceldata = XLXS.utils.sheet_to_json(ws, { header: 1 });
      //   const header = exceldata.shift();
      //   // console.log({ filename, header, exceldata });
      //   this.excels.push({ filename, header, exceldata });

      //   /*
      //   数据示例
      //   {"filename":"九6班期中考成绩.xlsx","header":["姓名","语文","等级","数学","等级","英语","等级","物理","等级","化学","等级","政治","历史","政史","等级","体育","中考科目总分","年排","等级","A+个数","A个数","B+个数","B个数","C+个数","C个数"],"exceldata":[["陆柯霖",111,"A+",109,"A+",115,"A",95,"A",97,"A+",55,55,110,"A",58,695,20,"A+",3,3,0,0,0,0],["陆万瑜",102,"A",96,"B+",107.5,"A",91,"A",88,"B+",41,50,91,"B",60,635.5,159,"A",0,3,2,1,0,0]]}
      //   */
      // };
    },
  },
  mounted() {
    maxChart = echarts.init(document.getElementById("maxchart"));
    minchart = echarts.init(document.getElementById("minchart"));
    avgchart = echarts.init(document.getElementById("avgchart"));
    avgradarchart = echarts.init(document.getElementById("avgradar"));
    // this.maxScore();
  },
};
</script>