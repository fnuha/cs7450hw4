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

// plan: scroll pie charts to show change in demographic over time
// line chart of scores over time
// line plot 
// bar chart of newly published manga over time

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

    const slicegroup = svg.append("g");

    const info = svg.append("text")
        .attr("transform", `translate(${width * (- 0.6)}, 0)`)
        .text("Manga has spanned a large variety of genres across the decades, reflecting the tastes of readers at the time.");

    const info2 = svg.append("text")
        .attr("transform", `translate(${width * (- 0.6)}, 20)`)
        .text("Let's take a look at the ways its makeup has changed over time.");

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

    const bargroup = svg.append("g");



    function handleStepEnter(response) {
        const t = d3.transition().duration(400).ease(d3.easeCubicInOut);

        console.log(response.index);

        switch(response.index) {

            case 0:
                slices.transition(t).style("opacity", 0);
                labels.transition(t).style("opacity", 0);
                title.transition(t).style("opacity", 0);

                info.transition(t)
                    .text("Manga has spanned a large variety of genres across the decades, reflecting the tastes of readers at the time.");
                info2.transition(t)
                    .text("Let's take a look at the ways its makeup has changed over time.");

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
                    .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
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
                    .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
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
                    .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
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
                    .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
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
                    .text(function(d){ return (d.data[1] == 0 ? "" : d.data[0] )})
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
                    slices.style("opacity", 1)
                    .attr('d', arcGenerator);
                break;

            case 7:
                info.transition(t)
                    .text("(Work in progress!)");
                info2.transition(t)
                    .text("");

                labels.transition(t).style("opacity", 0);
                slices.transition(t).style("opacity", 0);
                title.transition(t).style("opacity", 0);
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

