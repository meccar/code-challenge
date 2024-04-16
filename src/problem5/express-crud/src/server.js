"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
dotenv.config();
var app = express();
var port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var resources = [];
// Create a new resource
app.post("/resources", function (req, res) {
    var _a = req.body, name = _a.name, description = _a.description;
    var newResource = {
        id: crypto.randomUUID(),
        name: name,
        description: description,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    resources.push(newResource);
    res.status(201).json(newResource);
});
// List resources with basic filters
app.get("/resources", function (req, res) {
    var _a = req.query, name = _a.name, description = _a.description;
    var filteredResources = resources;
    if (name) {
        filteredResources = filteredResources.filter(function (resource) {
            return resource.name.toLowerCase().includes(name.toLowerCase());
        });
    }
    if (description) {
        filteredResources = filteredResources.filter(function (resource) {
            return resource.description
                .toLowerCase()
                .includes(description.toLowerCase());
        });
    }
    res.json(filteredResources);
});
// Get details of a resource
app.get("/resources/:id", function (req, res) {
    var id = req.params.id;
    var resource = resources.find(function (r) { return r.id === id; });
    if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
    }
    res.json(resource);
});
// Update resource details
app.put("/resources/:id", function (req, res) {
    var id = req.params.id;
    var _a = req.body, name = _a.name, description = _a.description;
    var resourceIndex = resources.findIndex(function (r) { return r.id === id; });
    if (resourceIndex === -1) {
        return res.status(404).json({ error: "Resource not found" });
    }
    var updatedResource = __assign(__assign({}, resources[resourceIndex]), { name: name, description: description, updatedAt: new Date() });
    resources[resourceIndex] = updatedResource;
    res.json(updatedResource);
});
// Delete a resource
app.delete("/resources/:id", function (req, res) {
    var id = req.params.id;
    var resourceIndex = resources.findIndex(function (r) { return r.id === id; });
    if (resourceIndex === -1) {
        return res.status(404).json({ error: "Resource not found" });
    }
    resources.splice(resourceIndex, 1);
    res.sendStatus(204);
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
