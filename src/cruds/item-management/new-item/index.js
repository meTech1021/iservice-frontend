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

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import FormField from "layouts/applications/wizard/components/FormField";
import { useNavigate } from "react-router-dom";

import CrudService from "services/cruds-service";
import MultiSelectDataTable from "examples/Tables/MultiSelectDataTable";
import ModalAddressSelect from "cruds/address-management/select";
import { MODULE_MASTER } from "utils/constant";

const NewItem = () => {
  const navigate = useNavigate();
  const [name, setName] = useState({
    text: "",
    error: false,
    textError: "",
  });

  const [description, setDescription] = useState("");
  const [company, setCompany] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [oItemTypes, setOItemTypes] = useState([]);
  const [statusAddress, setStatusAddress] = useState([]);
  const [statusType, setStatusType] = useState([]);
  const [statusItem, setStatusItem] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [moduleaddresses, setModuleAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(0);

  const [descError, setDescError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await CrudService.getItemTypes();
        setOItemTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();
    (async () => {
        try {
          const response = await CrudService.getCompanies();
          setCompanies(response.data);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();
    (async () => {
      try {
        const response = await CrudService.getAddressTypes();
        setAddressTypes(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
      try {
        const response = await CrudService.getStatusTypes(MODULE_MASTER.ADDRESS);
        setStatusAddress(response.data);
      } catch (err) {
        console.error(err);
        return null;
      }
    })();

    (async () => {
        try {
          const response = await CrudService.getStatusTypes(MODULE_MASTER.ITEMS);
          setStatusItem(response.data);
          setStatusType(response.default_id);
        } catch (err) {
          console.error(err);
          return null;
        }
    })();

    (async () => {
      try {
        const response = await CrudService.getModuleAddresses(MODULE_MASTER.ENTITIES);
        setModuleAddresses(response.data);
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

    if (name.text.trim().length < 1) {
      setName({ ...name, error: true, textError: "The item name is required" });
      return;
    }

    let descNoTags = description.replace(/(<([^>]+)>)/gi, "");
    if (descNoTags < 1) {
      setDescError(true);
      return;
    }

    // const formattedCompany = company.map((element) => element.attributes);
    const item = {
      data: {
        type: "items",
        attributes: {
          name: name.text,
          description,
          company: company?.attributes,
          itemType: itemType?.attributes,
          statusType: statusType?.attributes,
          addresses
        },
        selectedId: selectedId,
        
      },
    };

    try {
      console.log(item, 'item')
      await CrudService.createItem(item);
      navigate("/item-management", {
        state: { value: true, text: "The item was successfully created" },
      });
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setName({ ...name, error: true, textError: err.errors[0].detail });
      }
      console.error(err);
    }
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
                  Add New Item
                </MDTypography>
              </MDBox>
              <MDTypography variant="h5" fontWeight="regular" color="secondary">
                This information will describe more about the Item.
              </MDTypography>
            </MDBox>
            <Card>
              <MDBox component="form" method="POST" onSubmit={submitHandler}>
                <MDBox display="flex" flexDirection="column" px={3} my={2}>
                  <MDBox p={1}>
                    <FormField
                      type="text"
                      label="Name"
                      name="name"
                      value={name.text || ""}
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
                    defaultValue={[]}
                    options={companies}
                    getOptionLabel={(option) => (option.attributes ? option.attributes.name : "")}
                    onChange={(event, newCompany) => {
                        setCompany(newCompany);
                        setItemType([]);
                        const updatedItemTypes = oItemTypes.filter(item => item?.attributes?.company_id === newCompany?.attributes?.company_id);
                        setItemTypes(updatedItemTypes);

                    }}
                    renderInput={(params) => (
                        <FormField {...params} label="Company" InputLabelProps={{ shrink: true }} />
                    )}
                  />  

                  <Autocomplete
                      defaultValue=""
                      options={itemTypes}
                      getOptionLabel={(option) => (option.attributes ? option.attributes.type_name : "")}
                      value={itemType ?? ""}
                      onChange={(event, newItemType) => {
                          setItemType(newItemType);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Item Type" InputLabelProps={{ shrink: true }} required />
                      )}
                  />  

                  <Autocomplete
                      defaultValue=""
                      options={statusItem}
                      getOptionLabel={(option) => (option.attributes ? option.attributes?.StatusType.status_name : "")}
                      value={statusType ?? ""}
                      onChange={(event, newStatus) => {
                          setStatusType(newStatus);
                      }}
                      renderInput={(params) => (
                          <FormField {...params} label="Status" InputLabelProps={{ shrink: true }} required />
                      )}
                  />    

                  <MDBox mt={2}>
                    <MDBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <MDTypography
                        component="label"
                        variant="button"
                        fontWeight="regular"
                        color="text"
                      >
                        Description&nbsp;&nbsp;
                      </MDTypography>
                    </MDBox>
                    <MDEditor value={description} onChange={setDescription} />
                    {descError && (
                      <MDTypography variant="caption" color="error" fontWeight="light">
                        The item description is required
                      </MDTypography>
                    )}
                  </MDBox>

                  <ModalAddressSelect addressTypes={addressTypes} statusOptions={statusAddress} addresses={addresses} setAddresses={setAddresses} moduleaddresses={moduleaddresses} selectedId={selectedId} setSelectedId={setSelectedId}/>

                  <MDBox ml="auto" mt={4} mb={2} display="flex" justifyContent="flex-end">
                    <MDBox mx={2}>
                      <MDButton
                        variant="gradient"
                        color="dark"
                        size="small"
                        px={2}
                        mx={2}
                        onClick={() =>
                          navigate("/item-management", {
                            state: { value: false, text: "" },
                          })
                        }
                      >
                        Back
                      </MDButton>
                    </MDBox>
                    <MDButton variant="gradient" color="dark" size="small" type="submit">
                      Save
                    </MDButton>
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

export default NewItem;
