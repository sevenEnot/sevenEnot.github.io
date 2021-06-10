function number_format( number, decimals, dec_point, thousands_sep ) {
    var i, j, kw, kd, km;

    if( isNaN(decimals = Math.abs(decimals)) ){
        decimals = 2;
    }
    if( dec_point == undefined ){
        dec_point = ",";
    }
    if( thousands_sep == undefined ){
        thousands_sep = ".";
    }
    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
    if( (j = i.length) > 3 ){
        j = j % 3;
    } else{
        j = 0;
    }
    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
    return km + kw + kd;
}

function moneyFormat (x){
    return number_format(x,0,",", "\u00A0")+ "\u00A0руб."
}


function invest(startSumm, plt, action) {
    let a = startSumm;
    let b = plt;
    let startFor =  (1+(action/60)/100);
    startFor = Math.pow(startFor,60);
    startFor = (startFor - 1) / ((action/60)/100);
    let toFor = action/60/100* 1 + 1;
    let thFor = (1+(action/60)/100)**60;
    let finishFor = -(a-b) * thFor - b * toFor * startFor ;
    finishFor = finishFor * -1;
    let addKesh = b * 59;
    let upKesh = finishFor - (addKesh + a);
    return [Math.floor(finishFor), addKesh, upKesh];
}

function calcAndShow(){
    let startSumm =  parseInt($('#onSumm').val().replace(/[^0-9]/gmu, ''));
    if (isNaN(startSumm) || startSumm <= 0){
        return
    }
    let plt =  parseInt($('#toSumm').val().replace(/[^0-9]/gmu, ''));
    if (isNaN(plt) || plt <= 0){
        return
    }

    let action = parseInt($('#action-list a.active').data('value'));


    let [finishFor, addKesh, upKesh] = invest(startSumm, plt, action)
    $('#itogSumm').text(moneyFormat(finishFor))

    let right = Math.max (upKesh / finishFor,0.2);
    let left = 1 - right;
    $('#bar-left').css('width', (left*100)+'%');
    $('#bar-right').css('width', (right*100)+'%');

    $('#bar-left').text(moneyFormat(addKesh + startSumm));
    $('#bar-right').text(moneyFormat(upKesh));
}



$('#onSumm').on("input", function (e) {
    calcAndShow();
});
$('#btn-group-on').click(e => {
    const btn = $(e.target);
    const text = btn.text();
    $('#btn-group-on .active').removeClass('active');
    btn.addClass('active');
    $('#onSumm').val(text);
    calcAndShow();
} );



$('#toSumm').on('input', function (e){
    calcAndShow();
});
$('#btn-group-to').click(e =>{
    const btn = $(e.target);
    const text = btn.text();
    $('#btn-group-to .active').removeClass('active');
    btn.addClass('active');
    $('#toSumm').val(text);
    calcAndShow();
});


$(document).ready( function () {
    document.getElementById('apple').click();
});

$('#action-list a').click(e => {
    e.preventDefault()
    $('#action-list a').removeClass('active');
    $(e.currentTarget).addClass('active');
    const symbol = $(e.currentTarget).data('symbol');
    showApplPrice(symbol);
    calcAndShow();
})



async function getApplePrice(symbol) {
    const data = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=NT245F19SG1IMLOG`).then( res => res.json() )
    const time = data["Time Series (Daily)"];
    const dates = Object.keys(time);
    dates.sort( (a,b) => b.localeCompare(a) );
    const last = dates[0];
    const dayPrice = time[last];
    return dayPrice['4. close'];
}


function showApplPrice(symbol) {
    const node = document.querySelector('#summAction');
    node.innerText = "Сейчас акция стоит: ...loading...";
    getApplePrice(symbol)
        .then(price => {
            const lastPrise = parseFloat(price) * 72.2;
            node.innerText = "Сейчас акция стоит: " +  lastPrise.toFixed(2) + "  руб";
        })
        .catch(e => {
            console.log("Loading apple error", e)
            node.innerText = "Сейчас акция стоит: не удалось загрузить";
        })
}


var canvas = document.getElementById('myChart');
var data = {
    labels: ['2016', '2017', '2018', '2019', '2020'],
    datasets: [
        {
            label: 'Динамика роста за 5 лет',
            fill: false,
            borderColor: "rgb(4,123,254)",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "white",
            pointRadius: 5,
            data: [5, 10, 11, 17, 19],
        }
    ]
};

function adddata(){
    let action = parseInt($('#action-list a.active').data('value'));
    myLineChart.data.datasets[0].data[5] = action;
    myLineChart.data.labels[5] = "2020";
    myLineChart.update();
    calcAndShow();
}

var option = {
    showLines: true

};

var myLineChart = Chart.Line(canvas,{
    data:data,
    options:option
});

