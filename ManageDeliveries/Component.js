sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/odata/v2/ODataModel",
  ], function (UIComponent, ODataModel) {
	"use strict";
  
	return UIComponent.extend("khrapun.pavel.Component", {
	  metadata: {
		manifest: "json"
	  },

	    /**
       * Controller's "init" lifecycle method.
       */
  
	  init : function () {
		UIComponent.prototype.init.apply(this, arguments);

		/**
    * Create JSON model, for correct display column "Customer Name" in Delivery application table
    * Create odata model.
	* 
    * @param {sap.ui.base.Event} oEvent the event object
    *
    */
	
		const onSucces = (e) => {
			oODataModel.read("/Customers", {success: (o) => {
				const deliveryAppModel = new sap.ui.model.json.JSONModel({
					DeliveryApplications: e.results.map(el => {
						return {...el, CustomerName: o.results.find(element => element.Id === el.CustomerId).Name}
					})
				})
				this.setModel(deliveryAppModel, "odata")
				this.setModel(oODataModel, "serverData")
				this.getRouter().initialize();
			}})
		}

		/**
    * Create JSON model, for correct display column "Customer Name" and "Manager Name" in Delivery table
    *
    * @param {sap.ui.base.Event} oEvent the event object
    *
    */

		const onDelSucces = (e) => {
			oODataModel.read("/Customers", {success: (o) => {
				oODataModel.read("/Employees", {success: (k) => {
				const deliveryModel = new sap.ui.model.json.JSONModel({
					Delivery: e.results.map(el => {
						return {...el, CustomerName: o.results.find(element => element.Id === el.CustomerId).Name}
					}).map(el => {
						return {...el, ManagerName: k.results.find(element => element.Id === el.ManagerId).Name}})
				})
				this.setModel(deliveryModel, "odataDev")
			}})
			}})
		}

		var oODataModel = new ODataModel("http://localhost:3000/odata", {
		  useBatch: false,
		  defaultBindingMode: "TwoWay",
		  refreshAfterChange: "Enable"
		});

		oODataModel.read("/Deliveries", {success: onDelSucces})
		oODataModel.read("/DeliveryApplications", {success: onSucces})

	  },
	});
  });