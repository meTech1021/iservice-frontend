import  React  from  'react'
import GoogleAutoComplete from './GoogleAutoComplete/GoogleAutoComplete';

class  Example  extends  React.Component  {
	constructor()  {
		super()
		this.callbackFunc = this.callbackFunc.bind(this)

	}

	callbackFunc  = ( autoCompleteData ) => {
		//You can use the address data, passed by autocomplete as you want.
	}

	render()  {
		
		return  (
			<GoogleAutoComplete
				apiKey="AIzaSyBwzbz3UcUkp4l5qsD0clePzJZtyLIhf9U"
				id='location'
				fields={{
					streetNumber: "street_number",
					naturalFeature: "natural_feature",
					streetAddress: "route",
					streetAddress2: "administrative_area_level_4",
					locality: "locality",
					cityOrState: "administrative_area_level_1",
					postalcode: "postal_code",
					country: "country",
					latitude: "Latitude",
					longitude: "Longitude",
				}}
				callbackFunction={this.callbackFunc}
				style={{ zIndex: 10000 }}
			/>


		)

	}

}

export  default  Example