import { ResumeSchema } from "./jsonresume";
import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";

import dotenv from "dotenv";
import {
    createMuiTheme,
    ServerStyleSheets,
    ThemeProvider,
} from "@material-ui/core";
import { dark, light } from "@material-ui/core/styles/createPalette";
import Layout from "./Layout";
import Resume from "./Resume";
dotenv.config();

export default function ({ data, environment }: any) {
    const theme = createMuiTheme({
        palette: light,
    });

    console.log(`Loading JSON Resume from ${process.env.RESUME_PATH}`);
    const file = fs.readFileSync(process.env.RESUME_PATH as string, "utf8");
    const resume: ResumeSchema = JSON.parse(file);

    const sheets = new ServerStyleSheets();
    const pageContents = (
        <ThemeProvider theme={theme}>
            <Resume resume={resume} print={true} />
        </ThemeProvider>
    );
    // I can only get the CSS after it is rendered so I have to render it twice
    ReactDOMServer.renderToString(sheets.collect(pageContents));

    return (
        <Layout
            css={sheets.getStyleElement()}
            html={pageContents}
            title={resume.basics?.name}
        />
    );
}
