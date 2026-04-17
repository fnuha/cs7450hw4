const width = window.innerWidth;
const height = window.innerHeight;
const padding = 6;

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
        .attr("transform", `translate(100, 100)`);

    let temp = d3.group(data, (d) => d.fromyear);
    const group2 = Array.from(temp, ([key, value]) => ({key, value}));

    group2.sort((a,b) => a.key - b.key);

    group1990 = {}
    categories.forEach((x) => {
        group1990[x] = d3.sum(group2[42].value, d => d[x]);
    });
    
    // https://d3-graph-gallery.com/graph/pie_basic.html
    
    // Create a color scale for the pie chart
    const pieColor = d3.scaleOrdinal()
        .domain(Object.keys(group1990))
        .range(d3.schemeSet2);
    
    // Create the pie chart visualization mapping our data values to the pie chart
    const pie = d3.pie();

    // Create the data for the pie chart
    const pieData1990 = pie(Object.values(group1990));

    console.log(pieData1990);

    // Creates the arc for the pie chart slice
    const arcGenerator = d3.arc()
        .innerRadius(0) 
        .outerRadius(100);

    const slicegroup = svg.append("g");

    // Create the individual slices for the pie chart
    const slices = slicegroup.selectAll("path")
        .data(pieData1990)
        .join("path")
        .attr('d', arcGenerator)
        .attr('fill', "blue")
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1);

})

