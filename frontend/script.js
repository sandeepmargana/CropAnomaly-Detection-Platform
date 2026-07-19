const API_URL = "http://127.0.0.1:8000/predict";

async function uploadImage() {

    const fileInput = document.getElementById("imageInput");
    const button = document.getElementById("uploadBtn");
    const loading = document.getElementById("loading");

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image.");
        return;
    }

    // Show uploaded image
    document.getElementById("originalImage").src =
        URL.createObjectURL(file);

    // Clear previous results
    document.getElementById("results").innerHTML = "";
    document.getElementById("summary").style.display = "none";
    document.getElementById("resultImage").src = "";

    loading.style.display = "block";
    button.disabled = true;
    button.innerHTML = "Analyzing...";

    const formData = new FormData();
    formData.append("file", file);

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        loading.style.display = "none";
        button.disabled = false;
        button.innerHTML = "Analyze Crop";

        if (!data.success) {

            alert("Prediction Failed");

            return;
        }

        document.getElementById("resultImage").src =
            data.annotated_image + "?t=" + new Date().getTime();

        createSummary(data);

        createTable(data.detections);

    }
    catch (err) {

        loading.style.display = "none";

        button.disabled = false;

        button.innerHTML = "Analyze Crop";

        console.log(err);

        alert("Backend not running.");
    }

}



function createSummary(data){

    const summary=document.getElementById("summary");

    summary.style.display="block";

    let highest=0;

    let cls="-";

    data.detections.forEach(d=>{

        if(d.confidence>highest){

            highest=d.confidence;

            cls=d.class;

        }

    });

    summary.innerHTML=`

    <h2>Detection Summary</h2>

    <br>

    <b>Total Objects :</b> ${data.total_detections}

    <br><br>

    <b>Highest Confidence :</b>

    ${highest}% (${cls})

    `;
}




function createTable(detections){

    let html="";

    html+="<h2 style='margin-bottom:20px;'>Detection Results</h2>";

    html+="<table>";

    html+="<tr>";

    html+="<th>#</th>";

    html+="<th>Detected Class</th>";

    html+="<th>Confidence</th>";

    html+="<th>Bounding Box</th>";

    html+="</tr>";

    detections.forEach((d,index)=>{

        let level="low";

        if(d.confidence>=70)

            level="high";

        else if(d.confidence>=40)

            level="medium";

        html+=`

        <tr>

        <td>${index+1}</td>

        <td>${d.class}</td>

        <td class="${level}">${d.confidence}%</td>

        <td>

        (${d.x1},

        ${d.y1})

        -

        (${d.x2},

        ${d.y2})

        </td>

        </tr>

        `;

    });

    html+="</table>";

    document.getElementById("results").innerHTML=html;

}