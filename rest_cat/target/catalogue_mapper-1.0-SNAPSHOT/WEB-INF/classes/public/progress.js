function move() {
    if (checkInputs()) {

    }
    var innerHTML = window.location.href.split('/');
    innerHTML.pop();
    innerHTML = innerHTML.join('/');

    var elem = document.getElementById("myBar");
    var startButt = document.getElementById("startBtn");
    startButt.disabled = true;
    var width = 10;
    var id = setInterval(frame, 10);
    var catalogueURL = document.getElementById("cat_url").value;


    var mappingParams = getMappingParams();
    var mappingURL = mappingParams[0];
    var generator_url = mappingParams[1];

    var url = innerHTML + '/list_records/?catalogue_url=' + catalogueURL + '&limit=80';


    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);
    var numOfRec = 0;
    if (request.status === 200) {
        json = JSON.parse(request.responseText);
        numOfRec = json.length;
    }






    var mappingName = mappingURL.substring(mappingURL.lastIndexOf("/") + 1, mappingURL.lastIndexOf("."));
    console.log(mappingName)
    const convertURL = innerHTML + '/convert?catalogue_url=' + catalogueURL + '&mapping_url=' + mappingURL + '&generator_url=' + generator_url + '&limit=80';
    var request = new XMLHttpRequest();
    request.open('GET', convertURL, false);  // `false` makes the request synchronous
    request.send(null);


    var resultsURL = innerHTML + '/list_results/?mapping_name=' + mappingName + '&limit=80';
    var request = new XMLHttpRequest();
    request.open('GET', resultsURL, false);  // `false` makes the request synchronous
    request.send(null);

    var numOfRes = 0;
    if (request.status === 200) {
        json = JSON.parse(request.responseText);
        numOfRes = json.length;
    }

    var count = 0;
    function frame() {
        var startButt = document.getElementById("startBtn");
        startButt.disabled = true;

        var downloadBtn = document.getElementById("downloadBtn");
        downloadBtn.disabled = true;


        if (width >= 100) {
            clearInterval(id);
            document.getElementById("startBtn").disabled = false;
            done = false;
            currProgress = 0;
            var rec_loc = document.getElementById("rec_loc");
            if (rec_loc !== null) {
                rec_loc.href = window.location.protocol + '//' + window.location.hostname + '/' + mappingName;
                rec_loc.style.display = "inline";
            }
            downloadBtn.disabled = false;
            var source_rec_url = document.getElementById("source_rec_url");
            if (source_rec_url !== null) {
                source_rec_url.value = window.location.protocol + '//' + window.location.hostname + '/' + mappingName;
            }



        } else {
            if ((count % 10) === 0 || count <= 0) {
                var resultsURL = innerHTML + '/list_results/?mapping_name=' + mappingName;
                var request = new XMLHttpRequest();
                request.open('GET', resultsURL, false);  // `false` makes the request synchronous
                request.send(null);
                if (request.status === 200) {
                    json = JSON.parse(request.responseText);
                    numOfRes = json.length;
                }
            }
            width = Math.round((((numOfRes - 1) / 3) / numOfRec) * 100);
            elem.style.width = width + '%';
            elem.innerHTML = width * 1 + '%';
            count++;
        }
    }
}

function download() {
    var innerHTML = window.location.href.split('/');
    innerHTML.pop();
    innerHTML = innerHTML.join('/');

    var mappingParams = getMappingParams();
    var mappingURL = mappingParams[0];
    var generator_url = mappingParams[1];

    var mappingName = mappingURL.substring(mappingURL.lastIndexOf("/") + 1, mappingURL.lastIndexOf("."));
    var url = innerHTML + '/download/' + mappingName;

    var win = window.open(url, '_blank');
    win.focus();
}


function getMappingParams() {
    var mappingSelect = document.getElementById("mappingSelect").value;
    var mappingInt = parseInt(mappingSelect)
    var mappingURL = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/Mapping115.x3ml'
    var generator_url = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/CERIF-generator-policy-v5___21-08-2018124405___12069.xml'
    switch (mappingInt) {
        case 1:
            mappingURL = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/Mapping115.x3ml'
            generator_url = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/CERIF-generator-policy-v5___21-08-2018124405___12069.xml'
            break;
        case 2:
            mappingURL = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/Mapping120.x3ml'
            generator_url = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/ENVRIplus-generator-policy___13-07-2018131200___11511.xml'
            break;
        default:
            mappingURL = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/Mapping115.x3ml'
            generator_url = 'https://raw.githubusercontent.com/skoulouzis/eVRECatalogueIntegration/master/etc/CERIF-generator-policy-v5___21-08-2018124405___12069.xml'
    }
    return [mappingURL, generator_url];
}