$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('firstRun');
    if (myParam === 'true') {
        window.api.send("toMain", {action: "loadStartupSettings"});
    }
});

window.api.receive("fromMain", (data) => {
    $("#status").text(data);
});