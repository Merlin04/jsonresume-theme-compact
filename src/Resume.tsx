import { Card, CardContent, Chip, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { CalendarToday, Email, GitHub, Grade, Link, LocationOn, Phone } from "@material-ui/icons";
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
    mainGrid: {
        marginTop: "0.5rem"
    },
    detailsChip: {
        margin: theme.spacing(0.5)
    },
    h7: {
        fontSize: "1.1rem",
        fontWeight: 450,
        display: "inline"
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
        },
        "& ul": {
            marginTop: "0.25rem",
            marginBottom: 0
        }
    },
    inline: {
        display: "inline"
    },
    tinyChip: {
        height: "18px",
        "& .MuiChip-label": {
            fontSize: "0.7rem"
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

    // TODO: make this work for all lengths - check if length of longest column is greater than totalLength (I think?)
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

function startAndEndDateFormat(startDate: string | undefined, endDate: string | undefined) {
    return (startDate === undefined) ? undefined : (
        startDate === endDate ? startDate : (
            startDate + " - " + (endDate ?? "present")
        )
    );
}

enum Size {
    Small,
    Tiny
}

export default function (props: ResumeProps) {
    const variableStyles = props.print ? usePrintStyles() : useWebStyles();
    const styles = useMainStyles();

    const DetailsChip = (cProps: {icon: React.ReactElement | undefined, text: string | undefined, size?: Size}) => (
        <>
            {cProps.text !== undefined && (
                <Chip
                    icon={cProps.icon}
                    label={cProps.text}
                    variant="outlined"
                    size={cProps.size === Size.Small || cProps.size === Size.Tiny ? "small" : "medium"}
                    className={styles.detailsChip + (cProps.size === Size.Tiny ? " " + styles.tinyChip : "")}
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

    const DescriptionBulletPoints = (cProps: {items: string[] | undefined}) => (
        <>
            {cProps.items !== undefined && (
                <Grid container>
                    {splitTextIntoColumns(cProps.items, 30).map(columnItems => (
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
        </>
    );

    const SectionHeader = (cProps: {children: React.ReactNode}) => (
        <Typography variant="h6" className={styles.h7}>{cProps.children}</Typography>
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
            {/*props.resume.skills?.map(item => (
                <>
                    <Typography variant="body2" className={styles.inlineDesc}>{item.name}</Typography>
                    {item.keywords?.map(keyword => (
                        <Typography variant="body2" className={styles.inlineDesc}>|{keyword}</Typography>
                    ))}
                </>
            ))*/}
            {props.resume.skills !== undefined && props.resume.skills.flatMap(item => item.keywords).map(item => (
                <DetailsChip icon={undefined} text={item} size={Size.Tiny}/>
            ))}
            <Grid container spacing={1} className={styles.mainGrid}>
                <Grid item xs={3}>
                    {/* Other less important or shorter details go here */}
                    {props.resume.basics?.summary !== undefined && (
                        <Typography variant="body2">{props.resume.basics.summary}</Typography>
                    )}
                    {props.resume.education !== undefined && (
                        <>
                            <SectionHeader>Education</SectionHeader>
                            {props.resume.education.map(item => (
                                <Card variant="outlined" className={styles.compactCard}>
                                    <CardContent>
                                        <InlineTitleDesc title={item.institution} description={item.studyType}/>
                                        <DetailsChip icon={<CalendarToday />} text={startAndEndDateFormat(item.startDate, item.endDate)} size={Size.Small}/>
                                        <DetailsChip icon={<Grade />} text={item.score} size={Size.Small}/>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                    {props.resume.volunteer !== undefined && (
                        <>
                            <SectionHeader>Volunteering</SectionHeader>
                            {props.resume.volunteer.map(item => (
                                <Card variant="outlined" className={styles.compactCard}>
                                    <CardContent>
                                        <Typography className={styles.h7}>{item.organization}</Typography>
                                        <Typography variant="body2">{item.summary}</Typography>
                                        {!props.print && item.highlights !== undefined && (
                                            <ul>
                                                {item.highlights.map(highlight => {
                                                    <li><Typography variant="body2">{highlight}</Typography></li>
                                                })}
                                            </ul>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                    {props.resume.awards !== undefined && (
                        <>
                            <SectionHeader>Awards</SectionHeader>
                            {props.resume.awards.map(item => (
                                <Card variant="outlined" className={styles.compactCard}>
                                    <CardContent>
                                        <Typography className={styles.h7}>{item.title}</Typography>
                                        <br/>
                                        <Typography variant="body2" className={styles.inline}>{item.awarder}</Typography>
                                        <DetailsChip icon={<CalendarToday />} text={item.date} size={Size.Small}/>
                                        <Typography variant="body2">{item.summary}</Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                </Grid>
                <Grid item xs={9}>
                    <SectionHeader>Work experience</SectionHeader>
                    {props.resume.work?.map(item => (
                        <Card variant="outlined" className={styles.compactCard}>
                            <CardContent>
                                <InlineTitleDesc title={item.name} description={item.position}/>
                                <DetailsChip icon={<LocationOn />} text={item.location} size={Size.Small}/>
                                <DetailsChip icon={<CalendarToday />} text={startAndEndDateFormat(item.startDate, item.endDate)} size={Size.Small}/>
                                <Typography variant="body2">{item.summary}</Typography>
                                {item.highlights !== undefined && (
                                    <DescriptionBulletPoints items={item.highlights}/>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    <SectionHeader>Projects</SectionHeader>
                    {props.resume.projects?.filter(item => !props.print || !item.hideOnPrint ).map(item => (
                        <Card variant="outlined" className={styles.compactCard}>
                            <CardContent>
                                <Typography className={styles.h7}>{item.name}</Typography>
                                <DetailsChip icon={<CalendarToday />} text={startAndEndDateFormat(item.startDate, item.endDate)} size={Size.Small}/>
                                {item.keywords?.map(keyword => (
                                    <DetailsChip icon={undefined} text={keyword} size={Size.Small}/>
                                ))}
                                <Typography variant="body2">{item.description}</Typography>
                                {!props.print && item.highlights !== undefined && (
                                    <DescriptionBulletPoints items={item.highlights}/>
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
