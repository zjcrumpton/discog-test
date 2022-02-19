import Head from "next/head";
import { useState } from "react";
import axios from "axios";

import dynamic from "next/dynamic";

const BarcodeReader = dynamic(() => import("react-qr-barcode-scanner"), {
  ssr: false,
});

export default function Home() {
  const [data, setData] = useState("No Result");
  const [visible, setVisible] = useState(false);
  const [album, setAlbum] = useState({ title: "No Album Found", src: "" });

  const [list, setList] = useState([]);

  const handleScan = (data, error) => {
    if (data) {
      console.log(data);
      setData(data);
    }

    if (!error) {
      setVisible(false);
    }
  };

  const handleError = (err) => {
    console.log(err);
  };

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Scan a Record or CD Barcode</h1>
        <button onClick={() => setVisible(true)}>Scan</button>
        {visible && (
          <BarcodeReader
            facingMode="user"
            onUpdate={async (err, result) => {
              console.log("literally anything");
              if (!err) {
                setData(result.text);
                setVisible(false);
                const res = await axios.get(
                  `https://api.discogs.com/database/search?barcode=${result.text}&key=vCufLsasVPLodegWeGhm&secret=xDeFGgerdGQhFdxSYnDKGLkuVTRjGBsh`
                );

                const srcUrl = res.data.results[0].master_url;
                const imageRes = await axios.get(
                  srcUrl +
                    "?key=vCufLsasVPLodegWeGhm&secret=xDeFGgerdGQhFdxSYnDKGLkuVTRjGBsh"
                );
                const imageSrc = imageRes.data.images[0].uri;
                const title = imageRes.data.title;

                setList([...list, { title, src: imageSrc }]);
              }
            }}
            // onUpdate={(err, result) => {
            //   if (result) setData(result.text);
            // }}
            width={500}
            height={500}
          />
        )}

        <div style={{ display: "flex", gap: 20 }}>
          {list.map((nextAlbum) => {
            return (
              <div style={{ width: 200, height: 200, fontSize: 10 }}>
                <img height={200} width={200} src={nextAlbum.src}></img>
                <h1>{nextAlbum.title}</h1>
              </div>
            );
          })}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
