import { Card, CardContent, Chip, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { CalendarToday, Email, GitHub, Link, LocationOn, Phone } from "@material-ui/icons";
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
    h7: {
        fontSize: "1.1rem",
        fontWeight: 450,
        display: "inline-block"
    },
    inlineDesc: {
        display: "inline-block",
        marginLeft: "0.5rem"
    },
    compactCard: {
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        "& .MuiCardContent-root": {
            padding: "0.5rem"
        }
    }
}));

interface ResumeProps {
    resume: ResumeSchema;
    print: boolean;
}

// This will probably work
function splitTextIntoColumns(items: string[], halfLineCutoff: number) {
    const itemLengths = items.map(item => Math.ceil(item.length/halfLineCutoff));
    const totalLength = itemLengths.reduce((p, c) => p + c) / 2;

    if(items.length === 2 && totalLength >= 2) {
        return [items];
    }

    let a: string[] = [];
    let b: string[] = [];

    const reduceFunction = (previous: number, current: number, index: number) => {
        if(index === 1) {
            previous = reduceFunction(0, itemLengths[0], 0);
        }
        if(previous + current <= totalLength) {
            a.push(items[index]);
        }
        else {
            b.push(items[index]);
        }
        return previous + current;
    };

    itemLengths.reduce(reduceFunction);

    return [a, b];    
}

export default function (props: ResumeProps) {
    const variableStyles = props.print ? usePrintStyles() : useWebStyles();
    const styles = useMainStyles();

    const DetailsChip = (cProps: {icon: React.ReactElement, text: string | undefined, small?: boolean}) => (
        <>
            {cProps.text !== undefined && (
                <Chip
                    icon={cProps.icon}
                    label={cProps.text}
                    variant="outlined"
                    size={cProps.small ? "small" : "medium"}
                    className={styles.detailsChip}
                />
            )}
        </>
    );

    const InlineTitleDesc = (cProps: {title: string | undefined, description: string | undefined}) => (
        <>
            <Typography className={styles.h7}>{cProps.title}</Typography>
            <Typography variant="body2" className={styles.inlineDesc}>{cProps.description}</Typography>
        </>
    );

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
                    <DetailsChip icon={<Email />} text={props.resume.basics?.email} />
                    <DetailsChip icon={<Phone />} text={props.resume.basics?.phone} />
                    <DetailsChip icon={<Link />} text={props.resume.basics?.url} />
                    <DetailsChip icon={<GitHub />} text={props.resume.basics?.profiles?.filter(item => item.network === "GitHub")[0].url} />
                    <DetailsChip icon={<LocationOn />} text={props.resume.basics?.location?.region} />
                </div>
            </div>
            <Grid container>
                <Grid item xs={3}>
                </Grid>
                <Grid item xs={9}>
                    <Typography variant="h6">Work experience</Typography>
                    {props.resume.work?.map(item => (
                        <Card variant="outlined" className={styles.compactCard}>
                            <CardContent>
                                <InlineTitleDesc title={item.name} description={item.position}/>
                                <DetailsChip icon={<LocationOn />} text={item.location} small={true}/>
                                <DetailsChip icon={<CalendarToday />} text={item.startDate + " - " + (item.endDate ?? "present")} small={true}/>
                                <Typography variant="body2">{item.summary}</Typography>
                                {item.highlights !== undefined && (
                                    <Grid container>
                                        {splitTextIntoColumns(item.highlights, 30).map(columnItems => (
                                            <Grid item xs>
                                                <ul>
                                                    {columnItems.map(item => (
                                                        <li>
                                                            <Typography variant="body2">{item}</Typography>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
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
