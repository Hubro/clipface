import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
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
            crossorigin="anonymous"
          ></link>
          <link
            rel="stylesheet"
            href="https://unpkg.com/tippy.js@6.2.7/animations/shift-away-subtle.css"
            integrity="sha384-EW4QQ6r6xudVV1aSikRTm20kG3Rs0SqQMdtWh59xU7JvmZC1Ex/F7+sRNUq8Du67"
            crossorigin="anonymous"
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
