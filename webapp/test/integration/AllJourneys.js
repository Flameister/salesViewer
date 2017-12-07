jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 BusinessPartnerSet in the list
// * All 3 BusinessPartnerSet have at least one ToSalesOrders

sap.ui.require([
	"sap/ui/test/Opa5",
	"salesviewer/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"salesviewer/test/integration/pages/App",
	"salesviewer/test/integration/pages/Browser",
	"salesviewer/test/integration/pages/Master",
	"salesviewer/test/integration/pages/Detail",
	"salesviewer/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "salesviewer.view."
	});

	sap.ui.require([
		"salesviewer/test/integration/MasterJourney",
		"salesviewer/test/integration/NavigationJourney",
		"salesviewer/test/integration/NotFoundJourney",
		"salesviewer/test/integration/BusyJourney",
		"salesviewer/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});