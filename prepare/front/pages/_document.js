import React from 'react';

import Document, {Html, Head, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from 'styled-components';

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet();
        const originalRenderPage = ctx.renderPage;

        try {
            ctx.renderPage= () => originalRenderPage({
                enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
            }); // styled-components SSR (documentation)
            const initialProps = await Document.getInitialProps(ctx);
            return {
                ...initialProps,
                styles : (
                    <>
                    {initialProps.styles}
                    {sheet.getStylesElement()}
                    </>
                ),
            };//_document.js basic form
        } catch (error) {
            console.error(error);
        } finally{
            sheet.seal();
        }
    }
    
    
    render() {
        <Html>
            <Head />
            <body>
                <Main />

                <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019%2Cdefault"/>
                <NextScript/>
            </body>

        </Html>
    }
}