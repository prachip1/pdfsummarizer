"use client";
import Image from "next/image";
import { useState } from "react";
export default function Home() {

  const[summary, setSummary] = useState("");
  const[showCopy, setShowCopy] = useState(false);
  const[buttonText, setButtonText] = useState("COPY");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
    setLoading(false);
    setSummary(data.summary)
    setShowCopy(true);
  
    //console.log("response",data);
  })
}

function copyThis (){
  navigator.clipboard.writeText(summary).then(() => {
    alert("Summary copied to clipboard!");
    setButtonText("COPIED");
   
  }).catch((err) => {
    console.error("Failed to copy: ", err);
  });

}
  return (
  <div className="flex flex-col justify-center items-center w-full mt-44">
    <h2 className="text-5xl font-bold mb-12">AI PDF Summarizer 🤖</h2>
   <div>
   <input
     type="file"
     id="file"
     name="file"
     onChange={onFileChange}
     accept=".pdf" />
   </div>
   
   <div>
   {loading ? (<div className="flex justify-center items-center mt-14 text-green-300"><h2 className="text-3xl">Please Wait.... </h2> </div>):  
   
   
   (<div className="mt-12 pt-12 pb-12 pr-24 pl-24 mb-6">
    
    <p className="text-indigo-200 font-regular">{summary}</p>
 
    </div> )} 
    </div>
    
     {showCopy &&  <button className="bg-slate-800 p-4 rounded-md" onClick={copyThis}>{buttonText}</button>}
    
  </div>
  );
}
