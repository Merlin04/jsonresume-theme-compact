import React from "react";

interface LayoutProps {
    html: React.ReactNode;
    css: React.ReactNode;
    title: string | undefined;
}

export default function (props: LayoutProps) {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
                <title>{props.title}</title>
                {props.css}
            </head>
            <body style={{margin: 0}}>{props.html}</body>
        </html>
    );
}
