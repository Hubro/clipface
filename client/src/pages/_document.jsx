import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
            rel="stylesheet"
          />

          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.8.2/css/bulma.min.css"
            integrity="sha256-qS+snwBgqr+iFVpBB58C9UCxKFhyL03YHpZfdNUhSEw="
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/tippy.js@6.2.7/dist/tippy.css"
            integrity="sha384-PmtXKEojFmNYlbhaz10b4YWCrwaniEa4hKxO7LkGAAzL/61Phd7ZkcM115K0ajRN"
            crossOrigin="anonymous"
          ></link>
          <link
            rel="stylesheet"
            href="https://unpkg.com/tippy.js@6.2.7/animations/shift-away-subtle.css"
            integrity="sha384-EW4QQ6r6xudVV1aSikRTm20kG3Rs0SqQMdtWh59xU7JvmZC1Ex/F7+sRNUq8Du67"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.0-2/css/all.min.css"
            integrity="sha256-46r060N2LrChLLb5zowXQ72/iKKNiw/lAmygmHExk/o="
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
