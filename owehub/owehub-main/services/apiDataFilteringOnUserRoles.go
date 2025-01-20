/**************************************************************************
 * File       	   : apiDataFilteringOnUserRoles.go
 * DESCRIPTION     : This file contains functions to get the datas
										 assosiated with the logged in user
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"fmt"
	"strings"
)

/*
	This function helps us to get data of the particular logged in user
	The roles that are being considered at present for these operation are
	1. Admin
	2. Finance Admin
	3. Account Executive
	4. Account Manager
	5. Dealer Owner
	6. SubDealer Owner
	7. Regional Manager
	8. Sales Manager
	9. Sales Rep
*/

func HandleDataFilterOnUserRoles(email, userRole, customerTableAlias string, DealerNames []string) (string, error) {

	var (
		err        error
		userName   string
		dealerName string
		filter     string
	)

	log.EnterFn(0, "HandleDataFilterOnUserRoles")
	defer func() { log.ExitFn(0, "HandleDataFilterOnUserRoles", err) }()

	/*
		For the below mentioned roles, it is necessary to be given the set
		of dealer names for which data has to be present.
		For other roles we get the dealer name from DB
	*/
	if userRole == string(types.RoleAdmin) || userRole == string(types.RoleFinAdmin) || userRole == string(types.RoleAccountExecutive) || userRole == string(types.RoleAccountManager) {
		if len(DealerNames) <= 0 {
			return "", fmt.Errorf("<not an error> empty dealer names in req present, user: %v", email)
		}
	} else {
		userName, dealerName, err = fetchDealerNameForUser(email, userRole)
		if err != nil {
			return "", err
		}
		DealerNames = []string{dealerName}
	}

	filter, err = createFilterForRoles(email, userRole, userName, customerTableAlias, DealerNames)
	return filter, nil
}

func createFilterForRoles(email, userRole, userName, customerTableAlias string, dealerNames []string) (string, error) {
	var (
		err            error
		filtersBuilder strings.Builder
		filter         string
	)

	log.EnterFn(0, "createFilterForRoles")
	defer func() { log.ExitFn(0, "createFilterForRoles", err) }()

	joinedDealerNames := joinNames(dealerNames)
	switch userRole {
	/* Group 1: Roles with access to all dealer names */
	case "Admin", "Finance Admin", "Account Executive", "Account Manager":
		filtersBuilder.WriteString(fmt.Sprintf(" %s.dealer IN (", customerTableAlias))
		filtersBuilder.WriteString(joinedDealerNames)
		filtersBuilder.WriteString(") ")

	/* Group 2: Dealer owner with access to their own dealer name */
	case "Dealer Owner":
		filtersBuilder.WriteString(fmt.Sprintf(" %s.dealer IN (", customerTableAlias))
		filtersBuilder.WriteString(joinedDealerNames)
		filtersBuilder.WriteString(") ")

	/* Group 3: Roles with access to sales rep names and their data */
	case "SubDealer Owner", "Regional Manager", "Sales Manager":
		salesRepNames, err := fetchSalesRepNames(email)
		if err != nil {
			return "", err
		}
		joinedSalesRepNames := joinNames(salesRepNames)
		filtersBuilder.WriteString(fmt.Sprintf(" %s.dealer IN (", customerTableAlias))
		filtersBuilder.WriteString(joinedDealerNames)
		filtersBuilder.WriteString(") ")

		filtersBuilder.WriteString(fmt.Sprintf(" AND (%s.primary_sales_rep IN (", customerTableAlias))
		filtersBuilder.WriteString(joinedSalesRepNames)
		filtersBuilder.WriteString(") ")

		filtersBuilder.WriteString(fmt.Sprintf(" OR %s.secondary_sales_rep IN (", customerTableAlias))
		filtersBuilder.WriteString(joinedSalesRepNames)
		filtersBuilder.WriteString(")) ")

	/* Group 4: Sales rep with access to their own data */
	case "Sale Representative":
		filtersBuilder.WriteString(fmt.Sprintf(" %s.dealer IN (", customerTableAlias))
		filtersBuilder.WriteString(joinedDealerNames)
		filtersBuilder.WriteString(") ")

		escapedUserName := "'" + strings.Replace(userName, "'", "''", -1) + "'"
		filtersBuilder.WriteString(fmt.Sprintf(" AND (%s.primary_sales_rep = ", customerTableAlias))
		filtersBuilder.WriteString(escapedUserName)
		filtersBuilder.WriteString(fmt.Sprintf(" OR %s.secondary_sales_rep = ", customerTableAlias))
		filtersBuilder.WriteString(escapedUserName)
		filtersBuilder.WriteString(") ")

	/* Default case to handle any undefined roles */
	default:
		err = fmt.Errorf("unauthorized role for user %v role %v", email, userRole)
		return "", err
	}

	filter = filtersBuilder.String()
	return filter, nil
}

func fetchSalesRepNames(email string) ([]string, error) {
	var (
		whereEleList []interface{}
		err          error
		SaleRepList  []string
	)

	log.EnterFn(0, "fetchSalesRepNames")
	defer func() { log.ExitFn(0, "fetchSalesRepNames", err) }()

	saleRepUnderRolesQuery := models.SalesRepRetrieveQueryFunc()
	whereEleList = append(whereEleList, email)

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, saleRepUnderRolesQuery, whereEleList)
	if len(data) == 0 || err != nil {
		err = fmt.Errorf("<emptyerror> no sales rep under the user %v", email)
		return nil, err
	}
	for _, item := range data {
		SaleRepName, Ok := item["name"].(string)
		if !Ok || SaleRepName == "" {
			log.FuncErrorTrace(0, "failed to get name. Item: %+v\n user %v", item, email)
			continue
		}
		SaleRepList = append(SaleRepList, SaleRepName)
	}
	return SaleRepList, nil
}

func fetchDealerNameForUser(email, userRole string) (string, string, error) {
	var (
		whereEleList []interface{}
		err          error
	)

	log.EnterFn(0, "fetchDealerNameForUser")
	defer func() { log.ExitFn(0, "fetchDealerNameForUser", err) }()

	userDetailsQuery := models.AdminDlrSaleRepRetrieveQueryFunc()
	whereEleList = append(whereEleList, email)
	/*
		This fetches the role name, name and dealer name of the logged in user
	*/
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, userDetailsQuery, whereEleList)
	if err != nil || len(data) == 0 {
		err = fmt.Errorf("unable to fetch user details for user: %v", email)
		return "", "", err
	}

	userName, ok := data[0]["name"].(string)
	if (userRole == "Sale Representative") && (!ok || len(userName) == 0) {
		err = fmt.Errorf("unable to fetch user name for user: %v and role is sales rep", email)
		return "", "", err
	}
	dealerName, ok := data[0]["dealer_name"].(string)
	if dealerName == "" || !ok {
		err = fmt.Errorf("unable to fetch dealer name for user: %v", email)
		return "", "", err
	}

	return userName, dealerName, nil
}

func joinNames(dealerNames []string) (joinedNames string) {
	if len(dealerNames) > 0 {
		escapedNames := make([]string, len(dealerNames))
		for i, name := range dealerNames {
			escapedNames[i] = "'" + strings.Replace(name, "'", "''", -1) + "'"
		}
		joinedNames = strings.Join(escapedNames, ", ")
	}
	return joinedNames
}
