import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCogs,
    faShieldAlt,
    faBarcode,
} from "@fortawesome/free-solid-svg-icons";
import mqtt from "mqtt";
import { useState, useEffect } from "react";

import "./Device_Status.css";

function Device_Status() {
    const [mainControllerStatus, setMainControllerStatus] = useState("Unknown");
    const [scanControllerStatus, setScanControllerStatus] = useState("Unknown");
    const [securityControllerStatus, setSecurityControllerStatus] = useState("Unknown");

    const statusMainClass =
        mainControllerStatus === "online" ? "text-green" : "text-red";
    const statusScanClass =
        scanControllerStatus === "online" ? "text-green" : "text-red";
    const statusSecurityClass =
        securityControllerStatus === "online" ? "text-green" : "text-red";

    const clientId = "emqx_react_" + Math.random().toString(16).substring(2, 8);
    const username = "emqx_test";
    const password = "emqx_test";
    const mainControllerTopic = "3yp_device_1/main_controller";
    const scanControllerTopic = "3yp_device_1/scan_controller";
    const securityControllerTopic = "3yp_device_1/security_controller";

    useEffect(() => {
        const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt", {
            clientId,
            username,
            password,
            // ...other options
        });

        client.on("connect", () => {
            console.log("Connected to MQTT broker");

            // Subscribe to topics
            client.subscribe(mainControllerTopic, (err) => {
                if (!err) {
                    console.log(`Subscribed to ${mainControllerTopic}`);
                }
            });

            client.subscribe(scanControllerTopic, (err) => {
                if (!err) {
                    console.log(`Subscribed to ${scanControllerTopic}`);
                }
            });

            client.subscribe(securityControllerTopic, (err) => {
                if (!err) {
                    console.log(`Subscribed to ${securityControllerTopic}`);
                }
            });
        });

        client.on("message", (topic, message) => {
            // Received message from the subscribed topic
            console.log(
                `Received message: ${message.toString()} from topic: ${topic}`
            );

            const status = JSON.parse(message.toString()).data.device_status;

            // Update state based on the controller type
            if (topic === mainControllerTopic) {
                setMainControllerStatus(status);
            } else if (topic === scanControllerTopic) {
                setScanControllerStatus(status);
            } else if (topic === securityControllerTopic) {
                setSecurityControllerStatus(status);
            }
        });

        return () => {
            // Disconnect the client when the component unmounts
            client.end();
        };
    }, []);

    // auto update status to offline after 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setMainControllerStatus("Offline");
            setScanControllerStatus("Offline");
            setSecurityControllerStatus("Offline");
        }, 5000);
        return () => clearInterval(interval);
    }, [mainControllerStatus, scanControllerStatus, securityControllerStatus]);

    return (
        <div>
            <h2>DEVICE STATUS</h2>
            <p>Device Summary</p>
            <br />
            <div className="container_for_sales bg-white">
                <div className="row row-1 row-3-md-2 g-4">
                    <div className="col">
                        <div
                            className="card square-card"
                            style={{ backgroundColor: "white" }}
                        >
                            <div className="card-body_device_status">
                                <h5 className="card-title text-center">
                                    <FontAwesomeIcon
                                        icon={faCogs}
                                        size="2x"
                                        color="dark"
                                    />{" "}
                                    <br />
                                    <br />
                                    <br />
                                    Main Controller
                                    <p
                                        className={`card-text ${statusMainClass}`}
                                    >
                                        Status: {mainControllerStatus}
                                    </p>
                                </h5>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col">
                        <div
                            className="card square-card"
                            style={{
                                backgroundColor: "white",
                                marginRight: "115px",
                            }}
                        >
                            <div className="card-body_device_status">
                                <h5 className="card-title text-center">
                                    <FontAwesomeIcon
                                        icon={faShieldAlt}
                                        size="2x"
                                        color="dark"
                                    />
                                    <br />
                                    <br />
                                    <br />
                                    Security Controller
                                    <p
                                        className={`card-text ${statusSecurityClass}`}
                                    >
                                        Status: {securityControllerStatus}
                                    </p>
                                </h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Device_Status;
