const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const tenantId = 'cf6dc6cc-0784-49aa-9246-c7a09b68a09c';
const bearerToken = 'sk_sand_5a12a3d6bb1964b970e20858';

// Middleware to check Bearer Token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('No token provided');

  if (token !== bearerToken) return res.status(403).send('Invalid token');

  next();
}

// // Apply middleware to routes that require authentication
// app.use('/api/create-project', authenticateToken);
// app.use('/api/create-design', authenticateToken);
// app.use('/api/create-proposal', authenticateToken);

// Route to create a project in Aurora Solar API
app.post('/api/create-project', async (req, res) => {
  const auroraEndpoint = `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/projects`;

  console.log("tenantId",tenantId)
  console.log("bearerToken",bearerToken)

  console.log('Creating project. Aurora endpoint:', auroraEndpoint);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    const response = await axios.post(
      auroraEndpoint,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Project created successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Route to create a design
app.post('/api/create-design', async (req, res) => {
  const auroraEndpoint = `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/designs`;
  console.log('Creating design. Aurora endpoint:', auroraEndpoint);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  const { project_id, name, external_provider_id } = req.body.design;
  
  try {
    console.log('Full request:', {
      url: auroraEndpoint,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        design: {
          project_id,
          name,
          external_provider_id
        }
      }
    });

    const response = await axios.post(
      auroraEndpoint,
      {
        design: {
          project_id,
          name,
          external_provider_id
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Full response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    console.log('Design created successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating design:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Route to create a proposal
app.post('/api/create-proposal', async (req, res) => {
  const { designId } = req.body;
  const auroraEndpoint = `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/designs/${designId}/proposals/default`;
  console.log('Creating proposal. Aurora endpoint:', auroraEndpoint);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    const response = await axios.post(
      auroraEndpoint,
      {},
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Proposal created successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating proposal:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Retrieve Project
app.get('/api/projects', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/projects`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }
    );
      res.json(response.data);
  } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).send('Error fetching projects');
  }
});

// // Retrieve Project Details
// app.get('/api/projects/:projectId', async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const response = await axios.get(
//       `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/projects/${projectId}`,
//       {
//         headers: {
//           'Authorization': `Bearer ${bearerToken}`
//         }
//       }
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching project details:', error);
//     res.status(500).send('Error fetching project details');
//   }
// });

// Retrieve Project Details
app.get('/api/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const response = await axios.get(
      `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/projects/${projectId}`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }
    );
    console.log('Project details fetched successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching project details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Retrieve Project Details
app.get('/api/designs/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const response = await axios.get(
      `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/projects/${projectId}/designs`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      }
    );
    console.log('Project details fetched successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching project details:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Retrieve Proposal Details
app.get('/api/proposals/:designId', async (req, res) => {
  const { designId } = req.params;
  const auroraEndpoint = `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/designs/${designId}/proposals/default`;
  
  console.log('Retrieving proposal. Aurora endpoint:', auroraEndpoint);

  try {
    const response = await axios.get(
      auroraEndpoint,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Proposal retrieved successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error retrieving proposal:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Retrieve Web Proposal Details
app.get('/api/web-proposals/:designId', async (req, res) => {
  const { designId } = req.params;
  const auroraEndpoint = `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/designs/${designId}/web_proposal`;
  
  console.log('Retrieving web proposal. Aurora endpoint:', auroraEndpoint);

  try {
    const response = await axios.get(
      auroraEndpoint,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Web proposal retrieved successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error retrieving web proposal:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

// Generate Web Proposal URL
app.post('/api/web-proposals/:designId/generate', async (req, res) => {
  const { designId } = req.params;
  const auroraEndpoint = `https://api-sandbox.aurorasolar.com/tenants/${tenantId}/designs/${designId}/web_proposal/generate_url`;
  
  console.log('Generating web proposal URL. Aurora endpoint:', auroraEndpoint);

  try {
    const response = await axios.post(
      auroraEndpoint,
      {}, // Empty object as body, adjust if the API requires specific data in the request body
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Web proposal URL generated successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error generating web proposal URL:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send(error.response?.data || error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});