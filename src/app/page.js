"use client";
import Image from "next/image";
import { useState } from "react";
export default function Home() {

  const[summary, setSummary] = useState("");

function onFileChange(event){
  const file = event.target.files[0];
  const fileReader = new FileReader();
  fileReader.onload = onLoadFile;
  fileReader.readAsArrayBuffer(file);
  
}
//when the file is actually read
function onLoadFile(event) {
  const typedarray = new Uint8Array(event.target.result);

  pdfjsLib.getDocument({data: typedarray }).promise.then((pdf) => {
    console.log("loaded pdf:", pdf.numPages)


    pdf.getPage(1).then((page)=>{

      page.getTextContent().then((content) =>{
        let text="";
        content.items.forEach((item)=>{
          text += item.str + " ";
        });

        //console.log("text:", text);
      sendToAPI(text);
      })
    })
  })
}


function sendToAPI(text){
  fetch("/api",{
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({text})
  }).then((response) =>{
    return response.json();
  }).then((data) =>{

    setSummary(data.summary)
    console.log("response",data);
  })
}
  return (
  <>
    <h2>Upload Resume</h2>
    <input
     type="file"
     id="file"
     name="file"
     onChange={onFileChange}
     accept=".pdf" />

     <p>{summary}</p>
  </>
  );
}
