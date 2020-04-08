

window.onload = function () {
    document.getElementById('reg').onclick = function () {
        let login = document.getElementById("login").value;
        let pass = document.getElementById('pass').value;

        if (login == '123' && pass == '321')
            alert('corect');
        else
            alert('no corect');
    };
};