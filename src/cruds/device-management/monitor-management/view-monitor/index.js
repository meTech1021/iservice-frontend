/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Autocomplete } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDEditor from "components/MDEditor";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate, useParams } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";
import DataTable from "examples/Tables/DataTable";

const ViewMonitorDevice = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState({
        text: "",
        error: false,
        textError: "",
    });    

    const [device, setDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    const [comparisonOperators, setComparisonOperators] = useState([]);
    const [thresholdTypes, setThresholdTypes] = useState([]);

    const [deviceParameters, setDeviceParameters] = useState([{label: "Select All", value: "all"}]);
    const [selectedParameters, setSelectedParameters] = useState([]);
    
    const [statusType, setStatusType] = useState([]);
    const [statusDevice, setStatusDevice] = useState([]);

    const [deviceParameterValues, setDeviceParameterValues] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await CrudService.getInternalDevices();
                setDevices(response.data);
                console.log(response.data, 'devicesss')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getStatusTypes(MODULE_MASTER.DEVICES);
                setStatusDevice(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getDeviceParameters();
                const parametersWithSelectAll = [
                    { label: "Select All", value: "all" },
                    ...response.data
                ];
                setDeviceParameters(parametersWithSelectAll);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getDeviceParameterValues(id);
                setDeviceParameterValues(response.data);
                console.log(response.data, '+++')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getThresholdTypes();
                setThresholdTypes(response.data);
            } catch (err) {
                console.error(err);
                return null;
            }
        })();

        (async () => {
            try {
                const response = await CrudService.getComparisonOperators();
                setComparisonOperators(response.data);
                console.log(response.data, 'com')
            } catch (err) {
                console.error(err);
                return null;
            }
        })();
    }, []);

    useEffect(() => {
        if (!id) return;
        (async () => {
          try {
            const res = await CrudService.getDeviceMonitor(id);
            console.log(res, 'res')
            setName({ ...name, text: res.data.attributes?.name });
            const deviceArray = res.data.attributes?.DeviceMonitorAssociations.map((device) => ({
                ...device,
                attributes: device?.Device
            }));
            
            setDevice(deviceArray);
            setStatusType({attributes: {StatusType: res.data.attributes?.StatusOption?.StatusType}});
            const newDeviceParameters = res.data.included.deviceParameters.map((parameter) => ({
                ...parameter,
                label: parameter?.DeviceParameter?.parameter_name,
                parameter_name: parameter?.DeviceParameter?.parameter_name,
                is_threshold_required: parameter?.DeviceParameter?.is_threshold_required
            }));
            setSelectedParameters(newDeviceParameters)
            console.log(newDeviceParameters, 'newDeviceParameters')
            
          } catch (err) {
            console.error(err);
          }
        })();
      }, [id]);
    
    const getRows = () => {
        return selectedParameters.map((row, index) => {
            const fields = [
                {
                    parameter_name: row.parameter_name
                }
            ];

            if (row?.is_threshold_required) {
                fields.push(
                    {
                        threshold_type: (
                            <Autocomplete
                                defaultValue={row?.DeviceMonitorThresholdType || null}
                                readOnly
                                options={thresholdTypes}
                                getOptionLabel={(option) => (option ? option.threshold_name : "")}
                                style={{ width: "140px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Type" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        threshold_value: (
                            <FormField
                                required
                                readOnly
                                value={row.threshold_value}
                                label="Value"
                            />
                        ),    
                        comparison_operator: (
                            <Autocomplete
                                defaultValue={row.ComparisonOperator || null}
                                readOnly
                                options={comparisonOperators}
                                getOptionLabel={(option) => (option ? option.comparison_operator : "")}
                                style={{ width: "80px" }}  
                                renderInput={(params) => (
                                    <FormField {...params} label="Operator" InputLabelProps={{ shrink: true }} required />
                                )}
                            />
                        ),
                        alert_enabled: (
                            <Checkbox
                                readOnly
                                checked={row.alert_enabled}
                            />
                        )
                    }
                );
            }

            return Object.assign({}, ...fields);
        });
    };

    const dataTableData = {
        columns: [
            { Header: "Parameter Name", accessor: "parameter_name" },
            { Header: "Threshold Type", accessor: "threshold_type" },
            { Header: "Comparison Operator", accessor: "comparison_operator" },
            { Header: "Threshold Value", accessor: "threshold_value" },
            {
                Header: "Alert Enabled",
                accessor: 'alert_enabled'
            },
        ],
        rows: getRows(),
    };

    const renderTableCell = (data) => {
        // If the data is an object (JSON), render each key-value pair
        if (typeof data === 'object' && data !== null) {
          return (
            <Table>
              <TableBody>
                {Object.entries(data).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{renderTableCell(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        }
        return data;
    };

    const DynamicDataTable = (ParameterData) => {
        // Parse JSON data and extract keys for table columns
        const columns = Object.keys(ParameterData);
      
        return (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{renderTableCell(ParameterData[column])}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        );
      };


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mt={5} mb={9}>
                <Grid container justifyContent="center">
                    <Grid item xs={12} lg={8}>
                        <MDBox mt={6} mb={8} textAlign="center">
                            <MDBox mb={1}>
                                <MDTypography variant="h3" fontWeight="bold">
                                Device Monitor {id}
                                </MDTypography>
                            </MDBox>
                            <MDTypography variant="h5" fontWeight="regular" color="secondary">
                                This information will describe more about the Device Monitor.
                            </MDTypography>
                        </MDBox>
                        <Card>
                            <MDBox>
                                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                                    <MDBox p={1}>
                                        <FormField
                                            type="text"
                                            readOnly
                                            label="Name"
                                            name="name"
                                            value={name?.text || ""}
                                            error={name?.error}
                                        />
                                        {name.error && (
                                        <MDTypography variant="caption" color="error" fontWeight="light">
                                            {name.textError}
                                        </MDTypography>
                                        )}
                                    </MDBox>
                                    <Autocomplete
                                        multiple
                                        readOnly
                                        defaultValue={[]}
                                        options={devices}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                                        value={device ?? ""}                                        
                                        renderInput={(params) => (
                                            <FormField {...params} label="Device" InputLabelProps={{ shrink: true }} />
                                        )}
                                    />

                                    <Autocomplete
                                        defaultValue=""
                                        readOnly
                                        options={statusDevice}
                                        getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                                        value={statusType ?? ""}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />    

                                    <Autocomplete
                                        multiple
                                        readOnly
                                        defaultValue={selectedParameters}
                                        options={deviceParameters}
                                        getOptionLabel={(option) => (option ? option.label : "")}
                                        value={selectedParameters}
                                        renderInput={(params) => (
                                            <FormField {...params} label="Parameter" InputLabelProps={{ shrink: true }}  />
                                        )}
                                    />    

                                    <DataTable table={dataTableData} canSearch={true} />
                                    {
                                    deviceParameterValues.map((deviceParameterValue, index) => (
                                        <MDBox key={index}>
                                        {deviceParameterValue.deviceParameterValues.map((innerValue, innerIndex) => (
                                            <DynamicDataTable key={innerIndex} ParameterData={JSON.parse(innerValue.value)} />
                                        ))}
                                        </MDBox>
                                    ))
                                    }
                                    <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                                        <MDBox mx={2}>
                                            <MDButton
                                            variant="gradient"
                                            color="dark"
                                            size="small"
                                            px={2}
                                            mx={2}
                                            onClick={() =>
                                                navigate("/monitor-management", {
                                                state: { value: false, text: "" },
                                                })
                                            }
                                            >
                                            Back
                                            </MDButton>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
};

export default ViewMonitorDevice;
