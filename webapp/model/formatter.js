sap.ui.define([
	], function () {
		"use strict";

		return {
			
			overValueDetail : function (sValue) {
				if (sValue > 10000) {
					return sap.ui.core.ValueState.Error;
				} else {
					return sap.ui.core.ValueState.None;
				} 
			},
				
						formatMapUrl: function(sStreet, sBuilding, sZIP, sCity, sCountry) {
								return "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=320x320&markers="
								+ jQuery.sap.encodeURL(sStreet + " " + sBuilding + ", " + sZIP +  " " + sCity + ", " + sCountry);
			}

		};

	}
);