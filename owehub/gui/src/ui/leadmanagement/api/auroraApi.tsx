import { toast } from 'react-toastify';
import {
  auroraCreateDesign,
  auroraCreateProject,
  auroraCreateProposal,
  auroraGenerateWebProposal,
  auroraListModules,
  auroraWebProposal,
} from '../../../redux/apiActions/leadManagement/LeadManagementAction';

type SSEPayload =
  | {
      is_done: false;
      data: {
        current_step: number;
        total_steps: number;
      };
    }
  | {
      is_done: true;
      data: {
        current_step: number;
        total_steps: number;
        url: string;
      };
      error: null;
    }
  | {
      is_done: true;
      error: string;
      data: null;
    };

// Function to handle creating a proposal
export const handleCreateProposal = (
  leadId: number,
  setRefresh: (value: (prev: number) => number) => void,
  dispatch: any
) => {
  return async () => {
    try {
      // Step 1: Fetch preferred solar modules using dispatch
      const modulesResult = await dispatch(auroraListModules({}));

      if (auroraListModules.fulfilled.match(modulesResult)) {
        const modulesData = modulesResult.payload.data;

        if (modulesData.length > 0) {
          const moduleIds = modulesData.map((module: any) => module.id); // Extract the ids from the module list

          // Step 2: Create Project with dynamic preferred solar modules
          const createProjectResult = await dispatch(
            auroraCreateProject({
              leads_id: leadId,
              customer_salutation: 'Mr./Mrs.',
              project_type: 'residential',
              status: 'In Progress',
              preferred_solar_modules: moduleIds,
              tags: ['third_party_1'],
            })
          );

          if (auroraCreateProject.fulfilled.match(createProjectResult)) {
            // Step 3: Create Design
            const createDesignResult = await dispatch(
              auroraCreateDesign({ leads_id: leadId })
            );
            if (auroraCreateDesign.fulfilled.match(createDesignResult)) {
              // Step 4: Create Proposal
              const createProposalResult = await dispatch(
                auroraCreateProposal({ leads_id: leadId })
              );

              if (auroraCreateProposal.fulfilled.match(createProposalResult)) {
                const proposalData = createProposalResult.payload.data;

                if (proposalData.proposal_link) {
                  // Step 5: Generate Web Proposal
                  await downloadProposalWithSSE(leadId, (isLoading) => {}, (progress) => {});

                  toast.success('Proposal created successfully!');
                  setRefresh((prev) => prev + 1);

                  // Open the proposal link in a new tab
                  window.open(proposalData.proposal_link, '_blank');
                } else {
                  toast.error('Proposal link not available.');
                }
              } else {
                toast.error(
                  (createProposalResult.payload as string) ||
                    'Failed to create proposal'
                );
              }
            } else {
              toast.error(
                (createDesignResult.payload as string) ||
                  'Failed to create design'
              );
            }
          } else {
            toast.error(
              (createProjectResult.payload as string) ||
                'Failed to create project'
            );
          }
        } else {
          toast.error('No solar modules available.');
        }
      } else {
        toast.error('Failed to fetch solar modules');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error in handleCreateProposal:', error);
    }
  };
};

export const generateWebProposal = (leadId: number, dispatch: any) => {
  return async () => {
    try {
      // Generate Web Proposal
      const generateProposalResult = await dispatch(
        auroraGenerateWebProposal({ leads_id: leadId })
      );

      if (auroraGenerateWebProposal.fulfilled.match(generateProposalResult)) {
        const generatedProposalData = generateProposalResult.payload.data;
        if (generatedProposalData.url) {
          toast.success('Web proposal generated successfully!');
          return generatedProposalData;
        } else {
          toast.error('Failed to generate web proposal.');
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      toast.error(
        'An unexpected error occurred while generating the web proposal'
      );
      console.error('Error in generateWebProposal:', error);
      return null;
    }
  };
};

export const retrieveWebProposal = (leadId: number, dispatch: any) => {
  return async () => {
    try {
      // Retrieve Web Proposal
      const webProposalResult = await dispatch(auroraWebProposal(leadId));

      if (auroraWebProposal.fulfilled.match(webProposalResult)) {
        const webProposalData = webProposalResult.payload.data;

        if (webProposalData.url) {
          toast.success('Web proposal retrieved successfully!');
          window.open(webProposalData.url, '_blank');
        } else if (webProposalData.url_expired) {
          toast.error('Web proposal URL has expired. Please regenerate.');
        } else {
          toast.error('No web proposal available.');
        }
      } else {
      }
    } catch (error) {
      toast.error(
        'An unexpected error occurred while retrieving the web proposal'
      );
      console.error('Error in retrieveWebProposal:', error);
    }
  };
};

const environments = {
  development: 'https://staging.owe-hub.com',
  staging: 'https://staging.owe-hub.com',
  production: 'https://owe-hub.com'
};

const getBaseUrl = () => {
  // Can be set via env variables or build config
  const env = (process.env.REACT_APP_ENV || 'staging') as 'development' | 'staging' | 'production';
  return environments[env];
};

export const downloadProposalWithSSE = (
  leadId: number, 
  onLoadingChange: (isLoading: boolean) => void,
  onProgress: (progress: number) => void
) => {
  const baseUrl = getBaseUrl();
  onLoadingChange(true);
  
  const eventSource = new EventSource(
    `${baseUrl}/api/owe-leads-service/v1/aurora_generate_pdf?leads_id=${leadId}`
  );

  eventSource.onmessage = (event) => {
    const payload: SSEPayload = JSON.parse(event.data);

    if (!payload.is_done) {
      const progressPercentage = 
        (payload.data.current_step / payload.data.total_steps) * 100;
      onProgress(progressPercentage);
      console.log(`PDF generation in progress: ${progressPercentage}%`);
    } else if (payload.is_done) {
      if (payload.data?.url) {
        window.open(payload.data.url, '_self');
      }
      eventSource.close();
      onLoadingChange(false);
    }
  };
};
