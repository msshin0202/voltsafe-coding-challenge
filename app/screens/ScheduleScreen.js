import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    Text,
    View,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
} from "react-native";

const url = "http://159.203.37.33:3696/times";

const ScheduleScreen = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([{}]);

    useEffect(() => {
        fetch(url)
            .then((response) => response.json())
            .then((response) => {
                setData(response);
                setLoading(false);
                convertOnTime();
                convertOffTime();
            })
            .catch((error) => alert(error));
    }, []);

    const convertOnTime = () => {
        var newData = data.map((user) => {
            var times = user === null ? null : user.onTime.split(":");
            if (times.length <= 1) {
                return user;
            }
            var hour = times[0];
            var min = times[1].slice(0, 2);
            var ampm = times[1].slice(2);

            if (ampm === "am") {
                if (hour === "12") {
                    user.onTime = "00" + min;
                    return user;
                }
            } else if (ampm === "pm") {
                if (hour !== "12") {
                    user.onTime = String(parseInt(hour) + 12) + min;
                    return user;
                }
            }
            user.onTime = hour + min;
            return user;
        });
        setData(newData);
    };

    const convertOffTime = () => {
        var newData = data.map((user) => {
            var times = user === null ? null : user.offTime.split(":");
            if (times.length <= 1) {
                return user;
            }
            var hour = times[0];
            var min = times[1].slice(0, 2);
            var ampm = times[1].slice(2);

            if (ampm === "am") {
                if (hour === "12") {
                    user.offTime = "00" + min;
                    return user;
                }
            } else if (ampm === "pm") {
                if (hour !== "12") {
                    user.offTime = String(parseInt(hour) + 12) + min;
                    return user;
                }
            }
            user.offTime = hour + min;
            return user;
        });
        setData(newData);
    };

    const handleOnOff = (startTime, endTime, user) => {
        if (
            parseInt(startTime) >= parseInt(user.onTime) &&
            parseInt(user.onTime) < parseInt(endTime) &&
            parseInt(startTime) < parseInt(user.offTime) &&
            parseInt(user.offTime) <= parseInt(endTime)
        ) {
            return <View style={styles.on} />;
        }
        return <View style={styles.off} />;
    };

    return (
        <SafeAreaView style={styles.androidSafeArea}>
            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <View>
                    <Text style={styles.scheduleText}>DAILY SCHEDULE: </Text>
                    <View style={styles.scheduleContainer}>
                        {data.map((user) => {
                            return (
                                <View style={styles.userSchedule}>
                                    <Text style={styles.name}>{user.name}</Text>
                                    <View style={styles.timeContainer}>
                                        <Text>12 am</Text>
                                        <Text>12 pm</Text>
                                        <Text>12 am</Text>
                                    </View>
                                    <View style={styles.scheduleBar}>
                                        <View style={styles.cell}>
                                            {handleOnOff("0000", "0300", user)}
                                            {handleOnOff("0300", "0600", user)}
                                            {handleOnOff("0600", "0900", user)}
                                            {handleOnOff("0900", "1200", user)}
                                            {handleOnOff("1200", "1500", user)}
                                            {handleOnOff("1500", "1800", user)}
                                            {handleOnOff("1800", "2100", user)}
                                            {handleOnOff("2100", "2400", user)}
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    androidSafeArea: {
        backgroundColor: "white",
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    cell: {
        flexDirection: "row",
        height: 40,
    },
    name: {
        fontWeight: "bold",
        fontSize: 15,
        padding: 5,
    },
    off: {
        backgroundColor: "#a4a8a9",
        borderWidth: 1,
        flex: 1,
    },
    on: {
        backgroundColor: "#63dafd",
        borderWidth: 1,
        flex: 1,
    },
    scheduleBar: {
        // backgroundColor: "dodgerblue",
        flexDirection: "column",
        // flex: 1,
        padding: 10,
    },
    scheduleContainer: {
        // backgroundColor: "green",
        flex: 1,
        height: "100%",
        padding: 10,
        width: "100%",
    },
    scheduleText: {
        fontSize: 20,
        fontWeight: "bold",
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 15,
    },
    tickContainer: {
        flexDirection: "row",
        height: 10,
        width: "100%",
    },
    timeContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
    },
    userSchedule: {
        // backgroundColor: "red",
        height: 125,
    },
});

export default ScheduleScreen;
