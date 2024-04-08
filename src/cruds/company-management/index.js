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
import { useNavigate, useLocation } from "react-router-dom";
import { Modal } from '@mui/material';
// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import { Tooltip, IconButton } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import CrudService from "services/cruds-service";
import HTMLReactParser from "html-react-parser";
import { AbilityContext } from "Can";
import { useAbility } from "@casl/react";
import GoogleMapComponent from "examples/Maps";

function CompanyManagement() {
  let { state } = useLocation();
  const ability = useAbility(AbilityContext);
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [notification, setNotification] = useState({
    value: false,
    text: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await CrudService.getCompanies();

      setData(response.data);
    })();
    document.title = `RIVIO | Companies`;
  }, []);

  useEffect(() => {
    if (!state) return;
    setNotification({
      value: state.value,
      text: state.text,
    });
  }, [state]);

  useEffect(() => {
    setTableData(getRows(data));
  }, [data]);

  useEffect(() => {
    if (notification.value === true) {
      let timer = setTimeout(() => {
        setNotification({
          value: false,
          text: "",
        });
      }, 5000);
    }
  }, [notification]);

  const clickAddHandler = () => {
    navigate("/company-management/new-company");
  };

  const clickEditHandler = (id) => {
    navigate(`/company-management/edit-company/${id}`);
  };

  const clickDeleteHandler = async (e, id) => {
    try {
      if (!confirm("Are you sure you want to delete this company?")) {
        e.nativeEvent.stopImmediatePropagation();
      } else {
        await CrudService.deleteCompany(id);
        // the delete does not send a response
        // so I need to get again the companies to set it and this way the table gets updated -> it goes to the useEffect with data dependecy
        const response = await CrudService.getCompanies();
        setData(response.data);
        setNotification({
          value: true,
          text: "The company has been successfully deleted",
        });
      }
    } catch (err) {
      // it sends error is the company is associated with an item
      console.error(err);
      console.log(err.errors[0].detail, 'error')
      if (err.hasOwnProperty("errors")) {
        setNotification({
          value: true,
          text: err.errors[0].detail,
        });
      }
      return null;
    }
  };


  const handleMapButtonClick = (row) => {
    const { street_address1, street_address2, city, state, country, postal_code, latitude, longitude } = row;
  
    setLatitude(latitude);
    setLongitude(longitude);
    // setMapUrl(url);
    setOpenModal(true);
  };
    
  const getRows = (info) => {

    let updatedInfo = info.map((row) => {
      const defaultIndex = row.moduleLocations.findIndex(location => location.is_default === true)
      return {
        type: "companies",
        id: row.attributes.company_id,
        name: row.attributes.name,
        organization: row.attributes.Organization?.name,
        address: row.moduleLocations[defaultIndex]?.Address?.street_address1,
        city: row.moduleLocations[defaultIndex]?.Address?.city,
        state: row.moduleLocations[defaultIndex]?.Address?.state,
        country: row.moduleLocations[defaultIndex]?.Address?.country,
        postal_code: row.moduleLocations[defaultIndex]?.Address?.postal_code,
        latitude: row.moduleLocations[defaultIndex]?.Address?.latitude,
        longitude: row.moduleLocations[defaultIndex]?.Address?.longitude,
      };
    });
    return updatedInfo;
  };

  const dataTableData = {
    columns: [
      { Header: "name", accessor: "name", width: "20%" },
      {
        Header: "Organization",
        accessor: "organization",
        width: "10%",
      },
      { Header: "Address 1", accessor: "address", width: "10%" },
      { Header: "City", accessor: "city", width: "20%" },
      { Header: "State", accessor: "state", width: "10%" },
      { Header: "Country", accessor: "country", width: "10%" },
      { Header: "Postal Code", accessor: "postal_code", width: "10%" },
      { Header: "Latitude", accessor: "latitude", width: "10%" },
      { Header: "Longitude", accessor: "longitude", width: "10%" },
      {
        Header: "View on Map",
        accessor: "",
        width: "10%",
        Cell: (info) => (
          <MDButton onClick={() => handleMapButtonClick(info.cell.row.original)}>View</MDButton>
        ),
      },
      {
        Header: "actions",
        disableSortBy: true,
        accessor: "",
        Cell: (info) => {
          return (
            <MDBox display="flex" alignItems="center">
              {ability.can("edit", "companies") && (
                <Tooltip title="Edit Company">
                  <IconButton onClick={() => clickEditHandler(info.cell.row.original.id)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {ability.can("delete", "companies") && (
                <Tooltip title="Delete Company">
                  <IconButton onClick={(e) => clickDeleteHandler(e, info.cell.row.original.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </MDBox>
          );
        },
      },
    ],

    rows: tableData,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification.value && (
        <MDAlert color="info" my="20px">
          <MDTypography variant="body2" color="white">
            {notification.text}
          </MDTypography>
        </MDAlert>
      )}
      <MDBox pt={6} pb={3}>
        <MDBox mb={3}>
          <Card>
            <MDBox p={3} lineHeight={1} display="flex" justifyContent="space-between">
              <MDTypography variant="h5" fontWeight="medium">
                Company Management
              </MDTypography>
              <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <MDBox tabIndex={-1}>
                  <GoogleMapComponent lat={latitude} lng={longitude} />
                </MDBox>
              </Modal>
              {ability.can("create", "companies") && (
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  type="submit"
                  onClick={clickAddHandler}
                >
                  + Add Company
                </MDButton>
              )}
            </MDBox>
            <DataTable table={dataTableData} canSearch={true} />
          </Card>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default CompanyManagement;
