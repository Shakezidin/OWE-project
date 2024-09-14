import { TYPE_OF_USER } from "../resources/static_data/Constant"
import { ROUTES } from "../routes/routes"
import Leaderboard from '../ui/leaderboard';
import PendingQueue from "../ui/oweHub/pendingQueue";
import ProjectPerformence from '../ui/oweHub/projectTracker/ProjectPerformence';
import ProjectStatus from '../ui/oweHub/projectTracker/ProjectStatus';
import { DashboardPage } from '../ui/oweHub/dashboard/DashboardPage';
import TeamManagement from '../ui/oweHub/teammanagement/dashboard';
import UserManagement from "../ui/oweHub/userManagement/UserManagement";
import TechnicalSupport from "../ui/oweHub/technicalSupport/TechnicalSupport";
import ConfigurePage from '../ui/oweHub/configure/ConfigurePage';
import TeamTable from "../ui/oweHub/teammanagement/teamtable";
export default [

    {
        route: ROUTES.LEADERBOARD, element: Leaderboard,
        available: [
            TYPE_OF_USER.ADMIN,
            TYPE_OF_USER.DEALER_OWNER,
            TYPE_OF_USER.ACCOUNT_EXCUTIVE,
            TYPE_OF_USER.ACCOUNT_MANAGER,
            TYPE_OF_USER.SALES_REPRESENTATIVE,
            TYPE_OF_USER.SALE_MANAGER,
            TYPE_OF_USER.REGIONAL_MANGER
        ],
        stagingOnly: false
    },

    {
        route: ROUTES.PEINDING_QUEUE, element: PendingQueue,
        available: [
            TYPE_OF_USER.ADMIN,
            TYPE_OF_USER.DEALER_OWNER,
            TYPE_OF_USER.ACCOUNT_EXCUTIVE,
            TYPE_OF_USER.ACCOUNT_MANAGER
        ],
        stagingOnly: false
    },

    {
        route: ROUTES.PROJECT_PERFORMANCE, element: ProjectPerformence,
        available: [
            TYPE_OF_USER.ADMIN,
            TYPE_OF_USER.DEALER_OWNER,
            TYPE_OF_USER.ACCOUNT_EXCUTIVE,
            TYPE_OF_USER.ACCOUNT_MANAGER
        ],
        stagingOnly: false
    },

    {
        route: ROUTES.PROJECT_STATUS, element: ProjectStatus,
        available: [
            TYPE_OF_USER.ADMIN,
            TYPE_OF_USER.DEALER_OWNER,
            TYPE_OF_USER.ACCOUNT_EXCUTIVE,
            TYPE_OF_USER.ACCOUNT_MANAGER
        ],
        stagingOnly: false
    },

    {
        route: ROUTES.COMMISSION_DASHBOARD, element: DashboardPage,
        available: [
            TYPE_OF_USER.ADMIN,
            TYPE_OF_USER.DEALER_OWNER,
            TYPE_OF_USER.ACCOUNT_EXCUTIVE,
            TYPE_OF_USER.ACCOUNT_MANAGER
        ],
        stagingOnly: true
    },
    {
        route: ROUTES.TEAM_MANAGEMENT_DASHBOARD, element: TeamManagement,
        available: [
            TYPE_OF_USER.ADMIN,
            TYPE_OF_USER.DEALER_OWNER,
            TYPE_OF_USER.ACCOUNT_EXCUTIVE,
            TYPE_OF_USER.ACCOUNT_MANAGER
        ],
        stagingOnly: false
    },

    {
        route: ROUTES.USER_MANAEMENT, element: UserManagement,
        available: [
            TYPE_OF_USER.ADMIN,
        ],
        stagingOnly: false
    },
    {
        route: ROUTES.CONFIG_PAGE, element: ConfigurePage,
        available: [
            TYPE_OF_USER.ADMIN,
        ],
        stagingOnly: false
    },
    {
        route: ROUTES.TEAM_MANAGEMENT_TABLE, element: TeamTable,
        available: [
            TYPE_OF_USER.ADMIN,
        ],
        stagingOnly: false
    },
    {
        route: ROUTES.TECHNICAL_SUPPORT, element: TechnicalSupport,
        available: Object.keys(TYPE_OF_USER),
        stagingOnly: false
    }
]
