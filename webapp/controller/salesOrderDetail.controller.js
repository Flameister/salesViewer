sap.ui.define([
	"salesviewer/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"salesviewer/model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/Device"
], function(BaseController, JSONModel, formatter, History, Device) {
		"use strict";
		
		return BaseController.extend("salesviewer.controller.salesOrderDetail", {
			formatter: formatter,
			
			onInit: function() {
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy: true,
						delay: 0
					});
	
				this.getRouter().getRoute("salesOrderDetail").attachPatternMatched(this._onObjectMatched, this);
				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "detailView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function() {
					// Restore original busy indicator delay for the object view
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});
			},
			
			onNavBack: function(oEvent) {
				var bReplace = true;
				this.getView().unbindElement();
					// There is no history!
				this.getRouter()
						.navTo("master", bReplace);
						
				
			},
			
			_onObjectMatched: function(oEvent) {
				var sObjectId = oEvent.getParameter("arguments").orderId;
				this.getModel().metadataLoaded().then(function() {
					var sObjectPath = this.getModel().createKey("SalesOrderSet", {
						SalesOrderID: sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},
			
			_bindView: function(sObjectPath) {
				var oViewModel = this.getModel("detailView"),
					oDataModel = this.getModel();
	
				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function() {
							oDataModel.metadataLoaded().then(function() {
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function() {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},
			_onBindingChange: function(oEvent) {
				var oView = this.getView();
	
				// No data for the binding
				if (!oView.getBindingContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}
			}
			

	});
}
);