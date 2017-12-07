jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"salesviewer/test/integration/NavigationJourneyPhone",
		"salesviewer/test/integration/NotFoundJourneyPhone",
		"salesviewer/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});