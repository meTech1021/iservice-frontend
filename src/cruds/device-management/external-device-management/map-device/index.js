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

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import { MODULE_MASTER } from "utils/constant";
import ModalEntityAddressItemSelect from "cruds/device-management/select-entity";

const MapDevice = ({setOpen, mapData, data, setData}) => {
  const navigate = useNavigate();
  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [deviceType, setDeviceType] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [entityAddressItem, setEntityAddressItem] = useState([]);
  const [entityAddressItems, setEntityAddressItems] = useState([]);
  const [statusType, setStatusType] = useState([]);
  const [statusDevice, setStatusDevice] = useState([]);
  const [brand, setBrand] = useState([]);
  const [brands, setBrands] = useState([]);
  const [obrands, setOBrands] = useState([]);
  const [model, setModel] = useState([]);
  const [models, setModels] = useState([]);
  const [omodels, setOModels] = useState([]);
  const [typebrand, setTypeBrand] = useState([]);
  const [brandmodel, setBrandModel] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getDeviceTypes();
        setDeviceTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
        try {
          const response = await CrudService.getStatusTypes(MODULE_MASTER.DEVICES);
          setStatusDevice(response.data);
          setStatusType(response.default_id);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();

    (async () => {
        try {
          const response = await CrudService.getEntityAddressItems();
          const transformedResponse = response.map(item => ({
            ...item,
            id: item.address_item_id // Assuming address_item_id is the correct field name in your response
          }));
          
          setEntityAddressItems(transformedResponse);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();

    (async () => {
        try {
          const response = await CrudService.getDeviceBrands();
          setOBrands(response.data);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();

    (async () => {
      try {
        const response = await CrudService.getDeviceModels();
        setOModels(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
      try {
        const response = await CrudService.getDeviceTypeBrand();
        setTypeBrand(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
      try {
        const response = await CrudService.getDeviceBrandModel();
        setBrandModel(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

  }, []);

  const changeNameHandler = (e) => {
    setName({ ...name, text: e.target.value });
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    const device = {
      data: {
        type: "devices",
        attributes: {
          external_device_id: mapData.device_id,
          name: mapData.title,
          deviceType: deviceType?.attributes,
          statusType: statusType?.attributes,
          entityAddressItem: entityAddressItem[0],
          brand: brand?.attributes,
          model: model?.attributes
        }
      },
    };

    console.log(device, 'device')
    try {
      await CrudService.mapDevice(device);
      const updatedData = data.map((item) => {
        if (item.device_id === mapData.device_id) {
          // Update the status_type_id to 20 for device_id 90
          return { ...item, status_type_id: 19 };
        }
        return item; // Return the unchanged item for other device_ids
      });
    
      setData(updatedData); // Update the state with the modified data
      setOpen(false);
      // navigate("/internal-device-management", {
      //   state: { value: true, text: "The device was successfully created" },
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
                  label="Name"
                  name="name"
                  value={mapData?.title}
                  onChange={changeNameHandler}
                  error={name.error}
                />
                {name.error && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    {name.textError}
                  </MDTypography>
                )}
              </MDBox>
              <Autocomplete
                  defaultValue=""
                  options={deviceTypes}
                  getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                  value={deviceType ?? ""}
                  onChange={(event, newdeviceType) => {
                      setDeviceType(newdeviceType);
                      if (newdeviceType) {
                        const filtered = typebrand
                          .filter((assoc) => assoc.type_id === newdeviceType?.attributes?.device_type_id)
                          .map((assoc) => obrands.find((brand) => brand?.attributes?.brand_id === assoc?.brand_id));
                        setBrands(filtered);
                        setBrand([]);
                        setModel([]);
                      } else {
                        // Reset filtered brands if no type is selected
                        setBrands([]);
                        setBrand([]);
                        setModel([]);
                      }
                  }}
                  renderInput={(params) => (
                      <FormField {...params} label="Device Type" InputLabelProps={{ shrink: true }} required />
                  )}
              />

              <Autocomplete
                  defaultValue=""
                  options={brands}
                  getOptionLabel={(option) => (option.attributes ? option?.attributes?.brand_name : "")}
                  value={brand ?? ""}
                  onChange={(event, newBrand) => {
                      setBrand(newBrand);
                      if (newBrand) {
                        const filtered = brandmodel
                          .filter((assoc) => assoc.brand_id === newBrand?.attributes?.brand_id)
                          .map((assoc) => omodels.find((model) => model?.attributes?.model_id === assoc?.model_id));
                        setModels(filtered);
                        setModel([])
                      } else {
                        // Reset filtered brands if no type is selected
                        setModels([]);
                        setModel([])
                      }
                  }}
                  renderInput={(params) => (
                      <FormField {...params} label="Device Brand" InputLabelProps={{ shrink: true }} required />
                  )}
              />

              <Autocomplete
                  defaultValue=""
                  options={models}
                  getOptionLabel={(option) => (option.attributes ? option.attributes?.model_name : "")}
                  value={model ?? ""}
                  onChange={(event, newModel) => {
                      setModel(newModel);
                  }}
                  renderInput={(params) => (
                      <FormField {...params} label="Device Model" InputLabelProps={{ shrink: true }} required />
                  )}
              />

              <Autocomplete
                  defaultValue=""
                  options={statusDevice}
                  getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                  value={statusType ?? ""}
                  onChange={(event, newStatus) => {
                      setStatusType(newStatus);
                      console.log(newStatus, 'newStatus')
                  }}
                  renderInput={(params) => (
                      <FormField {...params} label="Status" InputLabelProps={{ shrink: true }}  />
                  )}
              />    

              <ModalEntityAddressItemSelect entityAddressItems={entityAddressItems} entityAddressItem={entityAddressItem} setEntityAddressItem={setEntityAddressItem} />
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

export default MapDevice;
