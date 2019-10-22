var PenguinPromise = d3.json("penguins/classData.json")

var cnt = 0;

var getInfo = function(penguin)
{
    var penInfo = {};
    penInfo.pic = penguin.picture;
    penInfo.quizmean = d3.mean(penguin.quizes.map(function(d) {return d.grade;}));
    penInfo.HWmean = d3.mean(penguin.homework.map(function (d) {return d.grade;}));
    penInfo.testmean = d3.mean(penguin.test.map(function (d) {return d.grade;}));
    penInfo.final = penguin.final[0].grade * 0.35 + penInfo.testmean * 0.3 +                           penInfo.quizmean * 0.2 + penInfo.HWmean * 0.15;
    penInfo.index = cnt++;
    return penInfo;
}

PenguinPromise.then(
    function(penguin)
    {
        var PenguinInfo = penguin.map(getInfo);
        console.log(PenguinInfo);
        makeHeader(PenguinInfo);
        drawTable(PenguinInfo);
        singleRow(PenguinInfo, penguin);
    },
    function (err)
    {
        console.log("fail", err);
    }
)

var makeHeader = function(PenguinInfo)
{
    sortCol(PenguinInfo, "#Quizmean", function (d) {return d.quizmean;});
    sortCol(PenguinInfo, "#HWmean", function (d) {return d.HWmean;});
    sortCol(PenguinInfo, "#testmean", function (d) {return d.testmean;});
    sortCol(PenguinInfo, "#final", function (d) {return d.final;});
}

var addCol = function(rows, txt)
{
    rows.append("td")
        .text(txt);
}

var sortCol = function(PenguinInfo, col, accessor)
{
    d3.select(col)
        .on("click", function()
        {
            PenguinInfo.sort(function(a, b)
            {
                return (accessor(a) - accessor(b));
            })
            drawTable(PenguinInfo);
        })
}

var singleRow = function(PenguinInfo, Original)
{
    d3.selectAll("tr")
        .on("click", function(d)
        {
            d3.selectAll("*").remove();
            d3.select("body").append("p").text("Hi");
        })
}

var drawTable = function (PenguinInfo)
{
    d3.selectAll("tbody *").remove();
    
    var rows = d3.select("tbody")
                .selectAll("tr")
                .data(PenguinInfo)
                .enter()
                .append("tr")
    
    rows.append("td")
        .append("img")
        .attr("src", function(penguin)
        {
            return "penguins/" + penguin.pic;
        })
    
    addCol(rows, function(penguin){return penguin.quizmean;})
    addCol(rows, function(penguin){return penguin.HWmean;})
    addCol(rows, function(penguin){return penguin.testmean;})
    addCol(rows, function(penguin){return penguin.final;})
}