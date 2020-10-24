function invest(startSumm, plt) {
    let a = startSumm;
    let b = plt;
    let startFor =  (1+(25/60)/100);
    startFor = Math.pow(startFor,60);
    startFor = (startFor - 1) / ((25/60)/100);
    toFor = 25/60/100* 1 + 1;
    thFor = (1+(25/60)/100)**60;
    finishFor = -(a-b) * thFor - b * toFor * startFor ;
    finishFor = finishFor * -1;
    addKesh = b * 59;
    upKesh = finishFor - (addKesh + a);
    return [finishFor, addKesh, upKesh];
}

function calcAndShow(){
    let startSumm = +document.querySelector('.onSumm').value;
    let plt = +document.querySelector('.toSumm').value;

    let [finishFor, addKesh, upKesh] = invest(startSumm, plt)
    document.querySelector('.profit').innerHTML = '<br>Вы заработали ' +finishFor
        +'<br> Дополнительно внесли ' +addKesh
        + '<br> Заработали на процентах ' +upKesh;
}