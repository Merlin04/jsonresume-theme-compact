import { Chip, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { Email, GitHub, Link, LocationOn, Phone } from "@material-ui/icons";
import React from "react";
import { ResumeSchema } from "./jsonresume";

const usePrintStyles = makeStyles((theme) => ({
    pageContainer: {
        width: "8.5in",
        height: "11in",
        padding: "1em",
        // Debug
        border: "1px solid red",
    },
    mainPaper: {
        width: "100%",
        height: "100%",
    },
}));

const useWebStyles = makeStyles((theme) => ({
    pageContainer: {
        maxWidth: "8.5in",
        padding: "1em",
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: "0.8rem",
    },
    mainPaper: {
        width: "100%",
        height: "100%",
    },
}));

const useMainStyles = makeStyles((theme) => ({
    header: {
        display: "flex"
    },
    personalDetails: {
        textAlign: "right",
        flex: 1,
        alignSelf: "center"
    },
    detailsChip: {
        margin: theme.spacing(0.5)
    },
}));

interface ResumeProps {
    resume: ResumeSchema;
    print: boolean;
}

export default function (props: ResumeProps) {
    const variableStyles = props.print ? usePrintStyles() : useWebStyles();
    const styles = useMainStyles();

    const detailsChip = (icon: React.ReactElement, text: string | undefined) => {
        return (
            <>
                {text !== undefined && (
                    <Chip
                        icon={icon}
                        label={text}
                        variant="outlined"
                        className={styles.detailsChip}
                    />
                )}
            </>
        );
    };

    const resumeContents = (
        <>
            <div className={styles.header}>
                <div>
                    <Typography variant="h3">
                        {props.resume.basics?.name}
                    </Typography>
                    {props.resume.basics?.label !== undefined && (
                        <Typography variant="h5">
                            {props.resume.basics?.label}
                        </Typography>
                    )}
                </div>
                <div className={styles.personalDetails}>
                    {detailsChip(<Email />, props.resume.basics?.email)}
                    {detailsChip(<Phone />, props.resume.basics?.phone)}
                    {detailsChip(<Link />, props.resume.basics?.url)}
                    {detailsChip(<GitHub />, props.resume.basics?.profiles?.filter(item => item.network === "GitHub")[0].url)}
                    {detailsChip(<LocationOn />, props.resume.basics?.location?.region)}
                </div>
            </div>
            <Grid container>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={9}>
                    <Typography variant="h6">Work experience</Typography>
                    {props.resume.work?.map(item => (
                        <Paper>
                            <Typography>{item.name}</Typography>
                            <Typography>{item.description}</Typography>
                        </Paper>
                    ))}
                </Grid>
            </Grid>
        </>
    );

    return (
        <div className={variableStyles.pageContainer}>
            {props.print ? (
                <div className={variableStyles.mainPaper}>{resumeContents}</div>
            ) : (
                <Paper className={variableStyles.mainPaper}>
                    {resumeContents}
                </Paper>
            )}
        </div>
    );
}
