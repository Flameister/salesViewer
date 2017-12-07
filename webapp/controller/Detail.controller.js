/*global location */
sap.ui.define([
			"salesviewer/controller/BaseController",
			"sap/ui/model/json/JSONModel",
			"salesviewer/model/formatter",
			"sap/ui/Device"
		], function(BaseController, JSONModel, formatter, Device, googleMaps) {
			"use strict";
			return BaseController.extend("salesviewer.controller.Detail", {
					formatter: formatter,

					onInit: function() {
						
						var oViewModel = new JSONModel({
							busy: false,
							delay: 0,
							lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
						});
						this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
						this.setModel(oViewModel, "detailView");
						this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
						this._bindMap();
					},

					onListUpdateFinished: function(oEvent) {
						var sTitle, iTotalItems = oEvent.getParameter("total"),
							oViewModel = this.getModel("detailView");
						// only update the counter if the length is final
						if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
							if (iTotalItems) {
								sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
							} else {
								//Display 'Line Items' instead of 'Line items (0)'
								sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
							}
							oViewModel.setProperty("/lineItemListTitle", sTitle);
						}
					},

					onSalesOrderPress: function(oEvent) {
						this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
					},

					_showDetail: function(oItem) {
						var bReplace = !Device.system.phone;
						this.getRouter().navTo("salesOrderDetail", {
							orderId: oItem.getBindingContext().getProperty("SalesOrderID")
						}, bReplace);

					},

					_onObjectMatched: function(oEvent) {
						var sObjectId = oEvent.getParameter("arguments").objectId;
						this.getModel().metadataLoaded().then(function() {
							var sObjectPath = this.getModel().createKey("BusinessPartnerSet", {
								BusinessPartnerID: sObjectId
							});
							this._bindView("/" + sObjectPath);
						}.bind(this));
					},

					_bindView: function(sObjectPath) {
						// Set busy indicator during view binding
						var oViewModel = this.getModel("detailView");
						// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
						oViewModel.setProperty("/busy", false);
						this.getView().bindElement({
							path: sObjectPath,
							events: {
								change: this._onBindingChange.bind(this),
								dataRequested: function() {
									oViewModel.setProperty("/busy", true);
								},
								dataReceived: function() {
									oViewModel.setProperty("/busy", false);
								}
							}
						});
					},

					_onBindingChange: function() {
						var oView = this.getView(),
							oElementBinding = oView.getElementBinding();
						// No data for the binding
						if (!oElementBinding.getBoundContext()) {
							this.getRouter().getTargets().display("detailObjectNotFound");
							// if object could not be found, the selection in the master list
							// does not make sense anymore.
							this.getOwnerComponent().oListSelector.clearMasterListSelection();
							return;
						}
						var sPath = oElementBinding.getPath();
						this.getOwnerComponent().oListSelector.selectAListItem(sPath);
					},
					_onMetadataLoaded: function() {
						// Store original busy indicator delay for the detail view
						var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
							oViewModel = this.getModel("detailView"),
							oLineItemTable = this.byId("lineItemsList"),
							iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();
						// Make sure busy indicator is displayed immediately when
						// detail view is displayed for the first time
						oViewModel.setProperty("/delay", 0);
						oViewModel.setProperty("/lineItemTableDelay", 0);
						oLineItemTable.attachEventOnce("updateFinished", function() {
							oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
						});
						// Binding the view will set it to not busy - so the view is always busy if it is not bound
						oViewModel.setProperty("/busy", true);
						// Restore original busy indicator delay for the detail view
						oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
					},
					_bindMap: function() {
						//Create JSON Model with URL
/*var oModel = new sap.ui.model.json.JSONModel();

//API Key for API Sandbox
var sHeaders = {"Content-Type":"application/json","Accept":"application/json, application/xml","APIKey":"fPAgELtGEWRnv4OMfEdsOLeetONs3J2U"};

//sending request
//API endpoint for API sandbox 
oModel.loadData("https://sandbox.api.sap.com/here/geocoder/6.2/geocode.json", null, true, "GET", null, false, sHeaders);
//Optional query parameters: "strictlanguagemode" , "pageinformation"
//To view the complete list of query parameters, see its API definition.

//Available API Endpoints
//https://geocoder.cit.api.here.com/6.2

//You can assign the created data model to a View and UI5 controls can be bound to it. Please refer documentation available at the below link for more information.
//https://sapui5.hana.ondemand.com/#docs/guide/96804e3315ff440aa0a50fd290805116.html#loio96804e3315ff440aa0a50fd290805116

//The below code snippet for printing on the console is for testing/demonstration purpose only. 
// This must not be done in real UI5 applications.
oModel.attachRequestCompleted(function(oEvent){
    var oData = oEvent.getSource().oData;
    console.log(oData);
});*/

					}
					});
			});