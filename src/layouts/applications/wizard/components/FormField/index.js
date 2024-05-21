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

// prop-type is a library for typechecking of props
import PropTypes from "prop-types";
import MDInput from "components/MDInput";

function FormField({ label, error, ...rest }) {
  return (
    <MDInput
      variant="standard"
      label={label}
      fullWidth
      error={!!error} // Convert error to boolean
      helperText={error} // Optionally provide the error message
      {...rest}
    />
  );
}

// typechecking props for FormField
FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string, // Update the prop type to string or remove if not needed
};

export default FormField;
