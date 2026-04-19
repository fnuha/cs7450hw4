const scroller = scrollama();
const width = window.innerWidth;
const height = window.innerHeight;
const padding = 6;
const radius = 200;

const GENRE_CSV = "archive/manga_genre_combined.csv";

function year(date) {
    const parser = d3.timeParse("%x");
    dateObject = parser(date);
    const reformatted = d3.utcFormat("%Y")

    return reformatted(dateObject);
}

function year2(date) {
    const parser = d3.timeParse("%Y");
    dateObject = parser(date);
    const reformatted = d3.utcFormat("%x")

    return reformatted(dateObject);
}

// plan: scroll pie charts to show change in demographic over time
// line chart of scores over time
// line plot 
// bar chart of newly published manga over time

// cited much of HW2/3 code, along with scrollytelling lab code

const cleanGenreCSV = d => {
    return {
        id: +d.id,
        title: d.title,
        chapters: +d.chapters,
        publishing: d.publishing,
        from: d.published_from,
        fromyear: year(d.published_from),
        to: d.published_to,
        score: +d.score,
        action: +d.Action,
        adventure: +d.Adventure,
        avantgarde: +d.Avant_Garde,
        awardwinning: +d.Award_Winning,
        bl: +d.Boys_Love,
        comedy: +d.Comedy,
        drama: +d.Drama,
        fantasy: +d.Fantasy,
        gl: +d.Girls_Love,
        gourmet: +d.Gourmet,
        horror: +d.Horror,
        mystery: +d.Mystery,
        romance: +d.Romance,
        scifi: +d.Sci_Fi,
        sol: +d.Slice_of_Life,
        sports: +d.Sports,
        spn: +d.Supernatural,
        sus: +d.Suspense,
        josei: +d.Josei,
        kids: +d.Kids,
        seinen: +d.Seinen,
        shoujo: +d.Shoujo,
        shounen: +d.Shounen

    }
}

const categories = ["action", 
        "adventure", 
        "avantgarde",
        "awardwinning",
        "bl",
        "comedy",
        "drama",
        "fantasy",
        "gl",
        "gourmet",
        "horror",
        "mystery",
        "romance",
        "scifi",
        "sol",
        "sports",
        "spn",
        "sus",
        "josei",
        "kids",
        "seinen",
        "shoujo",
        "shounen"]

d3.csv(GENRE_CSV, cleanGenreCSV).then(data => {

    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + 5 * width / 7 + "," + height / 2 + ")");

    let temp = d3.group(data, (d) => d.fromyear);
    const group2 = Array.from(temp, ([key, value]) => ({key, value}));

    group2.sort((a,b) => a.key - b.key);

    group1990 = new Map();
    categories.forEach((x) => {
        group1990.set(x, d3.sum(group2[42].value, d => d[x]));
    });

    group2000 = new Map();
    categories.forEach((x) => {
        group2000.set(x, d3.sum(group2[52].value, d => d[x]));
    });

    group2005 = new Map();
    categories.forEach((x) => {
        group2005.set(x, d3.sum(group2[57].value, d => d[x]));
    });

    group2010 = new Map();
    categories.forEach((x) => {
        group2010.set(x, d3.sum(group2[62].value, d => d[x]));
    });

    group2015 = new Map();
    categories.forEach((x) => {
        group2015.set(x, d3.sum(group2[67].value, d => d[x]));
    });

    group2020 = new Map();
    categories.forEach((x) => {
        group2020.set(x, d3.sum(group2[72].value, d => d[x]));
    });
    
    // https://d3-graph-gallery.com/graph/pie_basic.html
    
    // Create a color scale for the pie chart
    const pieColor = d3.scaleOrdinal()
        .domain(Object.keys(group1990))
        .range(d3.schemeSet2);

    // Create the pie chart visualization mapping our data values to the pie chart
    const pie = d3.pie()
        .value(d=>d[1]);

    // Create the data for the pie chart
    const pieData1990 = pie(group1990);
    const pieData2000 = pie(group2000);
    const pieData2005 = pie(group2005);
    const pieData2010 = pie(group2010);
    const pieData2015 = pie(group2015);
    const pieData2020 = pie(group2020);

    // Creates the arc for the pie chart slice
    const arcGenerator = d3.arc()
        .innerRadius(0) 
        .outerRadius(radius);

    const slicegroup = svg.append("g")
        .style("pointer-events", "none");

    // const info = svg.append("text")
    //     .attr("transform", `translate(${width * (- 0.6)}, 0)`)
    //     .text("Manga has spanned a large variety of genres across the decades, reflecting the tastes of readers at the time.");

    // const info2 = svg.append("text")
    //     .attr("transform", `translate(${width * (- 0.6)}, 20)`)
    //     .text("Let's take a look at the ways its makeup has changed over time.");
        
    // const info3 = svg.append("text")
    //     .attr("transform", `translate(${width * (- 0.6)}, 40)`)
    //     .text("");

    const title = svg.append("text")
        .attr("transform", `translate(${radius * -0.6}, ${radius * -1.5})`)
        .text("manga genre distribution in 1990")
        .attr("opacity", 0);

    // Create the individual slices for the pie chart
    const slices = slicegroup.selectAll("mySlices")
        .data(pieData1990)
        .join("path")
        .attr('d', arcGenerator)
        .attr('fill', d => pieColor(d))
        .attr("stroke", "white")
        .style("stroke-width", "1px")
        .style("opacity", 0);
    
    const labels = svg.selectAll('mySlices')
        .data(pieData1990)
        .enter()
            .append('text')
            .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
            .attr("transform", function(d) { 
                return `
                translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
            })
            .style("text-anchor", "middle")
            .style("font-size", 10)
            .style("opacity", 0);


    const linegroup = svg.append("g")
        .attr("transform", `translate(${width/8 * -1},${height / 2 * -1})`)
        .style("opacity", 0);

    let temp2 = d3.rollup(data, v=>d3.mean(v, (d) => d.score), d => d.fromyear);

    const lineData = Array.from(temp2, ([key, value]) => ({key, value}));

    lineData.sort((a,b) => a.key - b.key);
    minyear = (d3.min(lineData, d=>d.key));
    maxyear = (d3.max(lineData, d=>d.key));

    const lineXScale = d3.scaleTime()
        .range([0, width/4])
        .domain([minyear, maxyear]);

    const lineYScale = d3.scaleLinear()
        .range([3*height/4, 1*height/4])
        .domain([d3.min(lineData, d => d.value) - 0.25, d3.max(lineData, d => d.value) + 0.25]);

    linegroup.append("text")
        .text("Average score of manga published per year over time")
        .attr("transform", `translate(0, ${height / 4 - 20})`);

    linegroup.append("path")
      .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return lineXScale(d.key) })
            .y(d => lineYScale(d.value))
            );
    
    //https://www.geeksforgeeks.org/javascript/d3-js-axis-tickformat-function/
    linegroup.append("g")
        .attr("transform", "translate(0," + 3 * height/4 + ")")
        .call(d3.axisBottom(lineXScale).tickValues([1950,1960,1970,1980,1990,2000,2010,2020]).tickFormat((d,i) => [`1950`,`1960`,`1970`,`1980`,`1990`,`2000`,`2010`,`2020`][i]));
 
    linegroup.append("g")
        .call(d3.axisLeft(lineYScale).ticks(10));

    linegroup.append("text")
        .text("Year")
        .style("font-size", "12px")
        .attr("transform", `translate(${width/8}, ${4 * height / 5})`);
    
    linegroup.append("text")
        .text("Average score")
        .attr("transform", "rotate(90)")
        .attr("x", height/2)
        .attr("y", 40)
        .style("font-size", "12px")
        .attr("text-anchor", "start");

    bardata = new Map();
    categories.forEach((x) => {
        num = 0;
        value = 0;
        data.forEach((y) =>
        {      
            if (y[x] == 1) {
                num = num + 1;
                value = value + y.score;
            }
        });
        bardata.set(x, (value/num));
    });

    //https://www.geeksforgeeks.org/javascript/how-to-sort-a-map-in-javascript/
    const newMap = Array.from(bardata).sort((a, b) => a[1] - b[1]);
    sortedbardata = new Map(newMap);

    const bargroup = svg.append("g")
        .attr("transform", `translate(${width/8 * -1},${3 * height / 4 * -1})`)
        .style("opacity", 0);

    // make x scale using scaleband for discrete bands
    const barXScale = d3.scaleBand()
        .padding(0.4)
        .domain(sortedbardata.keys())
        .range([0, width/4]);

    // linear scale for y scale
    const barYScale = d3.scaleLinear()
        .range([3*height/4, 1*height/4])
        .domain([d3.min(sortedbardata, d => d[1]) - 0.25, d3.max(sortedbardata, d => d[1]) + 0.25]);

    // make rectangles
    const rects = bargroup.selectAll("rect")
        .data(sortedbardata)
        .join("rect")
        .attr("x", d => barXScale(d[0]))
        .attr("y", d => barYScale(d[1]) + (1*height/4))
        .attr("width", barXScale.bandwidth())
        .attr("height", d => ((3*height/4) - barYScale(d[1])))
        .attr("transform", "translate(0, 0)")
        .style("fill", "lightblue");

    bargroup.append("text")
        .text("Average score per genre")
        .attr("x", width/16)
        .attr("y", height/2);

    // add x axis
    bargroup.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(barXScale).tickPadding(1))
        .selectAll("text")
        // https://stackoverflow.com/questions/21187329/d3-rotate-x-axis-labels axis label rotation
        .attr("transform", "rotate(80)")
        .attr("text-anchor", "start")
        .attr("dx", "0.80em")
        .attr("dy", "-.15em");
    
    bargroup.append("text")
        .text("Average score")
        .attr("transform", "rotate(90)")
        .attr("x", 3*height/4)
        .attr("y", 40)
        .style("font-size", "12px")
        .attr("text-anchor", "start");

    bargroup.append("g")
        .attr("transform", `translate(${0}, ${1*height/4})`)
        .call(d3.axisLeft(barYScale).ticks(10));

    const scattergroup = svg.append("g")
        .attr("transform", `translate(${width/8 * -1},${3 * height / 4 * -1})`)
        .style("opacity", 0);

    // add title
    scattergroup.append("text")
        .attr("x", width / 4)
        .attr("y", 30) 
        .text("Dew Point vs. Pressure with Relation to Weather")
        .style("font-size", "18px")
        .style("fill", "darkblue");

    // y scale continuous
    const scatterYScale = d3.scaleLinear()
        .range([3*height/4, 1*height/4])
        .domain([5.0, 10.0]);

    // color scale ordinal for weather
    const scatterColor = d3.scaleOrdinal()
        .domain(["TRUE", "FALSE"])
        .range(["green","lightgrey"]);

    scatterdata = data.filter(function(d) {return d.publishing == "TRUE"})

    // create points
    const points = scattergroup.selectAll("circle")
        .data(scatterdata)
        .join("circle")
        .attr("cx", d => lineXScale(d.fromyear)) //scaling 
        .attr("cy", d => scatterYScale(d.score) + height/4)
        .attr("r", "4")
        .style("fill", "lightblue")
        // .style("fill", d => scatterColor(d.publishing))
        .style("stroke", "black")
        .style("stroke-weight", 0.2)
        .style("opacity", 0.5);
        // .style("opacity", function (d) {return d.publishing == "TRUE" ? 1 : 0.4});

    
    scattergroup.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(lineXScale).tickValues([1950,1960,1970,1980,1990,2000,2010,2020]).tickFormat((d,i) => [`1950`,`1960`,`1970`,`1980`,`1990`,`2000`,`2010`,`2020`][i]));


    scattergroup.append("g")
        .attr("transform", `translate(0,${height/4})`)
        .call(d3.axisLeft(scatterYScale).ticks(10));

    scattergroup.append("text")
        .text("Average score")
        .attr("transform", "rotate(90)")
        .attr("x", 3*height/4)
        .attr("y", 40)
        .style("font-size", "12px")
        .attr("text-anchor", "start");

    scattergroup.append("text")
        .text("Score vs. publication year")
        .attr("x", width/16)
        .attr("y", height/2);

    // lab 7 interactivity
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");


    slices
        .on("mouseover", (event, d) => 
        {
            tooltip
                .html(`<strong>${d.data[0]}</strong><br>New publications: ${d.data[1]}`)
                .classed("visible", true);

        })
        .on("mousemove", (event) => 
        {
            const pad = 15;
            tooltip
                .style("left", (event.pageX + pad) + "px")
                .style("top", (event.pageY + pad) + "px");
        })

        .on("mouseout", (event, d) => 
        {
            tooltip.classed("visible", false);
        });

    rects
        .on("mouseover", (event, d) => 
        {
            tooltip
                .html(`<strong>${d[0]}</strong><br>Average rating: ${d[1].toFixed(2)}`)
                .classed("visible", true);

        })
        .on("mousemove", (event) => 
        {
            const pad = 15;
            tooltip
                .style("left", (event.pageX + pad) + "px")
                .style("top", (event.pageY + pad) + "px");
        })

        .on("mouseout", (event, d) => 
        {
            tooltip.classed("visible", false);
        });

    points
        .on("mouseover", (event, d) => 
        {
            tooltip
                .html(`<strong>${d.title}</strong><br>Published in ${d.fromyear}<br>Rating: ${d.score}`)
                .classed("visible", true);

        })
        .on("mousemove", (event) => 
        {
            const pad = 15;
            tooltip
                .style("left", (event.pageX + pad) + "px")
                .style("top", (event.pageY + pad) + "px");
        })

        .on("mouseout", (event, d) => 
        {
            tooltip.classed("visible", false);
        });
    
    

    function handleStepEnter(response) {
        const t = d3.transition().duration(400).ease(d3.easeCubicInOut);

    
        bargroup.transition(t).style("opacity", response.index === 7 || response.index === 8 ? 1 : 0)
            .style("pointer-events", response.index === 7 || response.index === 8 ? "all" : "none");
        linegroup.transition(t).style("opacity", response.index === 9 ? 1 : 0)
            .style("pointer-events", response.index === 9 ? "all" : "none");
        scattergroup.transition(t).style("opacity", response.index === 10 ? 1 : 0)
        .style("pointer-events", response.index === 10 ? "all" : "none");

        slices.transition(t)
            .style("pointer-events", response.index >= 1 && response.index <= 6 ? "all" : "none");


        switch(response.index) {

            case 0:
                slices.transition(t).style("opacity", 0);
                labels.transition(t).style("opacity", 0);
                title.transition(t).style("opacity", 0);

                // info.transition(t)
                //     .text("Manga has spanned a large variety of genres across the decades, reflecting the tastes of readers at the time.");
                // info2.transition(t)
                //     .text("Let's take a look at the ways its makeup has changed over time.");

                title.transition(t).text("")    
                break;

            case 1:
                slices
                    .data(pieData1990);

                slices.transition(t)
                    .style("opacity", 1)
                    .attr('d', arcGenerator);

                labels
                    .data(pieData1990);

                title.transition(t)
                    .style("opacity", 1)
                    .text("manga genre distribution in 1990");

                labels.transition(t)
                    .style("opacity", 1)
                    .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
                    .attr("transform", function(d) { 
                        return `
                        translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                        rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                        ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
                    });
;

                info.transition(t)
                    .text("In the year 1990, comedy, drama and action dominated the scene.");
                info2.transition(t)
                    .text("This reflects the saturday-morning-cartoon origins of the genre.")
                
                break;

            case 2:
                slices
                    .data(pieData2000);

                slices.transition(t)
                    .attr('d', arcGenerator);
                
                labels
                    .data(pieData2000);

                title.transition(t)
                    .text("manga genre distribution in 2000");
                
                labels.transition(t)
                    .text(function(d){ return (d.data[1] <= 2 ? "" : d.data[0] )})
                    .attr("transform", function(d) { 
                        return `
                        translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                        rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                        ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
                    });

                info.transition(t)
                    .text("As the years progress, romance and drama both became more popular,");
                info2.transition(t)
                    .text("as did shoujo (manga targeted at young girls), reflecting a more diverse audience.");
                break;

            case 3:
                slices
                    .data(pieData2005);

                slices.transition(t)
                    .attr('d', arcGenerator);

                labels
                    .data(pieData2005);

                title.transition(t)
                    .text("manga genre distribution in 2005");
                
                labels.transition(t)
                    .text(function(d){ return (d.data[1] <= 6 ? "" : d.data[0] )})
                    .attr("transform", function(d) { 
                        return `
                        translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                        rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                        ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
                    });

                break;

            case 4:
                slices
                    .data(pieData2010);

                labels
                    .data(pieData2010);

                labels.transition(t)
                    .text(function(d){ return (d.data[1] <= 6 ? "" : d.data[0] )})
                    .attr("transform", function(d) { 
                        return `
                        translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                        rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                        ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
                    });

                title.transition(t)
                    .text("manga genre distribution in 2010");
                
                info.transition(t)
                    .text("As times shifted, LGBTQ romance genres such as");
                info2.transition(t)
                    .text("Boys' Love also became more popular.");

                slices.transition(t)
                    .attr('d', arcGenerator);
                break;

            case 5:
                slices
                    .data(pieData2015);

                labels
                    .data(pieData2015);
                
                labels.transition(t)
                    .text(function(d){ return (d.data[1] <= 6 ? "" : d.data[0] )})
                    .attr("transform", function(d) { 
                        return `
                        translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                        rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                        ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
                    });

                title.transition(t)
                    .text("manga genre distribution in 2015");
                
                info.transition(t)
                    .text("As of recent, fantasy has been growing...");
                info2.transition(t)
                    .text("");

                slices.transition(t)
                    .attr('d', arcGenerator);
                break;

            case 6:
                slices
                    .data(pieData2020);

                labels
                    .data(pieData2020);

                title.transition(t)
                    .style("opacity", 1)
                    .text("manga genre distribution in 2020");
                
                labels.transition(t)
                    .style("opacity", 1)
                    .text(function(d){ return (d.data[1] <= 4 ? "" : d.data[0] )})
                    .attr("transform", function(d) { 
                        return `
                        translate(${arcGenerator.centroid(d).map(function(x) {return x * 2.5})})
                        rotate(${((d.startAngle + d.endAngle) / 2 * 180 / Math.PI - 90)})
                        ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`;  
                    });

                info.transition(t)
                    .text("... to become the most popular genre for newly published manga in 2020.");
                info2.transition(t)
                    .text("");

                slices.transition(t)
                    .style("opacity", 1)
                    .attr('d', arcGenerator);
                break;
            
            case 7:
                labels.transition(t).style("opacity", 0);
                slices.transition(t).style("opacity", 0);
                title.transition(t).text("");

                rects.transition(t).style("fill", "lightblue");
                break;


            case 8:
                const hightlightedgenres = ["romance", "comedy", "fantasy", "action"];
                info.transition(t)
                    .text("Despite that, they end up middling in terms of average score,");
                info2.transition(t)
                    .text("perhaps due to oversaturation of the genre.");

                rects.transition(t).style("fill", function(d){return hightlightedgenres.includes(d[0]) ? "red" : "lightblue"});
                break;

            case 9:
                info.transition(t)
                    .text("However, despite the increasing quantity of manga published each year, average ratings from");
                info2.transition(t)
                    .text("readers in recent decades have improved and stabilized from the early days of manga!");
                info3.transition(t)
                    .text("");

                break;

            case 10:
                info.transition(t)
                    .text("This stabilization may actually be because of the quantity of newly published manga, as recent");
                info2.transition(t)
                    .text("years show a larger range of scores amongst publications, which may have balanced fluctuations");
                info3.transition(t)
                    .text("in average scores per year overall.");

                break;

            case 11:
                info.transition(t)
                    .text("Despite it all, the larger range of scores indicates the overall growth of the manga industry,");
                info2.transition(t)
                    .text("as more manga authors are given greenlights to pursue their series and explore new ideas.");
                info3.transition(t)
                    .text("More diverse titles can only mean good things for a creative industry.");
                break;
        }
    }

    scroller
        .setup({ step: ".step", offset: 0.5, debug: false })
        .onStepEnter(handleStepEnter);

    window.addEventListener("resize", () => {
        svg.attr("width", window.innerWidth).attr("height", window.innerHeight);
        scroller.resize();
    });



})

