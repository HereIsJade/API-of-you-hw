var inputValue = null;
var month = ["Feb","Mar","Apr","May","Jun","Jul","Aug"];
var monthName = ["Feburary (news count: 150)","March (news count: 599)","April (news count: 588)","May (news count: 334)","June (news count: 338)","July (news count: 477)","August (news count: 177)"];

// when the input range changes update the value
d3.select("#timeslide").on("input", function() {
    update(+this.value);
});


function update(value) {
    document.getElementById("range").innerHTML=monthName[value];
    inputValue = month[value];
    console.log(monthName[value]);
    changeJson(inputValue);
    // d3.selectAll(".incident")
    //     .attr("fill", dateMatch);
}


var width = 1050,
    height = 700;


// var width = winWidth*0.7,
//     height = width*0.6;

var fill = d3.scale.category20();


d3.json('FebKW.json',function(data){
  var words=[]
  data.forEach(function(element){
    words.push({text:element.word,size:element.count,titles:element.titles,urls:element.urls})
  });
  // console.log(words);

  // font scale
  //array of count of each element in json file
  var arrCount = data.map(function(d){return d.count});
  console.log(arrCount);
  var fontScale = d3.scale.linear()
      .domain([d3.min(arrCount),d3.max(arrCount)])
      .range([30,90])

  d3.layout.cloud().size([width, height])
      .words(words)
      .padding(0)

      .font("Impact")
      .fontSize(function(d) { return fontScale(d.size); })
      .on("end", drawCloud)
      .start();
});



function drawCloud(words) {
    d3.select("#word-cloud").select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate("+(width / 2)+","+(height / 2)+")")
    .selectAll("text")
    .data(words)
    .enter().append("text")
    .style("font-size", function(d) { return d.size + "px"; })
    .style("font-family", "Impact")
    .style("fill", function(d, i) { return fill(i); })
    .attr("text-anchor", "middle")
    .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .text(function(d) { return d.text; });

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        //not d.size,  should be .count
        return "<strong>"+d.text+"</strong><br>"+"<strong> news count:</strong> <span style='color:red'>" + d.titles.length + "</span>";
      })
    // console.log(tip);
    var svg=d3.select("body").select("svg");
    svg.call(tip);
    //mouseover
    // svg.selectAll("text").on('mouseover',tip.show).on('mouseout', tip.hide);
    svg.selectAll("text").on({
          "mouseover": tip.show,
          "mouseout":  tip.hide,
          "click":  function(d) {
            $( "a" ).remove();
            $("br").remove();
            $("h4").remove();
            // var p=$( "<br><p>News reports with keyword "+d.text+" are listed below:"+"</p><br>" ).insertAfter( "#range" );
            // p.attr("id","intro");

             for(var i=0;i<=d.titles.length;i++){
               var infoP;
               if(i==0){
                 var h4=$( "<h4>News reports with keyword "+d.text+" are listed below:"+"</h4>" ).insertAfter( "#range" );
                 h4.attr("id","info");
                 infoP=$( "<a></a>" );
                  h4.after(infoP);
               }
               else{
                 infoP=$( "<a></a><br>" );
                 h4.after(infoP);
               }

               infoP.html(d.titles[i]);
               infoP.attr("href", d.urls[i]);
               infoP.attr("id", "info");
             }
            //  var infoP=$( "<p></p>" ).insertAfter( "#range" );
            //
            // //  infoDiv.attr('id','word-info');
            // //  infoDiv.offset({top: 200,left: 20});
            // //  infoDiv.attr('style',  'background-color:gray');
            // //  infoDiv.width(100);
            // //  infoDiv.height(400);
            // // //  div.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
            // // //  div.style.position = "absolute";
            // // //  div.style.left = "50px";
            // // //  div.style.top = "50px";
            // infoP.html(d.titles[0]);
           },
        });

}


function changeJson(month){
  //select new data
  d3.json(month+'KW'+'.json',function(data){
    var words=[]
    data.forEach(function(element){
      words.push({text:element.word,size:element.count,titles:element.titles,urls:element.urls})
    });

  console.log(words);

  // font scale
  //array of count of each element in json file
  var arrCount = data.map(function(d){return d.count});
  console.log(arrCount);
  var fontScale = d3.scale.linear()
      .domain([d3.min(arrCount),d3.max(arrCount)])
      .range([30,90])

  d3.select("svg").selectAll("g").remove();

  d3.layout.cloud().size([width, height])
      .words(words)
      .padding(0)

      .font("Impact")
      .fontSize(function(d) { return fontScale(d.size); })
      .on("end", drawCloud)
      .start();

});
}
