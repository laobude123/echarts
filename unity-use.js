// 可直接粘贴到 ECharts 官方示例编辑器运行
const hexToRgba = (hex,a)=>{const n=parseInt(hex.replace('#',''),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`};

const settings = {
  "labels": [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月"
  ],
  "series": [
    {
      "type": "bar",
      "name": "车辆",
      "data": [
        92,
        172,
        170,
        174,
        92,
        72,
        138
      ],
      "color": "#aeb9c5",
      "highlight": "#5cb8e7",
      "highlightIndex": 3
    },
    {
      "type": "line",
      "name": "行人",
      "data": [
        96,
        102,
        109,
        63,
        77,
        101,
        55
      ],
      "color": "#9dd8fb",
      "highlight": "#9dd8fb",
      "highlightIndex": -1
    }
  ],
  "ymax": 200,
  "interval": 50,
  "barWidth": 78,
  "lineWidth": 3,
  "fontSize": 22,
  "background": "#151c24"
};

function getOption(s){
    const bars=s.series.filter(x=>x.type==='bar'),barCount=Math.max(1,bars.length),series=[];
    s.series.forEach(item=>{
      if(item.type==='line'){
        series.push({name:item.name,type:'line',data:item.data,z:5,symbol:'none',lineStyle:{color:item.color,width:s.lineWidth,shadowBlur:5,shadowColor:hexToRgba(item.color,.45)},itemStyle:{color:item.color}});
        return;
      }
      const ordinal=bars.indexOf(item),width=s.barWidth/barCount;
      series.push({
        name:item.name,type:'custom',z:2,dimensions:['category','value'],encode:{x:0,y:1,tooltip:[1]},
        data:item.data.map((v,i)=>[i,v]),
        renderItem:(params,api)=>{
          const top=api.coord([api.value(0),api.value(1)]),bottom=api.coord([api.value(0),0]);
          const w=api.size([1,0])[0]*width/100,offset=(ordinal-(barCount-1)/2)*w*1.1;
          const x=top[0]+offset-w/2,y=top[1],h=Math.max(0,bottom[1]-top[1]);
          const c=params.dataIndex===item.highlightIndex?item.highlight:item.color;
          return{type:'group',children:[
            {type:'rect',shape:{x,y,width:w,height:h},style:{fill:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:hexToRgba(c,.68)},{offset:.2,color:hexToRgba(c,.42)},{offset:1,color:hexToRgba(c,.16)}]),stroke:'rgba(255,255,255,.035)',lineWidth:1}},
            {type:'rect',shape:{x,y:y-2,width:w,height:3},style:{fill:hexToRgba(params.dataIndex===item.highlightIndex?item.highlight:'#f5f7f9',.9),shadowBlur:5,shadowColor:hexToRgba(c,.4)}}
          ]};
        }
      });
    });
    return{animationDuration:500,backgroundColor:s.background,grid:{top:26,left:78,right:40,bottom:70},tooltip:{trigger:'axis',backgroundColor:'rgba(18,25,33,.94)',borderColor:'rgba(157,216,251,.45)',textStyle:{color:'#e8f3fa'},axisPointer:{type:'shadow',shadowStyle:{color:'rgba(255,255,255,.035)'}}},xAxis:{type:'category',data:s.labels,boundaryGap:true,axisLine:{lineStyle:{color:'#6d7780',width:2}},axisTick:{show:false},axisLabel:{color:'#d9dde1',fontSize:s.fontSize,fontWeight:600,margin:20},splitLine:{show:true,lineStyle:{color:'rgba(255,255,255,.025)'}}},yAxis:{type:'value',min:0,max:s.ymax,interval:s.interval,axisLine:{show:false},axisTick:{show:false},axisLabel:{color:'#d9dde1',fontSize:s.fontSize,fontWeight:600,margin:16},splitLine:{show:true,lineStyle:{color:'rgba(178,196,210,.18)',type:'dashed'}}},series}
  }

option = getOption(settings);
