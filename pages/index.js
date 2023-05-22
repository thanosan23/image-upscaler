import { UploadDropzone } from "react-uploader"
import { Uploader } from "uploader"

import { useState } from "react";

import Image from "next/image";

import { ThreeDots } from "react-loader-spinner";
import Head from "next/head";

const uploader = Uploader({ apiKey: "free" });

export default function Home() {

  const options = {
    styles: { colors: { primary: "#000" } },
    mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
    maxFileCount: 1
  };
  
  const [ originalPhoto, setOriginalPhoto ] = useState(null);
  const [ newPhotoLoading, setNewPhotoLoading ] = useState(null);
  const [ newPhoto, setNewPhoto ] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
    <Head>
      <title>Image Upscaler</title>
    </Head>
    <main>
      <div className={"p-5 pt-10 flex flex-col justify-center align-middle text-center"}>
        <h1 className={"font-bold text-5xl"}>Image Upscaler</h1>
        <p className={"py-10 text-lg"}>Want to make an image bigger while preserving fine details? Use our image upscaling tool powered by AI!</p>
      </div>
      <div>
        <div className={"flex justify-center"}>
          <UploadDropzone
            uploader={uploader}
            options={options}
            onUpdate={async (file) => {
              if (file.length != 0) {
                setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));

                setLoading(true);
                const res = await fetch("/api/generate", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ imageUrl: file[0].fileUrl.replace("raw", "thumbnail") }),
                });
                let newPhoto = await res.json();
                setLoading(false);

                setNewPhoto(newPhoto);
              }
            }}
            width="670px"
            height="250px"
          />
        </div>
  
      <div className={"flex flex-row p-5"}>
        <div className={"pr-5"}>
        {originalPhoto && (
          <Image
            alt="original photo"
            src={originalPhoto}
            className="rounded-2xl"
            width={275}
            height={275}
          />
        )}
        </div>
        <div className={"px-5"}>
        {newPhoto && (
            <Image
              alt="new photo"
              src={newPhoto}
              className="rounded-2xl relative sm:mt-0 mt-2 cursor-zoom-in"
              width={275}
              height={275}
              onLoadingComplete={() => setNewPhotoLoading(false)}
            />
          )}
          {(loading || newPhotoLoading ) && (
            <ThreeDots
              height="80" 
              width="80" 
              radius="9"
              color="black" 
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          )}
        </div>
      </div>
    </div>
    </main>
    </>
  )
}
