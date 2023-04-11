const fastify = require("fastify")();
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const PORT = process.env.PORT || 7676;


fastify.register(require("@fastify/view"),{engine:{ejs: require("ejs")}});
fastify.register(require('@fastify/formbody'))
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
})

const seasonInWords = {0:'', 1:'الاول', 2:"الثاني", 3: "الثالث", 4: "الرابع", 5: "الخامس", 6: "السادس", 7: "السابع", 8: "الثامن", 9: "التاسع", 10: "العاشر", 11 : "الحادي-عشر"};
const epiInWords = {0:'', 1:'الاولى', 2:"الثانية", 3: "الثالثة", 4: "الرابعة", 5: "الخامسة", 6: "السادسة", 7: "السابعة", 8: "الثامنة", 9: "التاسعة", 10: "العاشرة", 11 : "الحادية-عشر"};


fastify.get("/", (req, res) => {
    res.view("/views/index.ejs");
});



fastify.get("/TV-shows/:name/:season/:epiNum",async (req, res) => {
    const {name} = req.params;
    const regexName = name.split(/[,:!\s#_@()]+/).join("-")
    const {epiNum} = req.params; 
    //const {epiNumText} = req.params;
    const {season} = req.params;


    //series
    try {
        await sendRequest(`https://wecima.tube/watch/مشاهدة-مسلسل-${regexName}-موسم-${season}-حلقة-${epiNum}/`)
    } catch (error) {

        //movies
        try {
            await sendRequest(`https://wecima.tube/watch/مشاهدة-فيلم-${regexName}-مترجم/`)
        } catch (error) {

            //anime
            try {
                await sendRequest(`https://wecima.tube/watch/مشاهدة-انمي-${regexName}-موسم-${season}-حلقة-${epiNum}/`)
            } catch (error) {

                // defrrent url for anime
                try {
                    await sendRequest(`https://wecima.tube/watch/مشاهدة-انمي-${regexName}-حلقة-${epiNum}/`)
                } catch (error) {
                    
                    //res.type("text/html").status(201).send("<h1>404 episode is not uploaded yet</h1>")
                    res.send({"message" : "404 episode not fond :("})
                }
            }
        }
    }
    
    


    // function to get shows whatching servers
    async function sendRequest(url){
        
        console.log("^".repeat(30), url);
        const response = await axios.get(url);
        const {data} = await response;
        const $ = cheerio.load(data);
        //ul.WatchServersList ul li:nth-child(2) btn
        let server = [];
        //const server = $("ul.WatchServersList ul li:contains('uqload.com') btn").attr("data-url").replace('\n', "");

        server.push({"server 1" : $("ul.WatchServersList ul li:first btn").attr("data-url").replace('\n', "")});    
        server.push({"server 2" : $("ul.WatchServersList ul li:last btn").attr("data-url").replace('\n', "")});
        server.push({"server 3": $("ul.WatchServersList ul li:contains('uqload.com') btn").attr("data-url").replace('\n', "")});
        server.push({"server 4" : $("ul.WatchServersList ul li:nth-child(2) btn").attr("data-url").replace('\n', "")});    
        console.log("eeeeeeeeee", server)
          //`<iframe src="${server}" allowfullscreen style="width:100%; height:100%; border-style:none;"></iframe>`  
        res.send(server);
    }
});




;(async() => {
    try {
        fastify.listen({ port : PORT}, console.log(`listening on port =./> ${PORT}`));
    } catch (error) {
        console.log(error);
    }
})()




// if the function of getting the episodes does not works try this one :


// try {
    //     const url = `https://weciima.makeup/watch/مشاهدة-مسلسل-${name.split(" ").join("-")}-موسم-${season}-حلقة-${epiNum}/`
    //     console.log("^".repeat(30), url);
    //     //https://ciimaclub.click/watch/مسلسل-${name.split(" ").join("-")}-الموسم-${seasonInWords[season]}-الحلقة-${epiNum}-${epiInWords[epiNum]}/
    //     //`https://shahed4u.mobi/watch/مسلسل-${name.split(" ").join("-")}-الموسم-${seasonInWords[season]}-الحلقة-${epiNum}-${epiInWords[epiNum]}-مترجمة`
    //     const response = await axios.get(url);
    //     const {data} = await response;
    //     const $ = cheerio.load(data);
    //     const server = $("ul.WatchServersList ul li:nth-child(6) btn").attr("data-url");        
    //     console.log("eeeeeeeeee", server)
    //     //const iframe = new Buffer(server, 'base64').toString('ascii');
    //     res.type("text/html").send(`<iframe src=${server} allowfullscreen style="width:100%; height:100%; "></iframe>`)

    // } catch (error) {
    //     try {
            
    //         const url = `https://weciima.makeup/watch/مشاهدة-فيلم-${name.split(" ").join("-")}-مترجم/`
    //         const response = await axios.get(url);
    //         const {data} = await response;
    //         const $ = cheerio.load(data);
    //         console.log("^".repeat(30), url);

    //         const server = $("ul.WatchServersList ul li:nth-child(2) btn").attr("data-url");            //const server  = $("ul[class='servers flex-start list-unstyled'] li").attr("data-code");
            
    //         console.log("eeeeeeeeee", server)
    //         //const iframe = new Buffer(server, 'base64').toString('ascii');
    //         //console.log('\n'.repeat(4), iframe)
    //         res.type("text/html").send(`<iframe src=${server} allowfullscreen style="width:100%; height:100%; "></iframe>`)         
    //     } catch (error) {
            
    //         console.log("axios response error : ", error.response);
    //         res.send("404 episode not found")
    //     }
    // }