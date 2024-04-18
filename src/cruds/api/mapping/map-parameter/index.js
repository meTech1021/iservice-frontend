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
import Card from "@mui/material/Card";
import { Autocomplete } from "@mui/material";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";

const MapParameter = ({setOpen, mapData, data, setData}) => {
  const navigate = useNavigate();
  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [apiName, setApiName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [label, setLabel] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [tooltip, setTooltip] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [parameterType, setParameterType] = useState("");
  const [parameterTypes, setParameterTypes] = useState([]);
  const [icon, setIcon] = useState("");
  const [icons, setIcons] = useState([]);
  const [fieldType, setFieldType] = useState("");
  const [fieldTypes, setFieldTypes] = useState([]);
  const [isThreRequired, setIsThreRequired] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getDeviceParameterTypes();
        setParameterTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
        try {
          const response = await CrudService.getIcons();
          setIcons(response.data);
          console.log(response.data, 'field')
        } catch (err) {
          console.error(err);
          return null;
        }
      })();

      (async () => {
        try {
          const response = await CrudService.getFieldTypes();
          setFieldTypes(response.data);
        } catch (err) {
          console.error(err);
          return null;
        }
      })();
  }, []);

  useEffect(() => {
    console.log(mapData.label, 'mapData')
    setParameterType(mapData.DeviceParameterType ?? "");
    setIcon(mapData.Icon ?? "");
    setFieldType(mapData.FieldType ?? "");
    setTooltip({ ...tooltip, text: mapData.tooltip });
    setLabel({ ...label, text: mapData.label });
    setIsThreRequired(mapData.is_threshold_required ?? false)
  }, [mapData]);

  const changeNameHandler = (e) => {
    setName({ ...name, text: e.target.value });
  };

  const changeLabelHandler = (e) => {
    setLabel({ ...label, text: e.target.value });
  };

  const changeTooltipHandler = (e) => {
    setTooltip({ ...tooltip, text: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    setIsThreRequired(event.target.checked);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const parameter = {
      data: {
        type: "parameters",
        attributes: {
          external_parameter_id: mapData.id,
          name: mapData.parameter_name,
          tooltip: tooltip.text,
          label: label.text,
          parameterType: parameterType,
          icon: icon,
          fieldType: fieldType,
          isThreRequired: isThreRequired,
          api_id: mapData.ApiName?.api_id
        }
      },
    };

    console.log(parameter, 'Parameter')
    try {
      await CrudService.mapParameter(parameter);
      const updatedData = data.map((item) => {
        if (item.id === mapData.id) {
          // Update the status_type_id to 20 for Parameter_id 90
          return { ...item, status_type_id: 19 };
        }
        return item; // Return the unchanged item for other Parameter_ids
      });
    
      setData(updatedData); // Update the state with the modified data
      setOpen(false);
      // navigate("/internal-Parameter-management", {
      //   state: { value: true, text: "The Parameter was successfully created" },
      // });
    } catch (err) {
      console.error(err);
    }
  };

    return (
        <Card >
            <MDBox component="form" method="POST" onSubmit={submitHandler}>
                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                    <MDBox
                        sx={{
                            maxHeight: '70vh', // Set max height to enable scrolling
                            overflowY: 'auto',    
                            overflowX: 'hidden'                      
                        }}
                    >
                    <MDBox p={1}>
                        <FormField
                            type="text"
                            label="API Name"
                            name="apiName"
                            value={mapData?.ApiName?.api_name}
                            onChange={changeNameHandler}
                            error={apiName.error}
                        />
                        {apiName.error && (
                            <MDTypography variant="caption" color="error" fontWeight="light">
                                {apiName.textError}
                            </MDTypography>
                        )}
                    </MDBox>                
                    <MDBox p={1}>
                        <FormField
                            type="text"
                            label="Name"
                            name="name"
                            value={mapData?.parameter_name}
                            onChange={changeNameHandler}
                            InputLabelProps={{ shrink: true }}
                            error={name.error}
                        />
                        {name.error && (
                            <MDTypography variant="caption" color="error" fontWeight="light">
                            {name.textError}
                            </MDTypography>
                        )}
                    </MDBox>

                    <MDBox p={1}>
                        <FormField
                            required
                            type="text"
                            label="Label"
                            name="label"
                            value={label.text}
                            onChange={changeLabelHandler}
                            InputLabelProps={{ shrink: true }}
                            error={label.error}
                        />
                        {label.error && (
                            <MDTypography variant="caption" color="error" fontWeight="light">
                            {label.textError}
                            </MDTypography>
                        )}
                    </MDBox>

                    <MDBox p={1}>
                        <FormField
                            required
                            type="text"
                            label="Toottip"
                            name="tooltip"
                            value={tooltip.text}
                            onChange={changeTooltipHandler}
                            error={tooltip.error}
                            InputLabelProps={{ shrink: true }}
                        />
                        {tooltip.error && (
                            <MDTypography variant="caption" color="error" fontWeight="light">
                                {tooltip.textError}
                            </MDTypography>
                        )}
                    </MDBox>

                    <Autocomplete
                        defaultValue=""
                        options={parameterTypes}
                        getOptionLabel={(option) => (option ? option?.type_name : "")}
                        value={parameterType ?? ""}
                        onChange={(event, newType) => {
                            setParameterType(newType);
                        }}
                        renderInput={(params) => (
                            <FormField {...params} label="Type" InputLabelProps={{ shrink: true }} required />
                        )}
                    />    

                    <Autocomplete
                        defaultValue=""
                        options={icons}
                        getOptionLabel={(option) => (option ? option?.icon_name : "")}
                        value={icon ?? ""}
                        onChange={(event, newIcon) => {
                            setIcon(newIcon);
                        }}
                        renderInput={(params) => (
                            <FormField {...params} label="Icon" InputLabelProps={{ shrink: true }} required />
                        )}
                    />                  

                    <Autocomplete
                        defaultValue=""
                        options={fieldTypes}
                        getOptionLabel={(option) => (option ? option?.name : "")}
                        value={fieldType ?? ""}
                        onChange={(event, newFieldType) => {
                            setFieldType(newFieldType);
                        }}
                        renderInput={(params) => (
                            <FormField {...params} label="Field Type" InputLabelProps={{ shrink: true }} required />
                        )}
                    />    

                    <Autocomplete
                        defaultValue={mapData.is_threshold_required ? "Yes" : "No"}
                        options={["Yes", "No"]}
                        getOptionLabel={(option) => (option ? option : "")}
                        onChange={(event, newFieldType) => {
                            if(newFieldType === "Yes")
                                setIsThreRequired(true)
                            else
                                setIsThreRequired(false)
                        }}
                        renderInput={(params) => (
                            <FormField {...params} label="Is Threshold Allowed" InputLabelProps={{ shrink: true }} required />
                        )}
                    />    

                </MDBox>

                <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                <MDBox mx={2}>
                    <MDButton
                    variant="gradient"
                    color="dark"
                    size="small"
                    px={2}
                    mx={2}
                    onClick={() =>
                        setOpen(false)
                    }
                    >
                    Back
                    </MDButton>
                </MDBox>
                <MDButton variant="gradient" color="dark" size="small" type="submit">
                    Map
                </MDButton>
                </MDBox>
            </MDBox>
            </MDBox>
        </Card>
  );
};

export default MapParameter;
