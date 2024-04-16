import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

interface Resource {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

let resources: Resource[] = [];

// Create a new resource
app.post("/resources", (req, res) => {
  const { name, description } = req.body;
  const newResource: Resource = {
    id: crypto.randomUUID(),
    name,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  resources.push(newResource);
  res.status(201).json(newResource);
});

// List resources with basic filters
app.get("/resources", (req, res) => {
  const { name, description } = req.query;
  let filteredResources = resources;

  if (name) {
    filteredResources = filteredResources.filter((resource) =>
      resource.name.toLowerCase().includes((name as string).toLowerCase()),
    );
  }

  if (description) {
    filteredResources = filteredResources.filter((resource) =>
      resource.description
        .toLowerCase()
        .includes((description as string).toLowerCase()),
    );
  }

  res.json(filteredResources);
});

// Get details of a resource
app.get("/resources/:id", (req, res) => {
  const { id } = req.params;
  const resource = resources.find((r) => r.id === id);
  if (!resource) {
    return res.status(404).json({ error: "Resource not found" });
  }
  res.json(resource);
});

// Update resource details
app.put("/resources/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const resourceIndex = resources.findIndex((r) => r.id === id);
  if (resourceIndex === -1) {
    return res.status(404).json({ error: "Resource not found" });
  }
  const updatedResource: Resource = {
    ...resources[resourceIndex],
    name,
    description,
    updatedAt: new Date(),
  };
  resources[resourceIndex] = updatedResource;
  res.json(updatedResource);
});

// Delete a resource
app.delete("/resources/:id", (req, res) => {
  const { id } = req.params;
  const resourceIndex = resources.findIndex((r) => r.id === id);
  if (resourceIndex === -1) {
    return res.status(404).json({ error: "Resource not found" });
  }
  resources.splice(resourceIndex, 1);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
