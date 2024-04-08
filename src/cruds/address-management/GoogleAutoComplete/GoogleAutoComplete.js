import React, { useState, useRef, useEffect } from 'react';
import Script from 'react-load-script';
import clone from 'clone';
import './GoogleAutoComplete.css';

const GoogleAutoComplete = ({ apiKey, id, placeholder, fields, callbackFunction }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [fieldsForState, setFieldsForState] = useState({
        streetNumber: '',
        streetAddress: '',
        streetAddress2: '',
        locality: '',
        cityOrState: '',
        postalcode: '',
        country: '',
        latitude: '',
        longitude: '',
        searchField: '',
    });
    const [showResult, setShowResult] = useState(false);
    const baseFields = clone(fields);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        if (!autocompleteRef.current && scriptLoaded) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(document.getElementById(id));
            autocompleteRef.current.addListener('place_changed', handleMapChange);
        }
    }, [scriptLoaded]);

    const handleInputChange = (key, value) => {
        setFieldsForState(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSearchClear = (searchText) => {
        if (searchText.target.type === "search" && searchText.target.value === "") {
            const fieldsCopy = { ...fieldsForState };
            Object.keys(fieldsCopy).forEach(key => {
                fieldsCopy[key] = "";
            });
            setFieldsForState(fieldsCopy);
        }
    };

    const handleMapChange = () => {
        const place = autocompleteRef.current.getPlace();
        callbackFunction(place);
        const updatedFields = { ...fieldsForState, ...baseFields };
        let hasStreetNumber = false;
        let hasStreetAddress = false;
        let hasNaturalFeature = false;
        let hasStreetAddress2 = false;
        let hasLocality = false;
        let hasCityOrState = false;
        let hasPostalCode = false;
        let hasCountry = false;
    
        if (place.address_components) {
            const addrComps = place.address_components;
    
            Object.keys(addrComps).forEach(index => {
                const addrType = addrComps[index].types[0];
                console.log(addrType, addrComps[index], addrComps[index].types[0])
                switch (addrType) {
                    case fields.streetNumber:
                        updatedFields.streetNumber = addrComps[index].long_name || '';
                        hasStreetNumber = true;
                        break;
                    case fields.streetAddress:
                        updatedFields.streetAddress = addrComps[index].short_name || '';
                        hasStreetAddress = true;
                        break;
                    case fields.streetAddress2:
                        if (addrComps[index].long_name) {
                            updatedFields.streetAddress2 = addrComps[index].long_name;
                            hasStreetAddress2 = true;
                        }
                        break;
                    case fields.naturalFeature:
                        if (addrComps[index].long_name) {
                            updatedFields.naturalFeature = addrComps[index].long_name;
                            hasNaturalFeature = true;
                        }
                        break;
                    case fields.locality:
                        updatedFields.locality = addrComps[index].short_name || '';
                        hasLocality = true;
                        break;
                    case fields.cityOrState:
                        updatedFields.cityOrState = addrComps[index].short_name || '';
                        hasCityOrState = true;
                        break;
                    case fields.postalcode:
                        updatedFields.postalcode = addrComps[index].long_name || '';
                        hasPostalCode = true;
                        break;
                    case fields.country:
                        updatedFields.country = addrComps[index].long_name || '';
                        hasCountry = true;
                        break;
                    default:
                        break;
                }
            });
    
            updatedFields.latitude = place.geometry.location.lat();
            updatedFields.longitude = place.geometry.location.lng();
            setFieldsForState(updatedFields);
            setShowResult(true);
    
            // Check if any required field is missing and set it to empty string
            if (!hasStreetNumber) {
                updatedFields.streetNumber = '';
            }
            if (!hasStreetAddress) {
                updatedFields.streetAddress = '';
            }
            if (!hasStreetAddress2) {
                updatedFields.streetAddress2 = '';
            }
            if (!hasNaturalFeature) {
                updatedFields.naturalFeature = '';
            }
            if (!hasLocality) {
                updatedFields.locality = '';
            }
            if (!hasCityOrState) {
                updatedFields.cityOrState = '';
            }
            if (!hasPostalCode) {
                updatedFields.postalcode = '';
            }
            if (!hasCountry) {
                updatedFields.country = '';
            }
        } else {
            console.log("Address components not found.");
        }
    };
    
    const handleScriptCreate = () => {
        setScriptLoaded(false);
    };

    const handleScriptError = () => {
        console.log("Script error occurred.");
    };

    const handleScriptLoad = () => {
        setScriptLoaded(true);
    };

    return (
        <div className={`address ${showResult ? "showFields" : ""}`}>
            {!scriptLoaded && (
                <Script
                    url={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`}
                    onCreate={handleScriptCreate}
                    onError={handleScriptError}
                    onLoad={handleScriptLoad}
                />
            )}
            <div className="addressInput">
                <input
                    type="search"
                    id={id}
                    placeholder={placeholder}
                    ref={ele => {
                        ele?.addEventListener('search', handleSearchClear);
                    }}
                />
            </div>
            <div className="addressFields">
                {Object.keys(fields).map(key => (
                    <div className={`address-field address-${key}`} key={key}>
                        <input
                            type="text"
                            name={fields[key]}
                            value={fieldsForState[key] || ''}  // Ensure value is not undefined
                            onChange={(e) => handleInputChange(key, e.target.value)}
                        />
                        <label>{fields[key]}</label>
                    </div>
                ))}
            </div>

        </div>
    );
};

GoogleAutoComplete.defaultProps = {
    fields: {
        streetNumber: "",
        streetAddress: "",
        streetAddress2: "",
        naturalFeature: "",
        locality: "",
        cityOrState: "",
        postalcode: "",
        country: "",
        latitude: "",
        longitude: ""
    },
    callbackFunction: f => f
};

export default GoogleAutoComplete;
