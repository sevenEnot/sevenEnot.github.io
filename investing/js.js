function number_format( number, decimals, dec_point, thousands_sep ) {	// Format a number with grouped thousands
    //
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +	 bugfix by: Michael White (http://crestidg.com)

    var i, j, kw, kd, km;

    // input sanitation & defaults
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
    //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
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

    let action = parseInt($('#action-list a.active').data('value'));

    let plt = +document.querySelector('.toSumm').value;

    let [finishFor, addKesh, upKesh] = invest(startSumm, plt, action)

    $('#itogSumm').text(moneyFormat(finishFor))

    let right = Math.max (upKesh / finishFor,0.2);
    let left = 1 - right;
    $('#bar-left').css('width', (left*100)+'%');
    $('#bar-right').css('width', (right*100)+'%');

    $('#bar-left').text(moneyFormat(addKesh + startSumm));
    $('#bar-right').text(moneyFormat(upKesh));


    // document.querySelector('.profit').innerHTML = '<br>Вы заработали ' +finishFor
       // +'<br> Дополнительно внесли ' +addKesh
       // + '<br> Заработали на процентах ' +upKesh;
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
} )

$('#action-list a').click(e => {
    e.preventDefault()
    $('#action-list a').removeClass('active');
    $(e.currentTarget).addClass('active');
    calcAndShow();
})
